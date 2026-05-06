import React, { useState } from 'react';
import type { GazzetteState } from '../types/gazzette';
import { MarkdownText } from './MarkdownText';
import { Vignette } from './Vignette';

interface Props {
  state: GazzetteState;
  onClose: () => void;
}

export const FlipbookMode: React.FC<Props> = ({ state, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pages = [0, 1]; // We have 2 pages currently

  const nextPage = () => setCurrentPage(p => Math.min(p + 1, pages.length - 1));
  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 0));

  // Define theme colors with fallbacks
  const theme = {
    primary: state.themeColors?.primary || "#3c2065",
    accent1: state.themeColors?.accent1 || "#5e3898",
    accent2: state.themeColors?.accent2 || "#a57ced",
    text: state.themeColors?.text || "#1f2937",
    quote: state.themeColors?.quote || "#8b2c39"
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1E] text-[#E5E7EB] flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-[#2C2D35] bg-[#212126] flex items-center justify-between px-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-[#8B8D98] text-xs font-bold tracking-[0.2em] uppercase">
             INTERACTIVE READING MODE
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-xs text-[#8B8D98]">Page {currentPage + 1} of {pages.length}</div>
           <button onClick={onClose} className="text-[#8B8D98] hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative p-4 md:p-8 flex justify-center items-start perspective-1000">

        {/* Navigation Buttons (Absolute) */}
        {currentPage > 0 && (
          <button onClick={prevPage} className="fixed left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#2C2D35] hover:bg-[#343541] rounded-full flex items-center justify-center border border-[#4B4C56] shadow-lg z-10 transition-colors">
             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
        )}

        {currentPage < pages.length - 1 && (
          <button onClick={nextPage} className="fixed right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#2C2D35] hover:bg-[#343541] rounded-full flex items-center justify-center border border-[#4B4C56] shadow-lg z-10 transition-colors">
             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        )}

        {/* The "Page" */}
        <div className="w-full max-w-3xl bg-[#FCFAF5] shadow-2xl rounded-sm overflow-hidden transition-all duration-500 ease-in-out transform origin-left"
             style={{
                 minHeight: '80vh',
                 // A simple 3D flip effect simulation based on state change could go here,
                 // but for now we use a smooth fade/slide via standard React rendering
             }}>

          {currentPage === 0 && (
            <div className="p-8 md:p-12 text-[#1f2937] animate-fade-in">
                {/* Responsive Header */}
                <div className="text-center border-b-2 pb-6 mb-8" style={{ borderColor: theme.primary }}>
                   <div className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: theme.accent1 }}>{state.masthead.date} • {state.masthead.volume}</div>
                   <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight" style={{ color: theme.primary }}>{state.masthead.title}</h1>
                </div>

                {/* Spotlight for Mobile View */}
                {state.spotlight.imageUrl && (
                   <div className="mb-8">
                      <img
                        src={state.spotlight.imageUrl}
                        className={`w-full rounded-sm shadow-md ${state.spotlight.grayscale ? 'grayscale' : ''}`}
                        alt="Spotlight"
                      />
                      {state.spotlight.caption && (
                        <p className="text-sm italic mt-2 text-gray-600 border-l-2 pl-3" style={{ borderColor: theme.accent2 }}>{state.spotlight.caption}</p>
                      )}
                      {state.spotlight.link && (
                         <a href={state.spotlight.link} target="_blank" rel="noreferrer" className="inline-block mt-3 px-4 py-2 text-white text-xs font-bold uppercase tracking-wider rounded" style={{ backgroundColor: theme.primary }}>
                            Explore Interactive Content →
                         </a>
                      )}
                   </div>
                )}

                {/* Main Feature */}
                <div className="mb-12">
                   <div className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: theme.primary }}>
                     <Vignette className="w-8 h-3" style={state.vignetteStyle} /> {state.featureStory.kicker}
                   </div>
                   <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 leading-tight">{state.featureStory.headline}</h2>
                   <div className="text-sm font-bold uppercase tracking-widest mb-6 pb-4 border-b border-gray-300">By {state.featureStory.author}</div>

                   <div className="font-serif text-lg leading-relaxed space-y-6 text-gray-800">
                      {state.featureStory.paragraphs.map((p, i) => (
                         <div key={i}>
                            <p><MarkdownText text={p} /></p>
                            {i === state.featureStory.pullQuotePosition && state.featureStory.pullQuote && (
                               <blockquote className="my-8 py-6 border-y-2 font-serif text-2xl italic text-center font-bold" style={{ color: theme.quote, borderColor: `${theme.quote}40` }}>
                                 "{state.featureStory.pullQuote}"
                               </blockquote>
                            )}
                         </div>
                      ))}
                   </div>
                </div>
            </div>
          )}

          {currentPage === 1 && (
            <div className="p-8 md:p-12 text-[#1f2937] animate-fade-in bg-white h-full flex flex-col">
               <header className="mb-10 border-b-2 pb-4 flex justify-between items-end" style={{ borderColor: theme.primary }}>
                 <h2 className="font-serif text-3xl font-bold uppercase" style={{ color: theme.primary }}>
                   Research & Profiles
                 </h2>
               </header>

               <div className="flex flex-col md:flex-row gap-12 flex-1">
                 {/* Article 1 */}
                 <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: theme.accent1 }}>
                      {state.secondaryArticle1.kicker}
                    </div>
                    <h3 className="font-serif text-2xl font-bold mb-4 leading-snug">{state.secondaryArticle1.headline}</h3>
                    <div className="font-serif text-base leading-relaxed text-gray-800 mb-6">
                       <MarkdownText text={state.secondaryArticle1.content} />
                    </div>
                    {state.secondaryArticle1.link && (
                       <a href={state.secondaryArticle1.link} target="_blank" rel="noreferrer" className="inline-block px-4 py-2 text-white text-xs font-bold uppercase tracking-wider rounded" style={{ backgroundColor: theme.accent1 }}>
                          Take the Quiz →
                       </a>
                    )}
                 </div>

                 {/* Article 2 */}
                 <div className="flex-1 md:border-l md:pl-12 border-gray-200">
                    <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: theme.accent2 }}>
                      {state.secondaryArticle2.kicker}
                    </div>
                    <h3 className="font-serif text-2xl font-bold mb-4 leading-snug">{state.secondaryArticle2.headline}</h3>
                    <div className="font-serif text-base leading-relaxed text-gray-800">
                       <MarkdownText text={state.secondaryArticle2.content} />
                    </div>
                 </div>
               </div>

               {/* Quote & Footer */}
               <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                  <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: theme.quote }}>Quote of the Week</div>
                  <blockquote className="font-serif text-2xl italic mb-4" style={{ color: theme.quote }}>
                     "{state.quote.text}"
                  </blockquote>
                  <div className="text-sm font-bold uppercase tracking-wider">— {state.quote.author}</div>
               </div>

               <div className="mt-12 p-6 rounded-lg text-center" style={{ backgroundColor: theme.primary, color: '#FCFAF5' }}>
                  <div className="text-xs uppercase tracking-widest mb-2 font-bold opacity-80">Feel Good Corner</div>
                  <div className="font-serif italic text-sm">"Excellence is not an act, but a habit."</div>
               </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};
