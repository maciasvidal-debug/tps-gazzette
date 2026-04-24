import React, { useState } from 'react';
import type { GazzetteState } from '../types/gazzette';

interface EditorSidebarProps {
  state: GazzetteState;
  updateState: (updater: (draft: GazzetteState) => void) => void;
  resetState: () => void;
  onExportPdf: (mode?: 'digital' | 'print') => void;
}

const AccordionSection: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode
}> = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="border-b border-[#2C2D35]">
      <button
        onClick={onToggle}
        className="w-full py-4 px-6 flex justify-between items-center text-[#E5E7EB] hover:bg-[#2C2D35] transition-colors"
      >
        <span className="font-sans text-xs font-bold tracking-widest uppercase">{title}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-6 bg-[#1A1A1E] space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

export const EditorSidebar: React.FC<EditorSidebarProps> = ({ state, updateState, resetState, onExportPdf }) => {
  const [openSection, setOpenSection] = useState<string | null>('masthead');
  const [exportMode, setExportMode] = useState<'digital' | 'print'>('digital');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleChange = <S extends keyof GazzetteState, F extends keyof GazzetteState[S]>(
    section: S,
    field: F,
    value: GazzetteState[S][F]
  ) => {
    updateState((draft) => {
      draft[section][field] = value;
    });
  };

  const handleParagraphChange = (index: number, value: string) => {
    updateState((draft) => {
      draft.featureStory.paragraphs[index] = value;
    });
  };

  const addParagraph = () => {
    updateState((draft) => {
      draft.featureStory.paragraphs.push("");
    });
  };

  const removeParagraph = (index: number) => {
    updateState((draft) => {
      draft.featureStory.paragraphs.splice(index, 1);
    });
  };

  const inputClass = "w-full bg-[#212126] border border-[#343541] rounded text-[#E5E7EB] p-2 text-sm focus:border-[#ED6A5E] focus:outline-none focus:ring-1 focus:ring-[#ED6A5E] transition-colors placeholder-[#4B4C56]";
  const labelClass = "block text-[#8B8D98] mb-1 text-xs font-bold uppercase tracking-wider font-sans";

  return (
    <div className="w-80 bg-[#212126] border-r border-[#1A1A1E] h-screen flex flex-col z-10 relative">
      <div className="p-4 flex justify-between items-center bg-[#2C2D35] border-b border-[#1A1A1E]">
        <h2 className="text-[#E5E7EB] font-sans text-sm font-bold tracking-widest uppercase flex items-center gap-2">
          <svg className="w-4 h-4 text-[#ED6A5E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
          Layout Editor
        </h2>
        <button
          onClick={resetState}
          className="text-[#8B8D98] hover:text-[#E5E7EB] p-1 rounded hover:bg-[#343541]"
          title="Reset State"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* GLOBAL SETTINGS */}
        <div className="p-6 bg-[#1A1A1E] border-b border-[#2C2D35] mb-4">
          <label className={labelClass}>Layout Template</label>
          <select
            className={inputClass}
            value={state.layoutTemplate || 'classic'}
            onChange={e => handleChange('layoutTemplate' as keyof GazzetteState, '', e.target.value)}
          >
            <option value="classic">Classic Academic</option>
            <option value="modern">Modern Impact</option>
            <option value="visual">Visual / Gallery</option>
          </select>
        </div>
        {/* MASTHEAD SECTION */}
        <AccordionSection
          title="Masthead"
          isOpen={openSection === 'masthead'}
          onToggle={() => toggleSection('masthead')}
        >
          <div>
            <label className={labelClass}>Title</label>
            <input type="text" className={inputClass} value={state.masthead.title} onChange={e => handleChange('masthead', 'title', e.target.value)} />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className={labelClass}>Date</label>
              <input type="text" className={inputClass} value={state.masthead.date} onChange={e => handleChange('masthead', 'date', e.target.value)} />
            </div>
            <div className="w-1/3">
              <label className={labelClass}>Volume</label>
              <input type="text" className={inputClass} value={state.masthead.volume} onChange={e => handleChange('masthead', 'volume', e.target.value)} />
            </div>
          </div>

          <div className="mt-4">
            <label className={labelClass}>Theme Style (Vignettes)</label>
            <select
              className={inputClass}
              value={state.vignetteStyle || 'classic'}
              onChange={e => handleChange('vignetteStyle' as keyof GazzetteState, '', e.target.value)}
            >
              <option value="classic">Classic Scroll</option>
              <option value="science">Scientific (Atoms)</option>
              <option value="writing">Editorial (Quill)</option>
              <option value="medical">Medical (Caduceus)</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Tags (csv)</label>
            <input type="text" className={inputClass} value={state.masthead.tags.join(', ')} onChange={e => handleChange('masthead', 'tags', e.target.value.split(',').map(s => s.trim()))} />
          </div>
        </AccordionSection>

        {/* FEATURE STORY SECTION */}
        <AccordionSection
          title="Feature Story"
          isOpen={openSection === 'featureStory'}
          onToggle={() => toggleSection('featureStory')}
        >
          <div>
            <label className={labelClass}>Kicker</label>
            <input type="text" className={inputClass} value={state.featureStory.kicker} onChange={e => handleChange('featureStory', 'kicker', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Headline</label>
            <textarea className={inputClass} rows={2} value={state.featureStory.headline} onChange={e => handleChange('featureStory', 'headline', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Author</label>
            <input type="text" className={inputClass} value={state.featureStory.author} onChange={e => handleChange('featureStory', 'author', e.target.value)} />
          </div>


          <div className="mt-4">
            <label className={labelClass}>Drop Cap Style</label>
            <select
              className={inputClass}
              value={state.dropCapStyle || 'classic'}
              onChange={e => handleChange('dropCapStyle' as keyof GazzetteState, '', e.target.value)}
            >
              <option value="classic">Classic Typography</option>
              <option value="ornamental">Ornamental (Floral/Vine)</option>
            </select>
          </div>
          <div className="mt-4">
            <label className={labelClass}>Paragraphs</label>
            {state.featureStory.paragraphs.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <textarea
                  className={inputClass}
                  rows={4}
                  value={p}
                  onChange={e => handleParagraphChange(i, e.target.value)}
                />
                <button onClick={() => removeParagraph(i)} className="text-[#ED6A5E] hover:bg-[#343541] px-2 rounded">×</button>
              </div>
            ))}
            <button onClick={addParagraph} className="w-full py-2 border border-dashed border-[#4B4C56] text-[#8B8D98] rounded hover:bg-[#2C2D35] hover:text-[#E5E7EB] transition-colors text-sm font-bold">+ Add Paragraph</button>
          </div>

          <div className="mt-4 p-4 bg-[#2C2D35] rounded">
            <label className={labelClass}>Pull Quote</label>
            <textarea className={`${inputClass} mb-3`} rows={2} value={state.featureStory.pullQuote} onChange={e => handleChange('featureStory', 'pullQuote', e.target.value)} />
            <label className={labelClass}>Position (After P #)</label>
            <input type="number" className={inputClass} value={state.featureStory.pullQuotePosition} onChange={e => handleChange('featureStory', 'pullQuotePosition', parseInt(e.target.value))} />
          </div>
        </AccordionSection>

        {/* SPOTLIGHT SECTION */}
        <AccordionSection
          title="Spotlight Image"
          isOpen={openSection === 'spotlight'}
          onToggle={() => toggleSection('spotlight')}
        >
          <div>
            <label className={labelClass}>Image URL (1:1)</label>
            <input type="text" className={inputClass} value={state.spotlight.imageUrl} onChange={e => handleChange('spotlight', 'imageUrl', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Caption</label>
            <textarea className={inputClass} rows={2} value={state.spotlight.caption} onChange={e => handleChange('spotlight', 'caption', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Image Fit</label>
            <select
              className={inputClass}
              value={state.spotlight.fit || 'cover'}
              onChange={e => handleChange('spotlight', 'fit', e.target.value)}
            >
              <option value="cover">Fill (Cover)</option>
              <option value="contain">Fit (Contain)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Image Position</label>
            <select
              className={inputClass}
              value={state.spotlight.position || 'center'}
              onChange={e => handleChange('spotlight', 'position', e.target.value)}
            >
              <option value="center">Center</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Image Zoom (Scale): {state.spotlight.scale || 1}x</label>
            <input
              type="range"
              min="0.5" max="3" step="0.1"
              className="w-full accent-[#ED6A5E]"
              value={state.spotlight.scale || 1}
              onChange={e => handleChange('spotlight', 'scale', parseFloat(e.target.value))}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input type="checkbox" className="accent-[#ED6A5E] bg-[#212126]" checked={state.spotlight.grayscale} onChange={e => handleChange('spotlight', 'grayscale', e.target.checked)} />
            <span className="text-[#8B8D98] text-sm">Force Grayscale</span>
          </label>
        </AccordionSection>

        {/* QUOTE SECTION */}
        <AccordionSection
          title="Quote of the Week"
          isOpen={openSection === 'quote'}
          onToggle={() => toggleSection('quote')}
        >
          <div>
            <label className={labelClass}>Text</label>
            <textarea className={inputClass} rows={2} value={state.quote.text} onChange={e => handleChange('quote', 'text', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Author</label>
            <input type="text" className={inputClass} value={state.quote.author} onChange={e => handleChange('quote', 'author', e.target.value)} />
          </div>
        </AccordionSection>

        {/* SECONDARY ARTICLES */}
        <AccordionSection
          title="Secondary Articles"
          isOpen={openSection === 'secondaryArticles'}
          onToggle={() => toggleSection('secondaryArticles')}
        >
          <div className="mb-6 p-4 bg-[#2C2D35] rounded">
            <h4 className="font-bold text-[#E5E7EB] mb-3 text-sm">Article 1 (Left)</h4>
            <div className="space-y-3">
              <input type="text" placeholder="Kicker" className={inputClass} value={state.secondaryArticle1.kicker} onChange={e => handleChange('secondaryArticle1', 'kicker', e.target.value)} />
              <input type="text" placeholder="Headline" className={inputClass} value={state.secondaryArticle1.headline} onChange={e => handleChange('secondaryArticle1', 'headline', e.target.value)} />
              <textarea placeholder="Content" className={inputClass} rows={4} value={state.secondaryArticle1.content} onChange={e => handleChange('secondaryArticle1', 'content', e.target.value)} />
            </div>
          </div>

          <div className="p-4 bg-[#2C2D35] rounded">
            <h4 className="font-bold text-[#E5E7EB] mb-3 text-sm">Article 2 (Right)</h4>
            <div className="space-y-3">
              <input type="text" placeholder="Kicker" className={inputClass} value={state.secondaryArticle2.kicker} onChange={e => handleChange('secondaryArticle2', 'kicker', e.target.value)} />
              <input type="text" placeholder="Headline" className={inputClass} value={state.secondaryArticle2.headline} onChange={e => handleChange('secondaryArticle2', 'headline', e.target.value)} />
              <textarea placeholder="Content" className={inputClass} rows={4} value={state.secondaryArticle2.content} onChange={e => handleChange('secondaryArticle2', 'content', e.target.value)} />
            </div>
          </div>
        </AccordionSection>
      </div>

<div className="p-4 bg-[#1A1A1E] border-t border-[#2C2D35] mt-auto">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setExportMode('digital')}
            className={`flex-1 py-1.5 text-xs font-bold rounded border ${exportMode === 'digital' ? 'bg-[#ED6A5E] text-white border-[#ED6A5E]' : 'bg-transparent text-[#8B8D98] border-[#343541] hover:border-[#4B4C56]'}`}
          >
            Digital (Links)
          </button>
          <button
            onClick={() => setExportMode('print')}
            className={`flex-1 py-1.5 text-xs font-bold rounded border ${exportMode === 'print' ? 'bg-[#ED6A5E] text-white border-[#ED6A5E]' : 'bg-transparent text-[#8B8D98] border-[#343541] hover:border-[#4B4C56]'}`}
          >
            Print (QR/Bleed)
          </button>
        </div>
        <button
          onClick={() => onExportPdf(exportMode)} // We could pass mode here, but let's just trigger it. In reality we'd extend onExportPdf to take the mode.
          className="w-full bg-[#E5484D] hover:bg-[#F2555A] text-white py-3 px-4 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Export PDF
        </button>
      </div>
    </div>
  );
};
