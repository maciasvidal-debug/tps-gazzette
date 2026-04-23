import { useRef } from 'react';
import { useGazzetteState } from './hooks/useGazzetteState';
import { EditorSidebar } from './components/EditorSidebar';
import { GazzettePreview } from './components/GazzettePreview';
import { exportPdf } from './components/PdfExport';

function App() {
  const { state, updateState, resetState } = useGazzetteState();
  const printRef = useRef<HTMLDivElement>(null);

  const handleExportPdf = () => {
    exportPdf(state);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-tps-canvas">
      {/* Left Panel: Editor */}
      <EditorSidebar 
        state={state} 
        updateState={updateState} 
        resetState={resetState} 
        onExportPdf={handleExportPdf}
      />
      
      {/* Right Panel: Live Preview */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
        <GazzettePreview ref={printRef} state={state} />
      </main>
    </div>
  );
}

export default App;