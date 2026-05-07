import React, { forwardRef } from 'react';
import type { GazzetteState, TransformState } from '../types/gazzette';
import { Vignette } from './Vignette';
import { MarkdownText } from './MarkdownText';
import { EditableText } from './EditableText';
import { MoveableWrapper } from './MoveableWrapper';
import { QRCodeSVG } from 'qrcode.react';

interface PreviewProps {
  state: GazzetteState;
  updateState?: (updater: (draft: GazzetteState) => void | GazzetteState) => void;
}

export const GazzettePreview = forwardRef<HTMLDivElement, PreviewProps>(({ state, updateState }, ref) => {
  const handleTransformChange = (id: string, transform: TransformState) => {
    if (updateState) {
      handleUpdate(draft => {
        if (!draft.transforms) draft.transforms = {};
        draft.transforms[id] = transform;
      });
    }
  };


  const handleUpdate = (updater: (draft: GazzetteState) => void) => {
    if (updateState) {
      updateState(updater);
    }
  };

  const isFree = !!state.freeDesignMode;

  return (
    <div className="flex flex-col gap-12 items-center bg-transparent pb-16" ref={ref}>
      {/* PAGE 1: Front Cover / Main Story Start */}
      <div 
        className="w-[1024px] h-[1448px] bg-tps-paper shadow-2xl overflow-hidden relative text-tps-text flex flex-col shrink-0"
        id="gazzette-document-page1"
      >
        <div className="px-12 py-10 h-full flex flex-col">
          {/* MASTHEAD */}
          <MoveableWrapper
            id="masthead"
            isActive={isFree}
            initialTransform={state.transforms?.['masthead']}
            onTransformChange={handleTransformChange}
          >
            <header className="mb-8 text-center border-b-[6px] border-tps-primary pb-6">
              <div className="flex justify-between items-end mb-2 font-sans text-[10px] font-bold tracking-[0.2em] text-tps-text uppercase">
                <span>{state.masthead.date}</span>
                <span className="flex gap-4">
                  {state.masthead.tags.map(tag => <span key={tag}>{tag}</span>)}
                </span>
                <span>{state.masthead.volume}</span>
              </div>
              <h1 className="font-serif text-7xl font-bold tracking-normal text-tps-text mb-2 uppercase border-b-[1px] border-t-[1px] border-tps-text py-4 mt-4">
                {state.masthead.title}
              </h1>
            </header>
          </MoveableWrapper>

          {/* ASYMMETRICAL TOP LAYOUT */}
          <div className={`grid gap-8 mb-8 flex-1 ${state.layoutTemplate === 'modern' ? 'grid-cols-1' : 'grid-cols-12'}`}>

            
            {/* LEFT SIDEBAR */}
            <aside className={`${state.layoutTemplate === 'modern' ? 'hidden' : 'col-span-4 flex flex-col gap-6'}`}>

              {/* Spotlight */}
              <div className="border-b-[1px] border-tps-text pb-6">
                <div className="font-sans text-xs font-bold uppercase tracking-widest text-tps-text mb-4">Spotlight</div>
                <div className="w-full aspect-square overflow-hidden mb-3 bg-gray-100 flex items-center justify-center">
                  <img
                    src={state.spotlight.imageUrl}
                    alt="Spotlight"
                    className={`w-full h-full ${state.spotlight.grayscale ? 'grayscale' : ''}`}
                    style={{
                      objectFit: state.spotlight.fit || 'cover',
                      objectPosition: state.spotlight.position || 'center',
                      transform: `scale(${state.spotlight.scale || 1})`
                    }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22800%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%23999%22%3EImage%20Not%20Found%3C%2Ftext%3E%3C%2Fsvg%3E';
                  }}
                />
                </div>
                <p className="font-serif text-xs italic text-gray-600 leading-snug">
                  {state.spotlight.caption}
                </p>
              </div>

              {/* Quote of the week */}
              <div className="py-6 relative border-b-[1px] border-tps-text text-center">
                <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-tps-text mb-4">
                  Quote of the Week
                </div>
                <blockquote className="font-serif text-lg italic text-tps-quote leading-relaxed mt-2">
                  "<EditableText tagName="span" multiline value={state.quote.text} onChange={(val) => handleUpdate(draft => { draft.quote.text = val; })} />"
                </blockquote>
                <div className="mt-3 font-sans text-xs font-bold text-tps-text">
                  — <EditableText tagName="span" value={state.quote.author} onChange={(val) => handleUpdate(draft => { draft.quote.author = val; })} />
                </div>
              </div>

              {/* Staff Box */}
              <div className="mt-auto pt-4 text-xs font-sans">
                <div className="font-bold uppercase tracking-wider mb-3 text-tps-text">Staff Box</div>
                <div className="mb-2">
                  <span className="font-bold text-tps-text">Editor in Chief:</span> <EditableText tagName="span" value={state.staffBox.editorInChief} onChange={(val) => handleUpdate(draft => { draft.staffBox.editorInChief = val; })} />
                </div>
                <div className="mb-2">
                  <span className="font-bold text-tps-text">Contributors:</span><br/>
                  <EditableText tagName="span" value={state.staffBox.contributors.join(", ")} onChange={(val) => handleUpdate(draft => { draft.staffBox.contributors = val.split(",").map(s => s.trim()); })} />
                </div>
                <div className="mb-2">
                  <span className="font-bold text-tps-text">Art Direction:</span><br/>
                  <EditableText tagName="span" value={state.staffBox.artDirection} onChange={(val) => handleUpdate(draft => { draft.staffBox.artDirection = val; })} />
                </div>
                <div className="mt-6 text-[10px] text-gray-500 italic">
                  <EditableText tagName="span" value={state.staffBox.copyright} onChange={(val) => handleUpdate(draft => { draft.staffBox.copyright = val; })} />
                </div>
              </div>
            </aside>

            {/* MAIN ARTICLE */}
            <main className={`${state.layoutTemplate === 'modern' ? 'col-span-1 border-none pl-0' : 'col-span-8 border-l-[1px] border-tps-text pl-8'}`}>

              <div className="font-sans text-xs font-bold uppercase tracking-widest text-tps-text mb-4 flex items-center gap-3">
                <EditableText tagName="span" value={state.featureStory.kicker} onChange={(val) => handleUpdate(draft => { draft.featureStory.kicker = val; })} /> <Vignette className="w-16 h-4 text-[#7A6490]" style={state.vignetteStyle} />
              </div>
              {state.layoutTemplate === 'modern' && state.spotlight.imageUrl && (
                <div className="relative w-full h-64 overflow-hidden mb-8 bg-gray-100 flex items-center justify-center border-b-[3px] border-tps-primary pb-2">
                  <img
                    src={state.spotlight.imageUrl}
                    alt="Spotlight"
                    className={`w-full h-full ${state.spotlight.grayscale ? 'grayscale' : ''}`}
                    style={{
                      objectFit: state.spotlight.fit || 'cover',
                      objectPosition: state.spotlight.position || 'center',
                      transform: `scale(${state.spotlight.scale || 1})`
                    }}
                  />
                  {state.spotlight.link && (
                    <div className="absolute bottom-4 right-4 bg-white p-2 border border-gray-300 shadow-md flex flex-col items-center">
                      <QRCodeSVG value={state.spotlight.link} size={64} fgColor={state.themeColors?.primary || "#3c2065"} />
                      <span className="text-[8px] font-sans font-bold uppercase mt-1 tracking-widest text-tps-text">Scan Me</span>
                    </div>
                  )}
                </div>
              )}
              <EditableText tagName="h2" className="font-serif text-5xl font-bold leading-tight text-tps-text mb-4" multiline value={state.featureStory.headline} onChange={(val) => handleUpdate(draft => { draft.featureStory.headline = val; })} />
              <div className="font-sans text-xs font-bold text-tps-text mb-8 uppercase tracking-widest border-b-[1px] border-tps-text pb-4">
                By <EditableText tagName="span" value={state.featureStory.author} onChange={(val) => handleUpdate(draft => { draft.featureStory.author = val; })} />
              </div>
              
              <div className={`gap-8 font-serif text-sm leading-relaxed text-gray-800 editorial-text ${state.layoutTemplate === 'modern' ? 'columns-3' : 'columns-2'}`}>
                {state.featureStory.paragraphs.map((p, i) => {
                  if (i === 0) {
                    return (
                      <p key={i} className="mb-4 editorial-text">
                        {state.dropCapStyle === 'ornamental' ? (
                          <span className="float-left mr-3 mt-1 mb-1 relative" style={{ width: '80px', height: '80px' }}>
                            <svg className="absolute inset-0 w-full h-full text-tps-primary" viewBox="0 0 100 100" fill="none">
                              {/* Ornamental background frame */}
                              <rect x="5" y="5" width="90" height="90" rx="10" stroke="currentColor" strokeWidth="2" fill="#FCFAF5" />
                              <path d="M5,20 Q20,20 20,5" stroke="currentColor" strokeWidth="1" fill="none" />
                              <path d="M95,20 Q80,20 80,5" stroke="currentColor" strokeWidth="1" fill="none" />
                              <path d="M5,80 Q20,80 20,95" stroke="currentColor" strokeWidth="1" fill="none" />
                              <path d="M95,80 Q80,80 80,95" stroke="currentColor" strokeWidth="1" fill="none" />
                              <circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.3" />
                              <circle cx="85" cy="15" r="3" fill="currentColor" opacity="0.3" />
                              <circle cx="15" cy="85" r="3" fill="currentColor" opacity="0.3" />
                              <circle cx="85" cy="85" r="3" fill="currentColor" opacity="0.3" />
                              {/* The Letter */}
                              <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="65" fontWeight="900" fontFamily="Georgia, serif" fill="currentColor">
                                {p.charAt(0)}
                              </text>
                            </svg>
                          </span>
                        ) : (
                          <span style={{ float: 'left', fontSize: '5.5rem', lineHeight: '0.8', fontWeight: 900, color: 'var(--color-tps-primary)', paddingRight: '8px', paddingTop: '8px' }}>
                            {p.charAt(0)}
                          </span>
                        )}
                        <MarkdownText text={p.slice(1)} />
                      </p>
                    );
                  }
                  
                  return (
                    <React.Fragment key={i}>
                      <p className="mb-4 editorial-text"><MarkdownText text={p} /></p>
                      {i === state.featureStory.pullQuotePosition && state.featureStory.pullQuote && (
                        <blockquote className="my-6 py-4 border-y-[1px] border-tps-quote font-serif text-xl italic text-tps-quote text-center px-4 font-bold break-inside-avoid">
                          "{state.featureStory.pullQuote}"
                        </blockquote>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </main>
          </div>

          <div className="mt-auto flex justify-between items-center text-[10px] text-gray-400 font-sans tracking-widest pt-4 border-t-[1px] border-gray-200">
            <span>{state.masthead.title}</span>
            <span>PAGE 1</span>
          </div>
        </div>
      </div>

      {/* PAGE 2: Secondary Content */}
      <div
        className="w-[1024px] h-[1448px] bg-tps-paper shadow-2xl overflow-hidden relative text-tps-text flex flex-col shrink-0"
        id="gazzette-document-page2"
      >
        <div className="px-12 py-10 h-full flex flex-col">
          <header className="mb-12 border-b-[3px] border-tps-text pb-4 flex justify-between items-end mt-4">
            <h2 className="font-serif text-4xl font-bold text-tps-text uppercase">
              Research & Profiles
            </h2>
            <div className="flex justify-center">
              <Vignette style={state.vignetteStyle} className="w-24 h-6 text-tps-primary" />
            </div>
          </header>

          {/* SYMMETRICAL BOTTOM LAYOUT 6:6 */}
          <div className="grid grid-cols-12 gap-12 flex-1">
            <div className="col-span-6 pr-4">
              <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-tps-text mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-tps-accent1"></div>
                <EditableText tagName="span" value={state.secondaryArticle1.kicker} onChange={(val) => handleUpdate(draft => { draft.secondaryArticle1.kicker = val; })} />
              </div>
              <EditableText tagName="h3" className="font-serif text-3xl font-bold text-tps-text mb-6 leading-snug" multiline value={state.secondaryArticle1.headline} onChange={(val) => handleUpdate(draft => { draft.secondaryArticle1.headline = val; })} />
              <div className="columns-1 gap-6 font-serif text-sm leading-relaxed text-gray-800 editorial-text">
                <p className="editorial-text"><MarkdownText text={state.secondaryArticle1.content} /></p>
              </div>
              {state.secondaryArticle1.link && (
                <div className="mt-4 flex items-center gap-4 bg-white p-3 border border-gray-200">
                   <QRCodeSVG value={state.secondaryArticle1.link} size={72} fgColor={state.themeColors?.accent1 || "#5e3898"} />
                   <div>
                     <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-tps-text mb-1">Take the Quiz!</div>
                     <div className="font-serif text-xs italic text-gray-600">Scan this code to participate and test your knowledge.</div>
                   </div>
                </div>
              )}
            </div>

            <div className="col-span-6 pl-4 border-l-[1px] border-tps-text">
              <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-tps-text mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-tps-accent2"></div>
                <EditableText tagName="span" value={state.secondaryArticle2.kicker} onChange={(val) => handleUpdate(draft => { draft.secondaryArticle2.kicker = val; })} />
              </div>
              <EditableText tagName="h3" className="font-serif text-3xl font-bold text-tps-text mb-6 leading-snug" multiline value={state.secondaryArticle2.headline} onChange={(val) => handleUpdate(draft => { draft.secondaryArticle2.headline = val; })} />
              <div className="columns-1 gap-6 font-serif text-sm leading-relaxed text-gray-800 editorial-text">
                <p className="editorial-text"><MarkdownText text={state.secondaryArticle2.content} /></p>
              </div>
            </div>
          </div>
          
          {/* FEEL GOOD CORNER (MAIN BLOCK) */}
          <div className="mt-8 mb-8 p-8 rounded shadow-lg border-2" style={{ backgroundColor: 'var(--color-tps-primary)', borderColor: 'var(--color-tps-accent1)' }}>
            <div className="font-sans text-[14px] font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
              Feel Good Corner
            </div>
            <div className="font-sans text-sm text-white whitespace-pre-wrap leading-relaxed opacity-95">
              <EditableText tagName="div" multiline value={state.feelGoodCorner || 'Time for a break! Here are some quick office hacks or trivia...'} onChange={(val) => handleUpdate(draft => { draft.feelGoodCorner = val; })} />
            </div>
          </div>

          <div className="mt-auto flex justify-between items-center text-[10px] text-gray-400 font-sans tracking-widest pt-4 border-t-[1px] border-gray-200 mb-8">
            <span><EditableText tagName="span" value={state.masthead.title} onChange={(val) => handleUpdate(draft => { draft.masthead.title = val; })} /></span>
            <span>PAGE 2</span>
          </div>
        </div>


      </div>
    </div>
  );
});

GazzettePreview.displayName = 'GazzettePreview';
