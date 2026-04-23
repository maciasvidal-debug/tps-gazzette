import React from 'react';
import type { GazzetteState } from '../types/gazzette';

interface EditorSidebarProps {
  state: GazzetteState;
  updateState: (updater: (draft: GazzetteState) => void) => void;
  resetState: () => void;
  onExportPdf: () => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({ state, updateState, resetState, onExportPdf }) => {
  const handleChange = (section: keyof GazzetteState, field: string, value: string | boolean | number | string[]) => {
    updateState((draft) => {
      // @ts-ignore - dynamic key assignment
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

  return (
    <div className="w-96 bg-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col shadow-lg z-10 relative">
      <div className="p-6 bg-tps-primary text-white sticky top-0 z-20 shadow-md">
        <h2 className="text-xl font-sans font-bold tracking-wider mb-4">Gazzette Editor</h2>
        <div className="flex gap-2">
          <button 
            onClick={onExportPdf}
            className="flex-1 bg-tps-accent1 hover:bg-tps-accent2 text-white py-2 px-4 rounded text-sm font-bold transition-colors"
          >
            Export PDF
          </button>
          <button 
            onClick={resetState}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm font-bold transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8 font-sans text-sm">
        
        {/* MASTHEAD SECTION */}
        <section>
          <h3 className="font-bold text-tps-primary uppercase border-b border-gray-200 pb-2 mb-4">Masthead</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-600 mb-1">Title</label>
              <input type="text" className="w-full border rounded p-2" value={state.masthead.title} onChange={e => handleChange('masthead', 'title', e.target.value)} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-gray-600 mb-1">Date</label>
                <input type="text" className="w-full border rounded p-2" value={state.masthead.date} onChange={e => handleChange('masthead', 'date', e.target.value)} />
              </div>
              <div className="w-1/3">
                <label className="block text-gray-600 mb-1">Volume</label>
                <input type="text" className="w-full border rounded p-2" value={state.masthead.volume} onChange={e => handleChange('masthead', 'volume', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Tags (comma separated)</label>
              <input type="text" className="w-full border rounded p-2" value={state.masthead.tags.join(', ')} onChange={e => handleChange('masthead', 'tags', e.target.value.split(',').map(s => s.trim()))} />
            </div>
          </div>
        </section>

        {/* FEATURE STORY SECTION */}
        <section>
          <h3 className="font-bold text-tps-primary uppercase border-b border-gray-200 pb-2 mb-4">Feature Story</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-600 mb-1">Kicker</label>
              <input type="text" className="w-full border rounded p-2" value={state.featureStory.kicker} onChange={e => handleChange('featureStory', 'kicker', e.target.value)} />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Headline</label>
              <textarea className="w-full border rounded p-2" rows={2} value={state.featureStory.headline} onChange={e => handleChange('featureStory', 'headline', e.target.value)} />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Author</label>
              <input type="text" className="w-full border rounded p-2" value={state.featureStory.author} onChange={e => handleChange('featureStory', 'author', e.target.value)} />
            </div>
            
            <div className="mt-4">
              <label className="block text-gray-600 mb-2 font-bold">Paragraphs (Drop cap applied to first)</label>
              {state.featureStory.paragraphs.map((p, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <textarea 
                    className="w-full border rounded p-2 text-sm" 
                    rows={4} 
                    value={p} 
                    onChange={e => handleParagraphChange(i, e.target.value)} 
                  />
                  <button onClick={() => removeParagraph(i)} className="text-red-500 hover:bg-red-50 px-2 rounded">×</button>
                </div>
              ))}
              <button onClick={addParagraph} className="w-full py-2 border border-dashed border-gray-400 text-gray-600 rounded hover:bg-gray-50">+ Add Paragraph</button>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded border">
              <label className="block text-gray-600 mb-1 font-bold">Pull Quote</label>
              <textarea className="w-full border rounded p-2 mb-2" rows={2} value={state.featureStory.pullQuote} onChange={e => handleChange('featureStory', 'pullQuote', e.target.value)} />
              <label className="block text-gray-600 mb-1 text-xs">Position (After Paragraph #)</label>
              <input type="number" className="w-full border rounded p-2" value={state.featureStory.pullQuotePosition} onChange={e => handleChange('featureStory', 'pullQuotePosition', parseInt(e.target.value))} />
            </div>
          </div>
        </section>

        {/* SPOTLIGHT SECTION */}
        <section>
          <h3 className="font-bold text-tps-primary uppercase border-b border-gray-200 pb-2 mb-4">Spotlight</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-600 mb-1">Image URL (1:1 ratio ideal)</label>
              <input type="text" className="w-full border rounded p-2" value={state.spotlight.imageUrl} onChange={e => handleChange('spotlight', 'imageUrl', e.target.value)} />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Caption</label>
              <textarea className="w-full border rounded p-2" rows={2} value={state.spotlight.caption} onChange={e => handleChange('spotlight', 'caption', e.target.value)} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={state.spotlight.grayscale} onChange={e => handleChange('spotlight', 'grayscale', e.target.checked)} />
              <span className="text-gray-600">Force Grayscale</span>
            </label>
          </div>
        </section>

        {/* QUOTE SECTION */}
        <section>
          <h3 className="font-bold text-tps-primary uppercase border-b border-gray-200 pb-2 mb-4">Quote of the Week</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-600 mb-1">Text</label>
              <textarea className="w-full border rounded p-2" rows={2} value={state.quote.text} onChange={e => handleChange('quote', 'text', e.target.value)} />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Author</label>
              <input type="text" className="w-full border rounded p-2" value={state.quote.author} onChange={e => handleChange('quote', 'author', e.target.value)} />
            </div>
          </div>
        </section>

        {/* SECONDARY ARTICLES */}
        <section>
          <h3 className="font-bold text-tps-primary uppercase border-b border-gray-200 pb-2 mb-4">Secondary Articles</h3>
          
          <div className="mb-6 p-3 bg-gray-50 rounded border">
            <h4 className="font-bold text-gray-700 mb-2">Article 1 (Left)</h4>
            <div className="space-y-2">
              <input type="text" placeholder="Kicker" className="w-full border rounded p-2" value={state.secondaryArticle1.kicker} onChange={e => handleChange('secondaryArticle1', 'kicker', e.target.value)} />
              <input type="text" placeholder="Headline" className="w-full border rounded p-2" value={state.secondaryArticle1.headline} onChange={e => handleChange('secondaryArticle1', 'headline', e.target.value)} />
              <textarea placeholder="Content" className="w-full border rounded p-2" rows={4} value={state.secondaryArticle1.content} onChange={e => handleChange('secondaryArticle1', 'content', e.target.value)} />
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded border">
            <h4 className="font-bold text-gray-700 mb-2">Article 2 (Right)</h4>
            <div className="space-y-2">
              <input type="text" placeholder="Kicker" className="w-full border rounded p-2" value={state.secondaryArticle2.kicker} onChange={e => handleChange('secondaryArticle2', 'kicker', e.target.value)} />
              <input type="text" placeholder="Headline" className="w-full border rounded p-2" value={state.secondaryArticle2.headline} onChange={e => handleChange('secondaryArticle2', 'headline', e.target.value)} />
              <textarea placeholder="Content" className="w-full border rounded p-2" rows={4} value={state.secondaryArticle2.content} onChange={e => handleChange('secondaryArticle2', 'content', e.target.value)} />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};