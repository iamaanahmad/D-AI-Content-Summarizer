import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available in the environment variables
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export type SummaryFormat = 'standard' | 'bullet_points' | 'eli5';
export type InputType = 'text' | 'url';


/**
 * Generates a concise summary of the provided text using the Gemini API.
 * @param content The text or HTML content to be summarized.
 * @param format The desired format for the summary.
 * @param inputType The type of content provided ('text' or 'url').
 * @returns A promise that resolves to the summarized text string.
 */
export const summarizeText = async (content: string, format: SummaryFormat, inputType: InputType): Promise<string> => {
  
  let formatInstruction = '';
  switch (format) {
    case 'bullet_points':
      formatInstruction = 'Summarize the key points as a concise, bulleted list. Each bullet point should be clear and to the point.';
      break;
    case 'eli5':
      formatInstruction = 'Summarize the text in a very simple way, as if you were explaining it to a 5-year-old child. Use simple words and short sentences.';
      break;
    case 'standard':
    default:
      formatInstruction = 'Summarize the text for a general audience. Provide a concise and easy-to-understand summary. Focus on the key points and main arguments. The summary should be a few paragraphs long.';
      break;
  }

  const contentPreamble = inputType === 'url' 
    ? 'The following is the full raw HTML content of a webpage. Your task is to first identify the main article or content within this HTML, ignoring any irrelevant parts like navigation bars, sidebars, ads, and footers. Once you have identified the core content, perform the following instruction on it:'
    : 'Please perform the following instruction on the text provided:';
  
  const prompt = `
    ${contentPreamble}

    Instruction: "${formatInstruction}"

    ---
    CONTENT:
    ${content}
    ---

    SUMMARY:
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
    });
    
    // The .text property is the simplest way to get the string output
    return response.text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while communicating with the Gemini API.");
  }
};
