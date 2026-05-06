// Simulated AI Copilot for the Gazzette Editor
// In a real production app, this would call an LLM API (like OpenAI, Anthropic, etc.)

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const corporateQuotes = [
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "The secret of change is to focus all of your energy, not on fighting the old, but on building the new.", author: "Socrates" },
  { text: "Coming together is a beginning, staying together is progress, and working together is success.", author: "Henry Ford" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
];

const feelGoodCorners = [
  "Take a deep breath. You've survived 100% of your bad days so far.",
  "Remember to hydrate! A well-watered brain is a creative brain.",
  "Your best work happens when you take time to rest. Step away from the screen for 5 minutes.",
  "Did you know? Laughing for 10 minutes a day burns calories. Go find a good joke!",
  "Small progress is still progress. Celebrate the little wins today."
];

export const generateQuote = async (): Promise<{ text: string, author: string }> => {
  await sleep(800); // Simulate network latency
  const random = corporateQuotes[Math.floor(Math.random() * corporateQuotes.length)];
  return random;
};

export const generateFeelGood = async (): Promise<string> => {
  await sleep(600);
  const random = feelGoodCorners[Math.floor(Math.random() * feelGoodCorners.length)];
  return random;
};

export const summarizeText = async (text: string): Promise<string> => {
  if (!text || text.length < 50) return text;
  await sleep(1500);

  // Fake summarization: take the first sentence and add " In short, " and a piece of the middle
  const sentences = text.split('. ');
  if (sentences.length <= 1) return text;

  return `${sentences[0]}. In short, we are focusing on improving our core metrics and delivering value faster.`;
};

export const improveTone = async (text: string, tone: 'professional' | 'casual'): Promise<string> => {
    if (!text) return text;
    await sleep(1200);

    if (tone === 'professional') {
        return "Furthermore, " + text.replace(/really/g, "significantly").replace(/good/g, "optimal");
    } else {
        return "Hey team, " + text.replace(/Furthermore/g, "Also").replace(/optimal/g, "great");
    }
}
