import React, { forwardRef } from 'react';
import type { GazzetteState } from '../types/gazzette';
import { Vignette } from './Vignette';
import { MarkdownText } from './MarkdownText';

interface PreviewProps {
  state: GazzetteState;
}

export const GazzettePreview = forwardRef<HTMLDivElement, PreviewProps>(({ state }, ref) => {
  return (
    <div className="flex flex-col gap-12 items-center bg-transparent pb-16" ref={ref}>
      {/* PAGE 1: Front Cover / Main Story Start */}
      <div 
        className="w-[1024px] h-[1448px] bg-tps-paper shadow-2xl overflow-hidden relative text-tps-text flex flex-col shrink-0"
        id="gazzette-document-page1"
      >
        <div className="px-12 py-10 h-full flex flex-col">
          {/* MASTHEAD */}
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

          {/* ASYMMETRICAL TOP LAYOUT 4:8 */}
          <div className="grid grid-cols-12 gap-8 mb-8 flex-1">
            
            {/* LEFT SIDEBAR (4 cols) */}
            <aside className="col-span-4 flex flex-col gap-6">
              {/* Spotlight */}
              <div className="border-b-[1px] border-tps-text pb-6">
                <div className="font-sans text-xs font-bold uppercase tracking-widest text-tps-text mb-4">Spotlight</div>
                <img 
                  src={state.spotlight.imageUrl} 
                  alt="Spotlight"
                  className={`w-full aspect-square object-cover mb-3 ${state.spotlight.grayscale ? 'grayscale' : ''}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22800%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22800%22%20height%3D%22800%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%23999%22%3EImage%20Not%20Found%3C%2Ftext%3E%3C%2Fsvg%3E';
                  }}
                />
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
                  "{state.quote.text}"
                </blockquote>
                <div className="mt-3 font-sans text-xs font-bold text-tps-text">
                  — {state.quote.author}
                </div>
              </div>

              {/* Staff Box */}
              <div className="mt-auto pt-4 text-xs font-sans">
                <div className="font-bold uppercase tracking-wider mb-3 text-tps-text">Staff Box</div>
                <div className="mb-2">
                  <span className="font-bold text-tps-text">Editor in Chief:</span> {state.staffBox.editorInChief}
                </div>
                <div className="mb-2">
                  <span className="font-bold text-tps-text">Contributors:</span><br/>
                  {state.staffBox.contributors.join(', ')}
                </div>
                <div className="mb-2">
                  <span className="font-bold text-tps-text">Art Direction:</span><br/>
                  {state.staffBox.artDirection}
                </div>
                <div className="mt-6 text-[10px] text-gray-500 italic">
                  {state.staffBox.copyright}
                </div>
              </div>
            </aside>

            {/* MAIN ARTICLE (8 cols) */}
            <main className="col-span-8 border-l-[1px] border-tps-text pl-8">
              <div className="font-sans text-xs font-bold uppercase tracking-widest text-tps-text mb-4 flex items-center gap-3">
                {state.featureStory.kicker} <Vignette className="w-16 h-4 text-[#7A6490]" style={state.vignetteStyle} />
              </div>
              <h2 className="font-serif text-5xl font-bold leading-tight text-tps-text mb-4">
                {state.featureStory.headline}
              </h2>
              <div className="font-sans text-xs font-bold text-tps-text mb-8 uppercase tracking-widest border-b-[1px] border-tps-text pb-4">
                By {state.featureStory.author}
              </div>
              
              <div className="columns-2 gap-8 font-serif text-sm leading-relaxed text-gray-800 editorial-text">
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
                          <span style={{ float: 'left', fontSize: '5.5rem', lineHeight: '0.8', fontWeight: 900, color: '#3c2065', paddingRight: '8px', paddingTop: '8px' }}>
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
                {state.secondaryArticle1.kicker}
              </div>
              <h3 className="font-serif text-3xl font-bold text-tps-text mb-6 leading-snug">
                {state.secondaryArticle1.headline}
              </h3>
              <div className="columns-1 gap-6 font-serif text-sm leading-relaxed text-gray-800 editorial-text">
                <p className="editorial-text"><MarkdownText text={state.secondaryArticle1.content} /></p>
              </div>
            </div>

            <div className="col-span-6 pl-4 border-l-[1px] border-tps-text">
              <div className="font-sans text-[10px] font-bold uppercase tracking-widest text-tps-text mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-tps-accent2"></div>
                {state.secondaryArticle2.kicker}
              </div>
              <h3 className="font-serif text-3xl font-bold text-tps-text mb-6 leading-snug">
                {state.secondaryArticle2.headline}
              </h3>
              <div className="columns-1 gap-6 font-serif text-sm leading-relaxed text-gray-800 editorial-text">
                <p className="editorial-text"><MarkdownText text={state.secondaryArticle2.content} /></p>
              </div>
            </div>
          </div>
          
          <div className="mt-auto flex justify-between items-center text-[10px] text-gray-400 font-sans tracking-widest pt-4 border-t-[1px] border-gray-200 mb-16">
            <span>{state.masthead.title}</span>
            <span>PAGE 2</span>
          </div>
        </div>

        {/* FEEL GOOD CORNER (FOOTER) */}
        <footer className="bg-tps-footer text-tps-paper py-4 px-12 absolute bottom-0 w-full">
          <div className="flex justify-between items-center">
            <div className="font-sans text-[10px] uppercase tracking-widest text-tps-paper">
              Feel Good Corner
            </div>
            <div className="font-serif text-[10px] italic">
              "Excellence is not an act, but a habit."
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
});

GazzettePreview.displayName = 'GazzettePreview';
