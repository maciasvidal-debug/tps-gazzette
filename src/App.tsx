import React, { useRef, useState } from 'react';
import { useGazzetteState } from './hooks/useGazzetteState';
import { EditorSidebar } from './components/EditorSidebar';
import { GazzettePreview } from './components/GazzettePreview';
import { exportPdf } from './components/PdfExport';
import { FlipbookMode } from './components/FlipbookMode';

function App() {
  const { state, updateState, resetState } = useGazzetteState();
  const printRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.85);
  const [sidebarWidth, setSidebarWidth] = useState(384); // Default 96rem/w-96 is 384px
  const isResizing = useRef(false);

  const startResizing = React.useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = React.useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const resize = React.useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing.current) {
        // Limit min width to 250px and max width to 800px
        const newWidth = Math.min(Math.max(mouseMoveEvent.clientX, 250), 800);
        setSidebarWidth(newWidth);
      }
    },
    []
  );

  React.useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);
  const [showFlipbook, setShowFlipbook] = useState(false);

  const handleExportPdf = (mode: 'digital' | 'print' = 'digital') => {
    exportPdf(state, mode);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.25));
  const handleZoomReset = () => setZoom(0.85);

  return (
    <div className="flex h-screen overflow-hidden bg-[#2C2D35]">
      {/* Left Panel: Editor */}
      <div style={{ width: sidebarWidth, flexShrink: 0 }} className="flex h-full">
      <div className="flex-1 w-full">
      <EditorSidebar 
        state={state} 
        updateState={updateState} 
        resetState={resetState} 
        onExportPdf={handleExportPdf}
      />
      </div>
      <div
        className="w-1.5 cursor-col-resize hover:bg-[#ED6A5E] bg-[#1A1A1E] border-r border-[#2C2D35] flex flex-col justify-center items-center transition-colors"
        onMouseDown={startResizing}
      >
        <div className="w-0.5 h-8 bg-[#4B4C56] rounded-full"></div>
      </div>
      </div>
      
      {/* Right Panel: Live Preview */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Toolbar */}
        <div className="h-14 bg-[#212126] border-b border-[#1A1A1E] flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Window controls dots */}
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ED6A5E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#F5BF4F]"></div>
              <div className="w-3 h-3 rounded-full bg-[#61C554]"></div>
            </div>

            <div className="text-[#8B8D98] text-xs font-sans tracking-[0.2em] ml-4 font-medium uppercase">
              LIVE PREVIEW — A4
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 flex items-center justify-center rounded text-[#8B8D98] hover:text-white hover:bg-[#343541] transition-colors border border-transparent hover:border-[#4B4C56]"
              title="Zoom Out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </button>
            <span className="text-[#8B8D98] text-xs font-sans min-w-[3ch] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 flex items-center justify-center rounded text-[#8B8D98] hover:text-white hover:bg-[#343541] transition-colors border border-transparent hover:border-[#4B4C56]"
              title="Zoom In"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </button>
            <button
              onClick={() => setShowFlipbook(true)}
              className="flex items-center gap-2 bg-[#ED6A5E] hover:bg-[#F2555A] text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-sm ml-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              Mobile Preview
            </button>
            <div className="w-px h-4 bg-[#343541] mx-2"></div>
            <button
              onClick={handleZoomReset}
              className="w-8 h-8 flex items-center justify-center rounded text-[#8B8D98] hover:text-white hover:bg-[#343541] transition-colors border border-transparent hover:border-[#4B4C56]"
              title="Reset Zoom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
            </button>
          </div>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#2C2D35] flex items-start justify-center p-8">
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}>
            <GazzettePreview ref={printRef} state={state} updateState={updateState} />
          </div>
        </div>
      </main>
      {showFlipbook && <FlipbookMode state={state} onClose={() => setShowFlipbook(false)} />}
    </div>
  );
}

export default App;
