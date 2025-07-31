import { create } from 'zustand'
import type { Story, StoryRequest } from '../types'
import { aliyunApiService } from '../services/aliyunApi'
import { storageService } from '../services/storageService'

interface StoryStore {
  stories: Story[]
  loading: boolean
  error: string | null
  
  // Actions
  loadStories: () => void
  generateStory: (request: StoryRequest) => Promise<void>
  toggleFavorite: (storyId: string) => void
  deleteStory: (storyId: string) => void
  clearError: () => void
}

export const useStoryStore = create<StoryStore>((set, get) => ({
  stories: [],
  loading: false,
  error: null,

  loadStories: () => {
    const stories = storageService.getStories()
    set({ stories })
  },

  generateStory: async (request: StoryRequest) => {
    set({ loading: true, error: null })

    try {
      // 检查API配置
      const config = aliyunApiService.getConfig()
      if (!config) {
        throw new Error('请先配置API密钥')
      }

      // 调用API生成故事
      const response = await aliyunApiService.generateStory(request)
      
      if (!response.success) {
        throw new Error(response.error || '生成故事失败')
      }

      // 创建新故事对象
      const newStory: Story = {
        id: Date.now().toString(),
        content: response.content,
        originalText: request.content,
        style: request.style,
        language: request.language,
        length: request.length,
        timestamp: Date.now(),
        isFavorite: false
      }

      // 保存到本地存储
      storageService.addStory(newStory)

      // 更新状态
      const stories = storageService.getStories()
      set({ stories, loading: false })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '生成故事失败'
      set({ error: errorMessage, loading: false })
    }
  },

  toggleFavorite: (storyId: string) => {
    storageService.toggleFavorite(storyId)
    const stories = storageService.getStories()
    set({ stories })
  },

  deleteStory: (storyId: string) => {
    storageService.deleteStory(storyId)
    const stories = storageService.getStories()
    set({ stories })
  },

  clearError: () => {
    set({ error: null })
  }
})) 