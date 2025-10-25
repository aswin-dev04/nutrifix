import Groq from "groq-sdk";

interface ChatParams {
  model?: string;
  messages: Array<{ role: string; content: string }>;
  response_format?: { type: string };
  temperature?: number;
  max_tokens?: number;
}

class LLMClient {
  private groq: Groq;
  
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }

  async chat(params: ChatParams) {
    try {
      const response = await this.groq.chat.completions.create({
        model: process.env.model || 'llama-3.1-8b-instant',
        messages: params.messages as any,
        temperature: Number(process.env.GROQ_TEMPERATURE) || 0.7,
        max_tokens: Number(process.env.GROQ_MAX_TOKENS) || 1000,
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
