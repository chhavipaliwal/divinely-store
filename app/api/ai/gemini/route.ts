import { NextResponse } from 'next/server';
import {
  convertToModelMessages,
  streamText,
  UIMessage,
  generateText
} from 'ai';
import { google } from '@ai-sdk/google';
import { auth } from '@/auth';
import { NextAuthRequest } from 'next-auth';

const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';

export const maxDuration = 10;

export const POST = auth(async function POST(req: NextAuthRequest) {
  try {
    if (!req.auth?.user || req.auth?.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Check if this is a content generation request (URL only)
    if (body.url && !body.messages && !body.title && !body.description) {
      return handleContentGeneration(body);
    }

    // Check if this is a tag generation request (legacy support)
    if (body.title && body.description && body.url && !body.messages) {
      return handleTagGeneration(body);
    }

    // Handle regular chat messages
    const { messages }: { messages: UIMessage[] } = body;

    const result = streamText({
      model: google(model),
      messages: convertToModelMessages(messages)
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
});

async function handleContentGeneration({ url }: { url: string }) {
  try {
    const prompt = `You are an expert content curator and SEO specialist. Based on the provided URL, generate a compelling title, description, and relevant tags for a link.

URL: "${url}"

Please analyze the URL and generate:

1. TITLE: A compelling, SEO-friendly title (50-60 characters max)
2. DESCRIPTION: A clear, engaging description (120-160 characters max) that explains what the link is about
3. TAGS: 5-8 relevant, specific, and searchable tags

Guidelines:
- Create content that accurately represents what the URL likely contains
- Use the domain and URL structure to infer the content type and topic
- Make titles engaging and click-worthy
- Descriptions should be informative and encourage clicks
- Tags should be lowercase, hyphenated format (e.g., "web-development", "javascript-tutorials")
- Avoid generic terms like "website", "link", "online"
- Focus on actionable, searchable keywords
- Include technology, industry, or topic-specific terms when relevant

IMPORTANT: You must respond with ONLY valid JSON. No additional text, explanations, or formatting. Start your response with { and end with }.

Example response:
{"title": "React Tutorial for Beginners", "description": "Learn React fundamentals with this comprehensive tutorial covering components, state, and props.", "tags": ["react", "javascript", "web-development", "tutorial", "frontend"]}`;

    const result = await generateText({
      model: google(model),
      prompt,
      temperature: 0.3
    });

    // Parse the JSON response with better error handling
    try {
      // Clean the response text - remove any markdown formatting or extra text
      let cleanText = result.text.trim();

      // Remove markdown code blocks if present
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Find the first { and last } to extract JSON
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      }

      console.log('Cleaned AI response:', cleanText);

      const content = JSON.parse(cleanText);

      // Validate and clean the response
      const title = content.title?.trim() || '';
      const description = content.description?.trim() || '';
      const tags = Array.isArray(content.tags)
        ? content.tags
            .map((tag: string) =>
              tag
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, '-')
            )
            .filter((tag: string) => tag.length > 0 && tag !== '-')
            .slice(0, 8)
        : [];

      return NextResponse.json({
        title,
        description,
        tags
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw AI response:', result.text);

      // Fallback: try to extract content using regex patterns
      try {
        const titleMatch = result.text.match(/"title":\s*"([^"]+)"/);
        const descMatch = result.text.match(/"description":\s*"([^"]+)"/);
        const tagsMatch = result.text.match(/"tags":\s*\[([^\]]+)\]/);

        const title = titleMatch ? titleMatch[1].trim() : '';
        const description = descMatch ? descMatch[1].trim() : '';
        const tags = tagsMatch
          ? tagsMatch[1]
              .split(',')
              .map((tag: string) =>
                tag
                  .trim()
                  .replace(/^"|"$/g, '')
                  .toLowerCase()
                  .replace(/[^a-z0-9-]/g, '-')
              )
              .filter((tag: string) => tag.length > 0 && tag !== '-')
              .slice(0, 8)
          : [];

        return NextResponse.json({
          title,
          description,
          tags
        });
      } catch (fallbackError) {
        console.error('Fallback parsing also failed:', fallbackError);
        return NextResponse.json(
          { error: 'Failed to parse AI response. Please try again.' },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

async function handleTagGeneration({
  title,
  description,
  url
}: {
  title: string;
  description: string;
  url: string;
}) {
  try {
    const prompt = `You are an expert content curator and SEO specialist. Based on the provided information, generate 5-8 relevant, specific, and searchable tags for a link.

Title: "${title}"
Description: "${description}"
URL: "${url}"

Guidelines for tag generation:
1. Create tags that are specific and descriptive
2. Include both broad and niche categories
3. Consider the target audience and use case
4. Use lowercase, hyphenated format (e.g., "web-development", "javascript-tutorials")
5. Avoid generic terms like "website", "link", "online"
6. Focus on actionable, searchable keywords
7. Include technology, industry, or topic-specific terms when relevant
8. Consider the domain and URL structure for context
9. Also search through the website to get the content and add them to tags for example if a component library has input component add "input" to tags


Return ONLY a comma-separated list of tags, no additional text or formatting. Example: "react-tutorial,frontend-development,javascript,web-development,programming-guide"`;

    const result = await generateText({
      model: google(model),
      prompt,
      temperature: 0.3
    });

    // Clean and parse the response
    const tags = result.text
      .trim()
      .split(',')
      .map((tag) =>
        tag
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
      )
      .filter((tag) => tag.length > 0 && tag !== '-')
      .slice(0, 8); // Limit to 8 tags max

    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Tag generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate tags' },
      { status: 500 }
    );
  }
}
