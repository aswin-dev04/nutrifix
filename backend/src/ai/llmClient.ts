import OpenAI from 'openai';

interface ChatParams {
  model?: string;
  messages: Array<{ role: string; content: string }>;
  response_format?: { type: string };
  temperature?: number;
  max_tokens?: number;
}

class LLMClient {
  private openai: OpenAI;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async chat(params: ChatParams) {
    try {
      const response = await this.openai.chat.completions.create({
        model: params.model || process.env.AI_MODEL || 'gpt-4o-mini',
        messages: params.messages,
        response_format: params.response_format,
        temperature: params.temperature || parseFloat(process.env.AI_TEMPERATURE || '0.7'),
        max_tokens: params.max_tokens || parseInt(process.env.AI_MAX_TOKENS || '1000')
      });

      return {
        content: response.choices[0].message.content || '',
        usage: response.usage
      };
    } catch (error) {
      console.error('LLM API Error:', error);
      throw new Error('Failed to get AI response');
    }
  }
}

export const llmClient = new LLMClient();
