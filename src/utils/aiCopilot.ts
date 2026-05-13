import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import type { Schema } from '@google/generative-ai';
import type { GazzetteState, CustomTextBox } from '../types/gazzette';

const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

// We define a strict schema so Gemini returns structured JSON we can easily parse
const gazzetteSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    masthead: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        date: { type: SchemaType.STRING },
        volume: { type: SchemaType.STRING },
        tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      }
    },
    featureStory: {
      type: SchemaType.OBJECT,
      properties: {
        kicker: { type: SchemaType.STRING },
        headline: { type: SchemaType.STRING },
        author: { type: SchemaType.STRING },
        paragraphs: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        pullQuote: { type: SchemaType.STRING },
        pullQuotePosition: { type: SchemaType.NUMBER },
      }
    },
    quote: {
      type: SchemaType.OBJECT,
      properties: {
        text: { type: SchemaType.STRING },
        author: { type: SchemaType.STRING },
      }
    },
    secondaryArticle1: {
      type: SchemaType.OBJECT,
      properties: {
        kicker: { type: SchemaType.STRING },
        headline: { type: SchemaType.STRING },
        content: { type: SchemaType.STRING },
      }
    },
    secondaryArticle2: {
      type: SchemaType.OBJECT,
      properties: {
        kicker: { type: SchemaType.STRING },
        headline: { type: SchemaType.STRING },
        content: { type: SchemaType.STRING },
      }
    },
    feelGoodCorner: { type: SchemaType.STRING },
    customTextBoxes: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          content: { type: SchemaType.STRING },
          page: { type: SchemaType.NUMBER },
        }
      }
    }
  }
};

export const executeAiCommand = async (
  prompt: string,
  currentState: GazzetteState
): Promise<Partial<GazzetteState>> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // We use gemini-1.5-flash as it is fast and supports JSON schema output
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: gazzetteSchema,
    }
  });

  const systemInstruction = `
You are an expert editorial assistant and designer for a newspaper called "The TPS Gazzette".
You receive the current state of the newspaper (in JSON) and a natural language command from the user.
Your job is to apply the requested changes to the content and return the updated state.
DO NOT change fields the user didn't ask you to change, just return them exactly as they are.
Maintain the professional or requested tone. You can rewrite articles, generate quotes, summarize text, or add custom text boxes.

Current State:
${JSON.stringify({
  masthead: currentState.masthead,
  featureStory: currentState.featureStory,
  quote: currentState.quote,
  secondaryArticle1: currentState.secondaryArticle1,
  secondaryArticle2: currentState.secondaryArticle2,
  feelGoodCorner: currentState.feelGoodCorner,
  customTextBoxes: currentState.customTextBoxes || []
}, null, 2)}
`;

  const userPrompt = `Command: ${prompt}`;

  try {
    const result = await model.generateContent([systemInstruction, userPrompt]);
    const responseText = result.response.text();
    const updatedState = JSON.parse(responseText);

    // Clean up or validate specific strict fields if needed
    if (updatedState.customTextBoxes) {
      updatedState.customTextBoxes = updatedState.customTextBoxes.map((b: CustomTextBox) => ({
        ...b,
        page: b.page === 2 ? 2 : 1 // enforce union type
      }));
    }

    return updatedState as Partial<GazzetteState>;
  } catch (error) {
    console.error("AI execution failed:", error);
    throw new Error("Failed to execute AI command. Please try again.", { cause: error });
  }
};
