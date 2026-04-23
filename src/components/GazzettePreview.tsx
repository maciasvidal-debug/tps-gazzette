import React, { forwardRef } from 'react';
import type { GazzetteState } from '../types/gazzette';
import { Vignette } from './Vignette';

interface PreviewProps {
  state: GazzetteState;
}

export const GazzettePreview = forwardRef<HTMLDivElement, PreviewProps>(({ state }, ref) => {
  return (
    <div className="flex justify-center p-8 bg-tps-canvas min-h-screen">
      {/* Main A4-ish Container, max-w-5xl (1024px) */}
      <div 
        ref={ref}
        id="gazzette-document"
        className="w-full max-w-5xl bg-tps-paper shadow-2xl overflow-hidden relative text-tps-text"
        style={{ minHeight: '1448px' }} 
      >
        <div className="px-12 py-10 h-full flex flex-col">
          
          {/* MASTHEAD */}
          <header className="mb-8 text-center border-b-[6px] border-tps-primary pb-6">
            <div className="flex justify-between items-end mb-2 font-sans text-xs font-bold tracking-widest text-tps-primary uppercase">
              <span>{state.masthead.date}</span>
              <span className="flex gap-4">
                {state.masthead.tags.map(tag => <span key={tag}>{tag}</span>)}
              </span>
              <span>{state.masthead.volume}</span>
            </div>
            <h1 className="font-serif text-7xl font-bold tracking-tighter text-tps-primary mb-2 uppercase">
              {state.masthead.title}
            </h1>
            <div className="flex justify-center">
              <Vignette />
            </div>
          </header>

          {/* ASYMMETRICAL TOP LAYOUT 4:8 */}
          <div className="grid grid-cols-12 gap-8 mb-8">
            
            {/* LEFT SIDEBAR (4 cols) */}
            <aside className="col-span-4 flex flex-col gap-6">
              {/* Spotlight */}
              <div className="border-b-[3px] border-tps-primary pb-6">
                <div className="font-sans text-xs font-bold uppercase tracking-widest text-tps-primary mb-2">Spotlight</div>
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
                <p className="font-serif text-sm italic text-gray-700 leading-snug">
                  {state.spotlight.caption}
                </p>
              </div>

              {/* Quote of the week */}
              <div className="border border-tps-primary p-5 bg-tps-paper relative">
                <div className="absolute -top-2 left-4 bg-tps-paper px-2 font-sans text-[10px] font-bold uppercase tracking-wider text-tps-primary">
                  Quote of the Week
                </div>
                <blockquote className="font-serif text-lg italic text-tps-primary leading-relaxed mt-2">
                  "{state.quote.text}"
                </blockquote>
                <div className="text-right mt-3 font-sans text-xs font-bold text-gray-600">
                  — {state.quote.author}
                </div>
              </div>

              {/* Staff Box */}
              <div className="mt-auto border-t border-tps-primary pt-4 text-xs font-sans">
                <div className="font-bold uppercase tracking-wider mb-3 text-tps-primary border-b border-tps-primary pb-1 inline-block">Staff Box</div>
                <div className="mb-2">
                  <span className="font-bold text-gray-600">Editor in Chief:</span><br/>
                  {state.staffBox.editorInChief}
                </div>
                <div className="mb-2">
                  <span className="font-bold text-gray-600">Contributors:</span><br/>
                  {state.staffBox.contributors.join(', ')}
                </div>
                <div className="mb-2">
                  <span className="font-bold text-gray-600">Art Direction:</span><br/>
                  {state.staffBox.artDirection}
                </div>
                <div className="mt-4 text-[10px] text-gray-500 italic">
                  {state.staffBox.copyright}
                </div>
              </div>
            </aside>

            {/* MAIN ARTICLE (8 cols) */}
            <main className="col-span-8 border-l border-tps-primary pl-8">
              <div className="font-sans text-sm font-bold uppercase tracking-widest text-tps-primary mb-3 flex items-center gap-3">
                {state.featureStory.kicker} <Vignette className="w-16 h-4" />
              </div>
              <h2 className="font-serif text-5xl font-bold leading-tight text-tps-primary mb-4">
                {state.featureStory.headline}
              </h2>
              <div className="font-sans text-sm font-bold text-gray-600 mb-6 uppercase tracking-wider">
                By {state.featureStory.author}
              </div>
              
              <div className="font-serif text-lg leading-relaxed text-gray-800 text-justify">
                {state.featureStory.paragraphs.map((p, i) => {
                  if (i === 0) {
                    return (
                      <p key={i} className="mb-4">
                        <span style={{ float: 'left', fontSize: '5.5rem', lineHeight: '0.8', fontWeight: 900, color: '#3c2065', paddingRight: '8px', paddingTop: '8px' }}>
                          {p.charAt(0)}
                        </span>
                        {p.slice(1)}
                      </p>
                    );
                  }
                  
                  return (
                    <React.Fragment key={i}>
                      <p className="mb-4">{p}</p>
                      {i === state.featureStory.pullQuotePosition && state.featureStory.pullQuote && (
                        <blockquote className="my-8 py-4 border-y-2 border-tps-accent1 font-serif text-2xl italic text-tps-primary text-center px-8 font-bold">
                          "{state.featureStory.pullQuote}"
                        </blockquote>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </main>
          </div>

          {/* SYMMETRICAL BOTTOM LAYOUT 6:6 */}
          <div className="grid grid-cols-12 gap-8 border-t-[3px] border-tps-primary pt-8 mt-auto mb-12">
            <div className="col-span-6 pr-4">
              <div className="font-sans text-xs font-bold uppercase tracking-widest text-tps-primary mb-2">
                {state.secondaryArticle1.kicker}
              </div>
              <h3 className="font-serif text-2xl font-bold text-tps-primary mb-3 leading-snug">
                {state.secondaryArticle1.headline}
              </h3>
              <p className="font-serif text-sm leading-relaxed text-gray-700 text-justify">
                {state.secondaryArticle1.content}
              </p>
            </div>
            <div className="col-span-6 pl-4 border-l border-gray-300">
              <div className="font-sans text-xs font-bold uppercase tracking-widest text-tps-primary mb-2">
                {state.secondaryArticle2.kicker}
              </div>
              <h3 className="font-serif text-2xl font-bold text-tps-primary mb-3 leading-snug">
                {state.secondaryArticle2.headline}
              </h3>
              <p className="font-serif text-sm leading-relaxed text-gray-700 text-justify">
                {state.secondaryArticle2.content}
              </p>
            </div>
          </div>
          
        </div>
        
        {/* FEEL GOOD CORNER (FOOTER) */}
        <footer className="bg-tps-footer text-tps-paper py-6 px-12 absolute bottom-0 w-full">
          <div className="flex justify-between items-center">
            <div className="font-sans text-xs uppercase tracking-widest text-tps-accent2">
              Feel Good Corner
            </div>
            <div className="font-serif text-sm italic">
              "Excellence is not an act, but a habit."
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
});

GazzettePreview.displayName = 'GazzettePreview';