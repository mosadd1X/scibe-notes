import { NextRequest, NextResponse } from 'next/server'

// Get the API key from environment variables
const API_KEY =
  process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

// Check if API key is available
if (!API_KEY) {
  console.error('GEMINI_API_KEY is not defined in environment variables')
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!API_KEY) {
      return NextResponse.json(
        {
          error:
            'API key is not configured. Please set GEMINI_API_KEY in environment variables.',
        },
        { status: 500 }
      )
    }

    // Validate request body
    const body = await request.json().catch(() => ({}))
    const { prompt, action, context } = body

    // Validate required parameters
    if (!context || typeof context !== 'string' || context.trim().length < 5) {
      return NextResponse.json(
        { error: 'Invalid or missing context. Please provide more content.' },
        { status: 400 }
      )
    }

    let fullPrompt = prompt || ''

    // Customize the prompt based on the action
    if (action === 'summarize' && context) {
      fullPrompt = `Please provide a comprehensive yet concise summary of the following text. Highlight the key points, main arguments, and important conclusions. Ensure the summary captures the essence of the content while being easy to understand.

IMPORTANT: DO NOT include a title or heading at the beginning of your summary. Start directly with the summary content.

${context}

Your summary should:
- Identify the main topic and purpose
- Include all critical information
- Be well-structured and logically organized
- Use clear and concise language
- NOT include a title or heading at the beginning`
    } else if (action === 'suggestions' && context) {
      fullPrompt = `Based on the following note content, provide thoughtful suggestions on how to continue or expand it. Consider potential directions, additional topics, supporting evidence, or perspectives that would enhance the content.

IMPORTANT: DO NOT add a title or heading at the beginning of your suggestions. Start directly with the suggestions content.

${context}

Your suggestions should:
- DO NOT include a title or heading at the beginning
- Be relevant to the existing content
- Offer specific ideas for expansion
- Provide logical next steps
- Include at least 3-5 detailed suggestions
- Format as a list of suggestions, not as a titled document`
    } else if (action === 'question' && context) {
      fullPrompt = `Using only the information contained in the following note, provide a comprehensive answer to this question: "${prompt}"

Note content:
${context}

Your answer should:
- Be based solely on information in the note
- Be thorough and accurate
- Include relevant details from the note
- Be well-structured and easy to understand`
    } else if (action === 'improve' && context) {
      fullPrompt = `Improve the writing style, clarity, and overall quality of the following text while preserving its original meaning and key points. Enhance the flow, fix any grammatical issues, and make the language more engaging.

IMPORTANT: DO NOT add a title or heading at the beginning of your improved text. Start directly with the improved content.

${context}

Your improved version should:
- DO NOT add a title or heading at the beginning
- Maintain the same core message and information
- Have better sentence structure and flow
- Use more precise and engaging language
- Be well-organized with clear transitions
- Start directly with the content, not with a title`
    } else if (action === 'outline' && context) {
      fullPrompt = `Generate a detailed, hierarchical outline for the following content. Create a logical structure with main headings, subheadings, and key points that effectively organize the information.

IMPORTANT: DO NOT include a title or main heading at the beginning of your outline. Start directly with the outline content.

${context}

Your outline should:
- DO NOT include a title or main heading at the beginning
- Have a clear hierarchical structure (main points and sub-points)
- Include all important topics from the original content
- Use descriptive headings that capture the essence of each section
- Be comprehensive yet concise
- Start with section headings, not with a document title`
    } else if (action === 'format' && context) {
      fullPrompt = `Convert the following text into well-formatted markdown with proper formatting elements. Improve the structure and readability while preserving all original content.

IMPORTANT: DO NOT add any title or main heading at the beginning of the formatted text. The note already has a title field, so do not create a title in the content.

${context}

Your formatted markdown should:
- DO NOT add a title or main heading (# Heading) at the beginning
- Use appropriate heading levels (## for main sections, ### for subsections, etc.) but start with ## not #
- Implement bullet or numbered lists where appropriate
- Add emphasis (bold, italic) for important points
- Include proper formatting for quotes, code blocks, or other special elements
- Maintain all original content while improving its presentation
- Never start with a # level heading as this creates a title`
    }

    // Use fetch to call the Gemini API directly
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
        API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.6,
            topK: 40,
            topP: 0.9,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API error:', errorData)
      throw new Error(errorData.error?.message || 'Failed to generate content')
    }

    const data = await response.json()

    // Check if we have valid response data
    if (!data.candidates || data.candidates.length === 0) {
      console.error('Empty response from Gemini API:', data)
      throw new Error(
        'No content generated. Please try again with different input.'
      )
    }

    // Check for content blocks
    if (data.promptFeedback && data.promptFeedback.blockReason) {
      console.error('Content blocked by Gemini API:', data.promptFeedback)
      throw new Error(`Content was blocked: ${data.promptFeedback.blockReason}`)
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Verify we have actual text content
    if (!text.trim()) {
      console.error('Empty text from Gemini API:', data)
      throw new Error('Generated content was empty. Please try again.')
    }

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Error generating content with Gemini:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
