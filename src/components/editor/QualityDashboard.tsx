import { useMemo } from 'react';
import type { GazzetteState } from '../../types/gazzette';
import { getWordCount, getReadingTime, getFleschKincaidScore, getContrastRatio, passesWCAGAA, getToneMetrics } from '../../utils/qualityMetrics';

interface QualityDashboardProps {
  state: GazzetteState;
}

export function QualityDashboard({ state }: QualityDashboardProps) {
  const allText = useMemo(() => {
    return [
      state.masthead.title,
      state.featureStory.headline,
      state.featureStory.paragraphs.join(' '),
      state.secondaryArticle1.headline,
      state.secondaryArticle1.content,
      state.secondaryArticle2.headline,
      state.secondaryArticle2.content,
      state.quote.text
    ].join(' ');
  }, [state]);

  const wordCount = getWordCount(allText);
  const readingTime = getReadingTime(allText);
  const readabilityScore = getFleschKincaidScore(allText);
  const toneMetrics = getToneMetrics(allText);

  // Analyze theme colors against white paper (#FCFAF5)
  const paperColor = '#FCFAF5';
  const colorChecks = [
    { name: 'Primary', hex: state.themeColors?.primary || '#3c2065' },
    { name: 'Accent 1', hex: state.themeColors?.accent1 || '#5e3898' },
    { name: 'Text', hex: state.themeColors?.text || '#1f2937' },
  ].map(color => ({
    ...color,
    contrast: getContrastRatio(color.hex, paperColor),
    passes: passesWCAGAA(getContrastRatio(color.hex, paperColor), false)
  }));

  const allPass = colorChecks.every(c => c.passes);

  return (
    <div className="space-y-4 text-sm text-[#8B8D98]">
      <div className="bg-[#212126] p-3 rounded-lg border border-[#2C2D35]">
        <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-xs">Content Metrics</h4>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-xl font-bold text-[#F5BF4F]">{wordCount}</div>
            <div className="text-[10px] uppercase">Words</div>
          </div>
          <div>
            <div className="text-xl font-bold text-[#61C554]">{readingTime}</div>
            <div className="text-[10px] uppercase">Min Read</div>
          </div>
          <div>
            <div className="text-xl font-bold text-[#F5BF4F]">{readabilityScore}</div>
            <div className="text-[10px] uppercase">Readability</div>
          </div>
          <div>
            <div className={`text-xl font-bold ${toneMetrics.objectivityScore >= 70 ? 'text-[#61C554]' : 'text-[#ED6A5E]'}`}>{toneMetrics.objectivityScore}</div>
            <div className="text-[10px] uppercase">Objectivity</div>
          </div>
        </div>
        {toneMetrics.flaggedWords.length > 0 && (
          <div className="mt-3 text-[10px] border-t border-[#343541] pt-2">
            <span className="text-white font-semibold">Flagged subjective words: </span>
            <span className="text-[#8B8D98]">{toneMetrics.flaggedWords.join(', ')}</span>
          </div>
        )}
      </div>

      <div className="bg-[#212126] p-3 rounded-lg border border-[#2C2D35]">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs">A11y Contrast</h4>
          {allPass ? (
            <span className="text-[#61C554] text-[10px] uppercase font-bold flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              Pass
            </span>
          ) : (
            <span className="text-[#ED6A5E] text-[10px] uppercase font-bold flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Warning
            </span>
          )}
        </div>
        <div className="space-y-2 mt-3">
          {colorChecks.map(check => (
            <div key={check.name} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-[#4B4C56]" style={{ backgroundColor: check.hex }} />
                <span className="text-xs">{check.name}</span>
              </div>
              <div className={`text-xs font-mono ${check.passes ? 'text-[#61C554]' : 'text-[#ED6A5E]'}`}>
                {check.contrast}:1
              </div>
            </div>
          ))}
        </div>
        {!allPass && (
          <p className="text-[10px] text-[#ED6A5E] mt-2 leading-tight">
            Some colors do not meet WCAG AA contrast ratio (4.5:1) against the background.
          </p>
        )}
      </div>
    </div>
  );
}
