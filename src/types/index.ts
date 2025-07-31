export interface Story {
  id: string
  content: string
  originalText: string
  style: string
  language: string
  length: string
  timestamp: number
  isFavorite: boolean
}

export interface ApiConfig {
  apiKey: string
  endpoint: string
  model: string
  enableProxy: boolean
}

export interface StoryRequest {
  content: string
  style: string
  language: string
  length: string
}

export interface StoryResponse {
  content: string
  success: boolean
  error?: string
}

export type StoryStyle = 'humorous' | 'fantasy' | 'adventure' | 'educational' | 'mystery' | 'romance'
export type Language = 'zh' | 'en'
export type StoryLength = 'short' | 'medium' | 'long'
export type ModelType = 'bailian-v1' | 'qwen-turbo' | 'qwen-plus' | 'qwen-max' 