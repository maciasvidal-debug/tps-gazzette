import { useState, useEffect, useCallback } from 'react';
import type { GazzetteState, Snapshot } from '../types/gazzette';
import { logger } from '../utils/logger';

const STORAGE_KEY = 'tps_gazzette_draft';
const SNAPSHOTS_KEY = 'tps_gazzette_snapshots';

const defaultState: GazzetteState = {
  themeColors: {
    primary: '#3c2065',
    accent1: '#5e3898',
    accent2: '#a57ced',
    quote: '#8b2c39',
    text: '#1f2937'
  },

  masthead: {
    title: 'THE TPS GAZZETTE',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    volume: 'Vol. 1',
    tags: ['RESEARCH', 'INNOVATION', 'CULTURE'],
  },
  spotlight: {
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800&h=800',
    caption: 'Recent laboratory findings point to unexpected correlations.',
    grayscale: true,
  },
  quote: {
    text: "Innovation is not the product of logic, but of independent thought.",
    author: "Albert Einstein",
  },
  staffBox: {
    editorInChief: "Jane Doe",
    contributors: ["John Smith", "Alice Johnson"],
    artDirection: "TPS Creative",
    copyright: "© 2024 TPS Corporate. All rights reserved.",
  },
  featureStory: {
    kicker: "FEATURE STORY",
    headline: "The Paradigm Shift in Quality by Design",
    author: "Dr. Elena Rostova",
    paragraphs: [
      "In the ever-evolving landscape of industrial standards, the concept of Quality by Design (QbD) has transcended its origins as a mere regulatory buzzword to become the foundational philosophy of modern manufacturing. This paradigm shift demands a rigorous, data-driven approach from the very inception of a product's lifecycle.",
      "Recent meta-analyses of production yields across the sector indicate a staggering 40% reduction in critical deviations when QbD principles are strictly implemented during the R&D phase. The implications for cost-efficiency and product efficacy are profound.",
      "Furthermore, the integration of real-time monitoring technologies has allowed for unprecedented control over critical process parameters. We are no longer reacting to quality failures; we are engineering them out of existence.",
      "As we move forward, the challenge will be to scale these methodologies across diverse operational contexts without losing the granular control that makes them effective."
    ],
    pullQuote: "We are no longer reacting to quality failures; we are engineering them out of existence.",
    pullQuotePosition: 2,
  },
  secondaryArticle1: {
    kicker: "RESEARCH 101",
    headline: "Understanding Process Analytical Technology",
    content: "Process Analytical Technology (PAT) represents a framework for innovative pharmaceutical development, manufacturing, and quality assurance. By designing, analyzing, and controlling manufacturing through timely measurements of critical quality attributes, we ensure final product quality.",
  },
  feelGoodCorner: '"Excellence is not an act, but a habit."',
  secondaryArticle2: {
    kicker: "PROFILES",
    headline: "Inside the New QA Taskforce",
    content: "The newly formed Quality Assurance Taskforce brings together multidisciplinary experts to address emerging challenges in cross-departmental compliance. Their first mandate: standardizing documentation protocols across all international branches.",
  },
  advertorial: {
    company: "TPS Innovations",
    headline: "Next-Gen Analytics Software Released",
    content: "Elevate your process control with our new suite of predictive analytics tools. Early adopters have reported a 20% increase in efficiency.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300&h=200",
    link: "https://example.com/analytics"
  },
  agenda: {
    title: 'Upcoming Events',
    events: [
      {
        id: '1',
        title: 'Quarterly Town Hall',
        date: 'Next Friday, 2 PM',
        description: 'Join us for Q3 updates and roadmap discussions.'
      }
    ]
  },
  workflowStatus: 'draft',
  editorialNotes: [],
};

export function useGazzetteState() {
  const [history, setHistory] = useState<{
    past: GazzetteState[];
    present: GazzetteState;
    future: GazzetteState[];
  }>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { past: [], present: JSON.parse(saved) as GazzetteState, future: [] };
      } catch (e) {
        logger.error('Failed to parse saved state:', e);
      }
    }
    return { past: [], present: defaultState, future: [] };
  });

  const state = history.present;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.present));
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [history.present]);

  const updateState = useCallback((updater: (draft: GazzetteState) => void | GazzetteState) => {
    setHistory((prev) => {
      const draft = structuredClone(prev.present);
      const result = updater(draft);
      const newPresent = (result !== undefined ? result : draft) as GazzetteState;

      // If no actual structural change (shallow compare of stringified version to avoid deep equal cost on every keystroke)
      // Wait, stringify on every keystroke is expensive. We'll assume updater always means intent to change.

      const newPast = [...prev.past, prev.present];
      // Limit history to last 30 actions to save memory
      if (newPast.length > 30) {
          newPast.shift();
      }

      return {
        past: newPast,
        present: newPresent,
        future: [] // Any new action invalidates the redo future
      };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  const resetState = useCallback(() => {
    setHistory((prev) => ({
       past: [...prev.past, prev.present],
       present: defaultState,
       future: []
    }));
  }, []);

  const [snapshots, setSnapshots] = useState<Snapshot[]>(() => {
    const saved = localStorage.getItem(SNAPSHOTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as Snapshot[];
      } catch (e) {
        logger.error('Failed to parse saved snapshots:', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(snapshots));
  }, [snapshots]);

  const saveSnapshot = useCallback((name: string) => {
    setSnapshots((prev) => {
      const newSnapshot: Snapshot = {
        id: crypto.randomUUID(),
        name,
        timestamp: new Date().toISOString(),
        state: history.present
      };
      return [newSnapshot, ...prev];
    });
  }, [history.present]);

  const loadSnapshot = useCallback((id: string) => {
    const snapshot = snapshots.find(s => s.id === id);
    if (snapshot) {
      setHistory((prev) => ({
        past: [...prev.past, prev.present],
        present: snapshot.state,
        future: []
      }));
    }
  }, [snapshots]);

  const deleteSnapshot = useCallback((id: string) => {
    setSnapshots((prev) => prev.filter(s => s.id !== id));
  }, []);

  return {
    state,
    updateState,
    resetState,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    snapshots,
    saveSnapshot,
    loadSnapshot,
    deleteSnapshot
  };
}
