export interface Story {
  id: string
  content: string
  originalText: string
  style: string
  language: string
  length: string
  timestamp: number
  isFavorite: boolean
  explanations?: WordExplanation[]
}

export interface WordExplanation {
  word: string
  chineseMeaning: string
  pronunciation?: string
  partOfSpeech?: string
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
  explanations?: WordExplanation[]
}

// New types for word tracking
export interface WordRecord {
  id: string
  word: string
  timestamp: number
  storyId?: string // Reference to the story if generated
  searchCount: number
  lastSearched: number
}

export interface WordHistory {
  date: string // YYYY-MM-DD format
  words: WordRecord[]
}

export interface WordStats {
  totalWords: number
  totalSearches: number
  uniqueWords: number
  mostSearchedWords: Array<{ word: string; count: number }>
}

export type StoryStyle = 'humorous' | 'fantasy' | 'adventure' | 'educational' | 'mystery' | 'romance'
export type Language = 'zh' | 'en'
export type StoryLength = 'short' | 'medium' | 'long'
export type ModelType = 'bailian-v1' | 'qwen-turbo' | 'qwen-plus' | 'qwen-max' 