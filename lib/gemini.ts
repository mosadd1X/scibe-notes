// We're not using this file anymore as we're handling API calls directly in the route handler
// This file is kept for reference only

// Initialize the Google GenAI client with your API key
const API_KEY =
  process.env.GEMINI_API_KEY || 'AIzaSyAF79zhWzJKQOVccmBrxB8J4kiM63AOi68'

export interface GeminiResponse {
  text: string
  error?: string
}

/**
 * Generate content using Gemini AI
 * @param prompt The prompt to send to Gemini
 * @returns The generated content
 */
export async function generateContent(prompt: string): Promise<GeminiResponse> {
  try {
    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ parts: [{ text: prompt }] }],
    })

    return { text: result.text }
  } catch (error) {
    console.error('Error generating content with Gemini:', error)
    return {
      text: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Summarize text using Gemini AI
 * @param text The text to summarize
 * @returns The summarized text
 */
export async function summarizeText(text: string): Promise<GeminiResponse> {
  const prompt = `Please summarize the following text in a concise way, highlighting the key points:

  ${text}`

  return generateContent(prompt)
}

/**
 * Generate suggestions for note content
 * @param context The current note content to provide context
 * @returns Suggestions for continuing the note
 */
export async function generateSuggestions(
  context: string
): Promise<GeminiResponse> {
  const prompt = `Based on the following note content, suggest how to continue or expand on it:

  ${context}`

  return generateContent(prompt)
}

/**
 * Answer a question based on note content
 * @param question The question to answer
 * @param noteContent The note content to use as context
 * @returns The answer to the question
 */
export async function answerQuestion(
  question: string,
  noteContent: string
): Promise<GeminiResponse> {
  const prompt = `Using only the information in the following note, answer this question: "${question}"

  Note content:
  ${noteContent}`

  return generateContent(prompt)
}
