export interface MastheadState {
  title: string;
  date: string;
  volume: string;
  tags: string[];
}

export interface FeatureStoryState {
  kicker: string;
  headline: string;
  author: string;
  paragraphs: string[];
  pullQuote: string;
  pullQuotePosition: number;
}

export interface SpotlightState {
  imageUrl: string;
  caption: string;
  grayscale: boolean;
  scale?: number;
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  fit?: 'cover' | 'contain';
  link?: string;
}

export interface QuoteState {
  text: string;
  author: string;
}

export interface StaffBoxState {
  editorInChief: string;
  contributors: string[];
  artDirection: string;
  copyright: string;
}

export interface SecondaryArticleState {
  kicker: string;
  headline: string;
  content: string;
  link?: string;
}


export interface TransformState {
  translate: [number, number];
  rotate: number;
  scale: [number, number];
}


export interface CustomImageBox {
  id: string;
  url: string;
  page: 1 | 2;
  zIndex?: number;
  shape?: 'rectangle' | 'circle' | 'rounded';
  filter?: 'none' | 'grayscale' | 'sepia' | 'blur';
}

export interface CustomTextBox {
  id: string;
  content: string;
  page: 1 | 2;
  zIndex?: number;
}

export interface Snapshot {
  id: string;
  name: string;
  timestamp: string;
  state: GazzetteState;
}

export interface GazzetteState {
  feelGoodCorner?: string;

  themeColors?: {
    primary: string;
    accent1: string;
    accent2: string;
    quote: string;
    text: string;
  };


  masthead: MastheadState;
  featureStory: FeatureStoryState;
  spotlight: SpotlightState;
  quote: QuoteState;
  staffBox: StaffBoxState;
  secondaryArticle1: SecondaryArticleState;
  secondaryArticle2: SecondaryArticleState;
  vignetteStyle?: 'classic' | 'science' | 'writing' | 'medical';
  dropCapStyle?: 'classic' | 'ornamental';
  layoutTemplate?: 'classic' | 'modern' | 'visual';
  typography?: { serif: string; sans: string; baseSize: number; };
  transforms?: Record<string, TransformState>;
  freeDesignMode?: boolean;
  customTextBoxes?: CustomTextBox[];
  customImageBoxes?: CustomImageBox[];
}
