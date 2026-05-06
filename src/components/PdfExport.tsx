/* eslint-disable react-refresh/only-export-components */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  pdf,
  Svg,
  Path,
  Rect
} from '@react-pdf/renderer';
import type { GazzetteState } from '../types/gazzette';

Font.register({
  family: 'Lora',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/lora/v35/0QI6MX1D_JOuGQbT0gvTJPa787weuxYMkq3Y.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/lora/v35/0QI6MX1D_JOuGQbT0gvTJPa787weuxYMkq3Y.woff2', fontWeight: 700 }, 
    { src: 'https://fonts.gstatic.com/s/lora/v35/0QI8MX1D_JOuMw_hLreTE_t-pNVyq_lW.woff2', fontStyle: 'italic' },
  ]
});

Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVc.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4gaVc.ttf', fontWeight: 700 }
  ]
});

const colors = {
  paper: '#FCFAF5',
  primary: '#3c2065',
  accent1: '#5e3898',
  accent2: '#a57ced',
  footer: '#1b1029',
  text: '#1f2937',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray300: '#d1d5db'
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.paper,
    paddingTop: 40,
    paddingBottom: 0,
    paddingHorizontal: 48,
    fontFamily: 'Lora',
    color: colors.text,
  },
  masthead: {
    borderBottomWidth: 6,
    borderBottomColor: colors.primary,
    paddingBottom: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  mastheadMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    fontFamily: 'Open Sans',
    fontSize: 8,
    fontWeight: 700,
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  mastheadTitle: {
    fontFamily: 'Lora',
    fontSize: 56,
    fontWeight: 700,
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },
  tags: {
    flexDirection: 'row',
    gap: 16,
  },
  topLayout: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  leftSidebar: {
    width: '33.33%',
    paddingRight: 24,
  },
  mainArticle: {
    width: '66.67%',
    borderLeftWidth: 1,
    borderLeftColor: colors.primary,
    paddingLeft: 24,
  },
  bottomLayout: {
    flexDirection: 'row',
    borderTopWidth: 3,
    borderTopColor: colors.primary,
    paddingTop: 32,
    marginTop: 'auto',
    marginBottom: 80, 
  },
  bottomColLeft: {
    width: '50%',
    paddingRight: 16,
  },
  bottomColRight: {
    width: '50%',
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: colors.gray300,
  },
  kicker: {
    fontFamily: 'Open Sans',
    fontSize: 10,
    fontWeight: 700,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  spotlightContainer: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
    paddingBottom: 24,
    marginBottom: 24,
  },
  spotlightImage: {
    width: '100%',
    height: 180, 
    marginBottom: 12,
    objectFit: 'cover',
  },
  spotlightCaption: {
    fontFamily: 'Lora',
    fontStyle: 'italic',
    fontSize: 10,
    color: colors.gray700,
    lineHeight: 1.4,
  },
  quoteContainer: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 20,
    backgroundColor: colors.paper,
    marginBottom: 24,
    position: 'relative',
  },
  quoteLabel: {
    position: 'absolute',
    top: -6,
    left: 16,
    backgroundColor: colors.paper,
    paddingHorizontal: 8,
    fontFamily: 'Open Sans',
    fontSize: 8,
    fontWeight: 700,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  quoteText: {
    fontFamily: 'Lora',
    fontStyle: 'italic',
    fontSize: 14,
    color: colors.primary,
    lineHeight: 1.5,
    marginTop: 8,
  },
  quoteAuthor: {
    fontFamily: 'Open Sans',
    fontSize: 9,
    fontWeight: 700,
    color: colors.gray600,
    textAlign: 'right',
    marginTop: 12,
  },
  staffBox: {
    borderTopWidth: 1,
    borderTopColor: colors.primary,
    paddingTop: 16,
  },
  staffBoxTitle: {
    fontFamily: 'Open Sans',
    fontSize: 10,
    fontWeight: 700,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingBottom: 4,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  staffEntry: {
    marginBottom: 8,
  },
  staffRole: {
    fontFamily: 'Open Sans',
    fontSize: 9,
    fontWeight: 700,
    color: colors.gray600,
  },
  staffName: {
    fontFamily: 'Open Sans',
    fontSize: 9,
    color: colors.text,
  },
  copyright: {
    fontFamily: 'Open Sans',
    fontSize: 8,
    fontStyle: 'italic',
    color: '#6b7280',
    marginTop: 16,
  },
  featureHeadline: {
    fontFamily: 'Lora',
    fontSize: 36,
    fontWeight: 700,
    color: colors.primary,
    lineHeight: 1.1,
    marginBottom: 16,
  },
  featureAuthor: {
    fontFamily: 'Open Sans',
    fontSize: 10,
    fontWeight: 700,
    color: colors.gray600,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 24,
  },
  paragraph: {
    fontFamily: 'Lora',
    fontSize: 12,
    lineHeight: 1.6,
    color: colors.gray800,
    marginBottom: 16,
    textAlign: 'justify',
  },
  pullQuote: {
    marginVertical: 24,
    paddingVertical: 16,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.accent1,
    fontFamily: 'Lora',
    fontStyle: 'italic',
    fontSize: 18,
    fontWeight: 700,
    color: colors.primary,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  secondaryHeadline: {
    fontFamily: 'Lora',
    fontSize: 18,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 12,
    lineHeight: 1.2,
  },
  secondaryContent: {
    fontFamily: 'Lora',
    fontSize: 10,
    lineHeight: 1.6,
    color: colors.gray700,
    textAlign: 'justify',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.footer,
    paddingVertical: 24,
    paddingHorizontal: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerKicker: {
    fontFamily: 'Open Sans',
    fontSize: 10,
    color: colors.accent2,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  footerText: {
    fontFamily: 'Lora',
    fontStyle: 'italic',
    fontSize: 11,
    color: colors.paper,
  }
});

const VignetteSvg = () => (
  <Svg viewBox="0 0 100 20" width={80} height={16}>
    <Path d="M 0 10 Q 25 0, 50 10 T 100 10" stroke={colors.primary} strokeWidth={1.5} fill="none" />
    <Path d="M 0 12 Q 25 2, 50 12 T 100 12" stroke={colors.primary} strokeWidth={1} fill="none" opacity={0.7} />
    <Path d="M 0 8 Q 25 -2, 50 8 T 100 8" stroke={colors.primary} strokeWidth={1} fill="none" opacity={0.7} />
    <Path d="M 45 5 L 55 15" stroke={colors.primary} strokeWidth={1.5} fill="none" />
    <Path d="M 47 4 L 57 14" stroke={colors.primary} strokeWidth={1} fill="none" opacity={0.5} />
    <Path d="M 43 6 L 53 16" stroke={colors.primary} strokeWidth={1} fill="none" opacity={0.5} />
    <Path d="M 55 5 L 45 15" stroke={colors.primary} strokeWidth={1.5} fill="none" />
    <Path d="M 57 6 L 47 16" stroke={colors.primary} strokeWidth={1} fill="none" opacity={0.5} />
    <Path d="M 53 4 L 43 14" stroke={colors.primary} strokeWidth={1} fill="none" opacity={0.5} />
  </Svg>
);

const GazzettePDF = ({ state, mode }: { state: GazzetteState, mode: 'digital' | 'print' }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      <View style={styles.masthead}>
        <View style={styles.mastheadMeta}>
          <Text>{state.masthead.date}</Text>
          <View style={styles.tags}>
            {state.masthead.tags.map((tag, i) => <Text key={i}>{tag}</Text>)}
          </View>
          <Text>{state.masthead.volume}</Text>
        </View>
        <Text style={styles.mastheadTitle}>{state.masthead.title}</Text>
        <VignetteSvg />
      </View>

      <View style={styles.topLayout}>
        <View style={styles.leftSidebar}>
          <View style={styles.spotlightContainer}>
            <Text style={styles.kicker}>Spotlight</Text>
            {state.spotlight.imageUrl && (
              <Image src={state.spotlight.imageUrl} style={styles.spotlightImage} />
            )}
            <Text style={styles.spotlightCaption}>{state.spotlight.caption}</Text>
          </View>

          <View style={styles.quoteContainer}>
            <Text style={styles.quoteLabel}>Quote of the Week</Text>
            <Text style={styles.quoteText}>"{state.quote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {state.quote.author}</Text>
          </View>

          <View style={styles.staffBox}>
            <Text style={styles.staffBoxTitle}>Staff Box</Text>
            <View style={styles.staffEntry}>
              <Text style={styles.staffRole}>Editor in Chief:</Text>
              <Text style={styles.staffName}>{state.staffBox.editorInChief}</Text>
            </View>
            <View style={styles.staffEntry}>
              <Text style={styles.staffRole}>Contributors:</Text>
              <Text style={styles.staffName}>{state.staffBox.contributors.join(', ')}</Text>
            </View>
            <View style={styles.staffEntry}>
              <Text style={styles.staffRole}>Art Direction:</Text>
              <Text style={styles.staffName}>{state.staffBox.artDirection}</Text>
            </View>
            <Text style={styles.copyright}>{state.staffBox.copyright}</Text>
          </View>
        </View>

        <View style={styles.mainArticle}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
             <Text style={[styles.kicker, { marginBottom: 0, marginRight: 8 }]}>{state.featureStory.kicker}</Text>
             <VignetteSvg />
          </View>
         
          <Text style={styles.featureHeadline}>{state.featureStory.headline}</Text>
          <Text style={styles.featureAuthor}>By {state.featureStory.author}</Text>

          {state.featureStory.paragraphs.map((p, i) => {
            if (i === 0) {
              return (
                 <Text key={i} style={styles.paragraph}>
                    <Text style={{ fontSize: 36, fontWeight: 700, color: colors.primary }}>{p.charAt(0)}</Text>
                    {p.slice(1)}
                 </Text>
              )
            }
            return (
              <View key={i}>
                <Text style={styles.paragraph}>{p}</Text>
                {i === state.featureStory.pullQuotePosition && state.featureStory.pullQuote && (
                  <Text style={styles.pullQuote}>"{state.featureStory.pullQuote}"</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.bottomLayout}>
        <View style={styles.bottomColLeft}>
          <Text style={styles.kicker}>{state.secondaryArticle1.kicker}</Text>
          <Text style={styles.secondaryHeadline}>{state.secondaryArticle1.headline}</Text>
          <Text style={styles.secondaryContent}>{state.secondaryArticle1.content}</Text>
        </View>
        <View style={styles.bottomColRight}>
          <Text style={styles.kicker}>{state.secondaryArticle2.kicker}</Text>
          <Text style={styles.secondaryHeadline}>{state.secondaryArticle2.headline}</Text>
          <Text style={styles.secondaryContent}>{state.secondaryArticle2.content}</Text>
        </View>
      </View>

<View style={[styles.footer, mode === 'print' ? { paddingBottom: 16 } : {}]} fixed>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Text style={styles.footerKicker}>Feel Good Corner</Text>
          {mode === 'print' && (
            <View style={{ width: 40, height: 40, backgroundColor: 'white', padding: 2 }}>
              <Svg viewBox="0 0 10 10" width="36" height="36">
                <Rect x="1" y="1" width="3" height="3" fill="black" />
                <Rect x="6" y="1" width="3" height="3" fill="black" />
                <Rect x="1" y="6" width="3" height="3" fill="black" />
                <Rect x="2" y="2" width="1" height="1" fill="white" />
                <Rect x="7" y="2" width="1" height="1" fill="white" />
                <Rect x="2" y="7" width="1" height="1" fill="white" />
                <Rect x="6" y="6" width="1" height="1" fill="black" />
                <Rect x="8" y="7" width="1" height="1" fill="black" />
                <Rect x="7" y="8" width="1" height="1" fill="black" />
                <Rect x="5" y="4" width="2" height="1" fill="black" />
                <Rect x="4" y="5" width="1" height="2" fill="black" />
              </Svg>
            </View>
          )}
          <Text style={styles.footerText}>"Excellence is not an act, but a habit."</Text>
        </View>
      </View>

    </Page>
  </Document>
);

export const exportPdf = async (state: GazzetteState, mode: 'digital' | 'print' = 'digital') => {
  try {
    const blob = await pdf(<GazzettePDF state={state} mode={mode} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TPS_Gazzette_${state.masthead.date.replace(/ /g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF. Check console for details.");
  }
};