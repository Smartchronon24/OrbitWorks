export interface AIRequest {
  query: string;
  context?: AIContext;
}

export interface AIResponse {
  answer: string;
  confidence?: number;
}

export interface AIProvider {
  name: string;
  generateResponse(request: AIRequest): Promise<AIResponse>;
}

export interface AIContext {
  projects: any[];
  profile: any;
  skills: any;
}