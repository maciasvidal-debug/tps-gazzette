import React, { useState } from 'react';
import type { GazzetteState } from '../types/gazzette';
import { AccordionSection, FormInput, FormTextArea, FormSelect } from './FormElements';
import { ColorExtractor } from './ColorExtractor';
import { AICopilotButton } from './AICopilotButton';
import { generateQuote, generateFeelGood, summarizeText, improveTone } from '../utils/aiCopilot';

interface EditorSidebarProps {
  state: GazzetteState;
  updateState: (updater: (draft: GazzetteState) => void) => void;
  resetState: () => void;
  onExportPdf: (mode?: 'digital' | 'print') => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({ state, updateState, resetState, onExportPdf }) => {
  const [openSection, setOpenSection] = useState<string | null>('masthead');
  const [exportMode, setExportMode] = useState<'digital' | 'print'>('digital');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  /**
   * Updates a specific field in the state.
   * Uses generics to improve type safety at call sites as per project guidelines.
   */
  const handleThemeColorChange = (field: 'primary' | 'accent1' | 'accent2' | 'quote' | 'text', value: string) => {
    updateState((draft) => {
      if (!draft.themeColors) {
        draft.themeColors = { primary: '#3c2065', accent1: '#5e3898', accent2: '#a57ced', quote: '#8b2c39', text: '#1f2937' };
      }
      draft.themeColors[field] = value;
    });
  };

  function handleChange<S extends keyof GazzetteState>(
    section: S,
    field: '',
    value: GazzetteState[S]
  ): void;
  function handleChange<S extends keyof GazzetteState, F extends keyof GazzetteState[S]>(
    section: S,
    field: F,
    value: GazzetteState[S][F]
  ): void;
  function handleChange<S extends keyof GazzetteState, F extends keyof NonNullable<GazzetteState[S]>>(
    section: S,
    field: F | '',
    value: GazzetteState[S] | NonNullable<GazzetteState[S]>[F]
  ) {
    updateState((draft) => {
      if (field === '') {
        const draftSection = draft as { [K in S]: GazzetteState[K] };
        draftSection[section] = value as GazzetteState[S];
      } else {
        const targetSection = draft[section];
        if (targetSection && typeof targetSection === 'object') {
          const draftField = targetSection as { [K in F]: NonNullable<GazzetteState[S]>[K] };
          draftField[field as F] = value as NonNullable<GazzetteState[S]>[F];
        }
      }
    });
  }

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
          <FormSelect
            label="Layout Template"
            value={state.layoutTemplate || 'classic'}
            onChange={e => handleChange('layoutTemplate', '', e.target.value as GazzetteState['layoutTemplate'])}
          >
            <option value="classic">Classic Academic</option>
            <option value="modern">Modern Impact</option>
            <option value="visual">Visual / Gallery</option>
          </FormSelect>
        </div>

        <AccordionSection
          title="Theme & Style"
          isOpen={openSection === 'theme'}
          onToggle={() => toggleSection('theme')}
        >
          <div className="space-y-3">
            <FormInput
              label="Primary Color"
              type="color"
              value={state.themeColors?.primary || '#3c2065'}
              onChange={e => handleThemeColorChange('primary', e.target.value)}
            />
            <div className="flex gap-2">
              <FormInput
                label="Accent 1"
                type="color"
                containerClassName="flex-1"
                value={state.themeColors?.accent1 || '#5e3898'}
                onChange={e => handleThemeColorChange('accent1', e.target.value)}
              />
              <FormInput
                label="Accent 2"
                type="color"
                containerClassName="flex-1"
                value={state.themeColors?.accent2 || '#a57ced'}
                onChange={e => handleThemeColorChange('accent2', e.target.value)}
              />
            </div>
            <FormInput
              label="Quote Color"
              type="color"
              value={state.themeColors?.quote || '#8b2c39'}
              onChange={e => handleThemeColorChange('quote', e.target.value)}
            />
          </div>
        </AccordionSection>

        {/* MASTHEAD SECTION */}
        <AccordionSection
          title="Masthead"
          isOpen={openSection === 'masthead'}
          onToggle={() => toggleSection('masthead')}
        >
          <FormInput
            label="Title"
            value={state.masthead.title}
            onChange={e => handleChange('masthead', 'title', e.target.value)}
          />
          <div className="flex gap-2">
            <FormInput
              label="Date"
              containerClassName="flex-1"
              value={state.masthead.date}
              onChange={e => handleChange('masthead', 'date', e.target.value)}
            />
            <FormInput
              label="Volume"
              containerClassName="w-1/3"
              value={state.masthead.volume}
              onChange={e => handleChange('masthead', 'volume', e.target.value)}
            />
          </div>

          <FormSelect
            label="Theme Style (Vignettes)"
            containerClassName="mt-4"
            value={state.vignetteStyle || 'classic'}
            onChange={e => handleChange('vignetteStyle', '', e.target.value as GazzetteState['vignetteStyle'])}
          >
            <option value="classic">Classic Scroll</option>
            <option value="science">Scientific (Atoms)</option>
            <option value="writing">Editorial (Quill)</option>
            <option value="medical">Medical (Caduceus)</option>
          </FormSelect>

          <FormInput
            label="Tags (csv)"
            value={state.masthead.tags.join(', ')}
            onChange={e => handleChange('masthead', 'tags', e.target.value.split(',').map(s => s.trim()))}
          />
        </AccordionSection>

        {/* FEATURE STORY SECTION */}
        <AccordionSection
          title="Feature Story"
          isOpen={openSection === 'featureStory'}
          onToggle={() => toggleSection('featureStory')}
        >
          <FormInput
            label="Kicker"
            value={state.featureStory.kicker}
            onChange={e => handleChange('featureStory', 'kicker', e.target.value)}
          />
          <FormTextArea
            label="Headline"
            rows={2}
            value={state.featureStory.headline}
            onChange={e => handleChange('featureStory', 'headline', e.target.value)}
          />
          <FormInput
            label="Author"
            value={state.featureStory.author}
            onChange={e => handleChange('featureStory', 'author', e.target.value)}
          />

          <FormSelect
            label="Drop Cap Style"
            containerClassName="mt-4"
            value={state.dropCapStyle || 'classic'}
            onChange={e => handleChange('dropCapStyle', '', e.target.value as GazzetteState['dropCapStyle'])}
          >
            <option value="classic">Classic Typography</option>
            <option value="ornamental">Ornamental (Floral/Vine)</option>
          </FormSelect>

          <div className="mt-4">
            <label className={labelClass}>Paragraphs</label>
            {state.featureStory.paragraphs.map((p, i) => (
              <div key={i} className="mb-4 bg-[#2C2D35] p-2 rounded">
                <div className="flex gap-2 mb-2">
                  <FormTextArea
                    containerClassName="flex-1"
                    rows={4}
                    value={p}
                    onChange={e => handleParagraphChange(i, e.target.value)}
                  />
                  <button onClick={() => removeParagraph(i)} className="text-[#ED6A5E] hover:bg-[#343541] px-2 rounded h-fit">×</button>
                </div>
                <div className="flex gap-2 justify-end">
                  <AICopilotButton
                    label="Summarize"
                    onClick={async () => {
                      const summary = await summarizeText(p);
                      handleParagraphChange(i, summary);
                    }}
                  />
                  <AICopilotButton
                    label="Prof. Tone"
                    onClick={async () => {
                      const improved = await improveTone(p, 'professional');
                      handleParagraphChange(i, improved);
                    }}
                  />
                </div>
              </div>
            ))}
            <button onClick={addParagraph} className="w-full py-2 border border-dashed border-[#4B4C56] text-[#8B8D98] rounded hover:bg-[#2C2D35] hover:text-[#E5E7EB] transition-colors text-sm font-bold">+ Add Paragraph</button>
          </div>

          <div className="mt-4 p-4 bg-[#2C2D35] rounded">
            <FormTextArea
              label="Pull Quote"
              containerClassName="mb-3"
              rows={2}
              value={state.featureStory.pullQuote}
              onChange={e => handleChange('featureStory', 'pullQuote', e.target.value)}
            />
            <FormInput
              label="Position (After P #)"
              type="number"
              value={state.featureStory.pullQuotePosition}
              onChange={e => handleChange('featureStory', 'pullQuotePosition', parseInt(e.target.value))}
            />
          </div>
        </AccordionSection>

        {/* SPOTLIGHT SECTION */}
        <AccordionSection
          title="Spotlight Image"
          isOpen={openSection === 'spotlight'}
          onToggle={() => toggleSection('spotlight')}
        >

          <ColorExtractor imageUrl={state.spotlight.imageUrl} updateState={updateState} />
          <FormInput
            label="Interactive Link (QR Code)"
            placeholder="https://form.typeform.com/to/..."
            value={state.spotlight.link || ''}
            onChange={e => handleChange('spotlight', 'link', e.target.value)}
          />
          <FormInput
            label="Image URL (1:1)"
            value={state.spotlight.imageUrl}
            onChange={e => handleChange('spotlight', 'imageUrl', e.target.value)}
          />
          <FormTextArea
            label="Caption"
            rows={2}
            value={state.spotlight.caption}
            onChange={e => handleChange('spotlight', 'caption', e.target.value)}
          />
          <FormSelect
            label="Image Fit"
            value={state.spotlight.fit || 'cover'}
            onChange={e => handleChange('spotlight', 'fit', e.target.value as NonNullable<GazzetteState['spotlight']>['fit'])}
          >
            <option value="cover">Fill (Cover)</option>
            <option value="contain">Fit (Contain)</option>
          </FormSelect>
          <FormSelect
            label="Image Position"
            value={state.spotlight.position || 'center'}
            onChange={e => handleChange('spotlight', 'position', e.target.value as NonNullable<GazzetteState['spotlight']>['position'])}
          >
            <option value="center">Center</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </FormSelect>
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
          <div className="flex justify-end mb-2">
             <AICopilotButton
               label="Generate Corporate Quote"
               variant="primary"
               onClick={async () => {
                 const newQuote = await generateQuote();
                 updateState(draft => {
                   draft.quote.text = newQuote.text;
                   draft.quote.author = newQuote.author;
                 });
               }}
             />
          </div>
          <FormTextArea
            label="Text"
            rows={2}
            value={state.quote.text}
            onChange={e => handleChange('quote', 'text', e.target.value)}
          />
          <FormInput
            label="Author"
            value={state.quote.author}
            onChange={e => handleChange('quote', 'author', e.target.value)}
          />
        </AccordionSection>

        {/* FEEL GOOD CORNER */}
        <AccordionSection
          title="Feel Good Corner"
          isOpen={openSection === 'feelGood'}
          onToggle={() => toggleSection('feelGood')}
        >
          <div className="flex justify-end mb-2">
             <AICopilotButton
               label="Generate Feel Good Text"
               variant="primary"
               onClick={async () => {
                 const newText = await generateFeelGood();
                 updateState(draft => {
                   draft.feelGoodCorner = newText;
                 });
               }}
             />
          </div>
          <FormTextArea
            label="Text"
            rows={3}
            value={state.feelGoodCorner || '"Excellence is not an act, but a habit."'}
            onChange={e => updateState(draft => { draft.feelGoodCorner = e.target.value; })}
          />
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
              <FormInput placeholder="Kicker" value={state.secondaryArticle1.kicker} onChange={e => handleChange('secondaryArticle1', 'kicker', e.target.value)} />
              <FormInput placeholder="Headline" value={state.secondaryArticle1.headline} onChange={e => handleChange('secondaryArticle1', 'headline', e.target.value)} />
              <FormTextArea placeholder="Content" rows={4} value={state.secondaryArticle1.content} onChange={e => handleChange('secondaryArticle1', 'content', e.target.value)} />
              <FormInput placeholder="Interactive Link (QR Code)" value={state.secondaryArticle1.link || ''} onChange={e => handleChange('secondaryArticle1', 'link', e.target.value)} />
            </div>
          </div>

          <div className="p-4 bg-[#2C2D35] rounded">
            <h4 className="font-bold text-[#E5E7EB] mb-3 text-sm">Article 2 (Right)</h4>
            <div className="space-y-3">
              <FormInput placeholder="Kicker" value={state.secondaryArticle2.kicker} onChange={e => handleChange('secondaryArticle2', 'kicker', e.target.value)} />
              <FormInput placeholder="Headline" value={state.secondaryArticle2.headline} onChange={e => handleChange('secondaryArticle2', 'headline', e.target.value)} />
              <FormTextArea placeholder="Content" rows={4} value={state.secondaryArticle2.content} onChange={e => handleChange('secondaryArticle2', 'content', e.target.value)} />
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
          onClick={() => onExportPdf(exportMode)}
          className="w-full bg-[#E5484D] hover:bg-[#F2555A] text-white py-3 px-4 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Export PDF
        </button>
      </div>
    </div>
  );
};
