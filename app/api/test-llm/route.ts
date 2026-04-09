import { NextRequest, NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm';

export async function GET() {
  try {
    const testMessages: Array<{ role: 'user' | 'system' | 'assistant'; content: string; }> = [
      {
        role: 'user',
        content: 'Hello, this is a test message. Please respond with "OK" if you receive this.'
      }
    ];

    // Test each provider
    const providers = [
      {
        name: 'Azure OpenAI',
        provider: 'azure',
        model: 'gpt-4', // Default model, can be configured
      },
      {
        name: 'OpenRouter (DeepSeek R1 FREE)',
        provider: 'openrouter',
        model: 'deepseek/deepseek-r1:free'
      },
      {
        name: 'Google Gemini',
        provider: 'gemini',
        model: 'gemini-2.0-flash'
      },
      {
        name: 'Groq (Llama3)',
        provider: 'groq',
        model: 'llama3-70b-8192'
      },
      {
        name: 'Together AI (Llama)',
        provider: 'together',
        model: 'meta-llama/Llama-3-70b-chat-hf'
      }
    ];

    const results: Record<string, string> = {};

    for (const { name, provider, model } of providers) {
      try {
        const response = await callLLM({
          provider: provider as any,
          model,
          messages: testMessages,
          temperature: 0.7,
          maxTokens: 100
        });
        results[name] = response ? 'SUCCESS' : 'FAILED (no response)';
      } catch (error) {
        results[name] = `FAILED: ${error instanceof Error ? error.message : String(error)}`;
        
        // Log detailed error for debugging
        console.error(`LLM test failed for ${name}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });
  } catch (error) {
    console.error('LLM test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}