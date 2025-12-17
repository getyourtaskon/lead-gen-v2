import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

interface GenerateRequest {
  template: string;
  personalizationFields: Array<{
    id: string;
    column: string;
    placeholder: string;
  }>;
  data: Record<string, unknown>[];
  useAI: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    if (!body.template) {
      return NextResponse.json(
        { error: 'Template is required' },
        { status: 400 }
      );
    }

    if (!body.data || body.data.length === 0) {
      return NextResponse.json(
        { error: 'Data is required' },
        { status: 400 }
      );
    }

    const generatedMessages: Array<{ original: string; enhanced?: string; row: Record<string, unknown> }> = [];

    // Generate personalized messages
    for (const row of body.data) {
      let personalized = body.template;

      // Replace all placeholders with actual data
      body.personalizationFields.forEach((field) => {
        const value = String(row[field.column] ?? '');
        personalized = personalized.replace(field.placeholder, value);
      });

      if (body.useAI && process.env.ANTHROPIC_API_KEY) {
        // Use Claude to enhance the message
        try {
          const client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
          });

          const response = await client.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 500,
            messages: [
              {
                role: 'user',
                content: `You are an expert sales copywriter. Improve the following outreach message to make it more compelling, personalized, and likely to get a response. Keep it under 200 words and maintain the same tone. Do not add any placeholders or variables.\n\nMessage:\n${personalized}`,
              },
            ],
          });

          const enhanced =
            response.content[0].type === 'text' ? response.content[0].text : personalized;

          generatedMessages.push({
            original: personalized,
            enhanced,
            row,
          });
        } catch (error) {
          // If AI fails, just use the original
          generatedMessages.push({
            original: personalized,
            row,
          });
        }
      } else {
        generatedMessages.push({
          original: personalized,
          row,
        });
      }
    }

    return NextResponse.json({
      success: true,
      count: generatedMessages.length,
      messages: generatedMessages,
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate messages' },
      { status: 500 }
    );
  }
}
