export interface MastheadData {
  title: string;
  date: string;
  volume: string;
  tags: string[];
}

export interface SpotlightData {
  imageUrl: string;
  caption: string;
  grayscale: boolean;
}

export interface QuoteData {
  text: string;
  author: string;
}

export interface StaffBoxData {
  editorInChief: string;
  contributors: string[];
  artDirection: string;
  copyright: string;
}

export interface FeatureStoryData {
  kicker: string;
  headline: string;
  author: string;
  paragraphs: string[];
  pullQuote: string;
  pullQuotePosition: number; // After which paragraph
}

export interface SecondaryArticleData {
  kicker: string;
  headline: string;
  content: string;
}

export interface GazzetteState {
  masthead: MastheadData;
  spotlight: SpotlightData;
  quote: QuoteData;
  staffBox: StaffBoxData;
  featureStory: FeatureStoryData;
  secondaryArticle1: SecondaryArticleData;
  secondaryArticle2: SecondaryArticleData;
}