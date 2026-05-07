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
  "🧠 **Brain Break: Coffee Edition**\n\nDid you know that the optimal time to drink coffee is actually between 9:30 AM and 11:30 AM? This is when your cortisol levels naturally drop.\n\nOffice Hack: If you need to quickly chill a hot coffee to make iced coffee, drop in 3 stainless steel whiskey stones instead of ice—it won't dilute your brew! ☕",

  "🎮 **Trivia Time!**\n\nWhich common office item was originally invented to be a bookmark?\n\n...\n...\n(Answer: The Post-it Note! Dr. Spencer Silver invented the adhesive in 1968, but it took his colleague Arthur Fry to realize its potential as a bookmark that wouldn't fall out).",

  "🌱 **Desk Yoga Minute**\n\nTime to de-stress:\n1. Sit up straight in your chair.\n2. Reach both arms towards the ceiling and stretch.\n3. Gently twist your torso to the right, holding the back of your chair.\n4. Breathe deeply for 10 seconds.\n5. Repeat on the left side.\n\nYour spine will thank you! 🧘‍♀️",

  "💡 **Pro-Tip: The '2-Minute Rule'**\n\nFeeling overwhelmed by a massive to-do list?\nIf a task takes less than 2 minutes to complete (like answering a quick email or organizing a folder), do it immediately.\n\nIt clears your mind and gives you a quick dopamine hit of accomplishment. Try knocking out three 2-minute tasks right now! ✅"
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
