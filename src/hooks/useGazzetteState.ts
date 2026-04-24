import { useState, useEffect } from 'react';
import type { GazzetteState } from '../types/gazzette';

const STORAGE_KEY = 'tps_gazzette_draft';

const defaultState: GazzetteState = {
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
  secondaryArticle2: {
    kicker: "PROFILES",
    headline: "Inside the New QA Taskforce",
    content: "The newly formed Quality Assurance Taskforce brings together multidisciplinary experts to address emerging challenges in cross-departmental compliance. Their first mandate: standardizing documentation protocols across all international branches.",
  }
};

export function useGazzetteState() {
  const [state, setState] = useState<GazzetteState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as GazzetteState;
      } catch (e) {
        console.error('Failed to parse saved state:', e);
      }
    }
    return defaultState;
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [state]);

  const updateState = (updater: (draft: GazzetteState) => void | GazzetteState) => {
    setState((prev) => {
      const nextState = JSON.parse(JSON.stringify(prev));
      const result = updater(nextState);
      return result || nextState;
    });
  };

  const resetState = () => {
    setState(defaultState);
  };

  return { state, updateState, resetState };
}