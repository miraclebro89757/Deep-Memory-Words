import type { Story, ApiConfig } from '../types'

class StorageService {
  private readonly STORIES_KEY = 'word_stories'
  private readonly FAVORITES_KEY = 'word_favorites'
  private readonly API_CONFIG_KEY = 'api_config'

  // 故事相关
  saveStories(stories: Story[]): void {
    try {
      localStorage.setItem(this.STORIES_KEY, JSON.stringify(stories))
    } catch (error) {
      console.error('保存故事失败:', error)
    }
  }

  getStories(): Story[] {
    try {
      const data = localStorage.getItem(this.STORIES_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('获取故事失败:', error)
      return []
    }
  }

  addStory(story: Story): void {
    const stories = this.getStories()
    stories.unshift(story)
    this.saveStories(stories)
  }

  updateStory(updatedStory: Story): void {
    const stories = this.getStories()
    const index = stories.findIndex(story => story.id === updatedStory.id)
    if (index !== -1) {
      stories[index] = updatedStory
      this.saveStories(stories)
    }
  }

  deleteStory(storyId: string): void {
    const stories = this.getStories()
    const filteredStories = stories.filter(story => story.id !== storyId)
    this.saveStories(filteredStories)
  }

  // 收藏相关
  toggleFavorite(storyId: string): void {
    const stories = this.getStories()
    const story = stories.find(s => s.id === storyId)
    if (story) {
      story.isFavorite = !story.isFavorite
      this.saveStories(stories)
    }
  }

  getFavorites(): Story[] {
    return this.getStories().filter(story => story.isFavorite)
  }

  // API配置相关
  saveApiConfig(config: ApiConfig): void {
    try {
      localStorage.setItem(this.API_CONFIG_KEY, JSON.stringify(config))
    } catch (error) {
      console.error('保存API配置失败:', error)
    }
  }

  getApiConfig(): ApiConfig | null {
    try {
      const data = localStorage.getItem(this.API_CONFIG_KEY)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('获取API配置失败:', error)
      return null
    }
  }

  // 清理数据
  clearAllData(): void {
    try {
      localStorage.removeItem(this.STORIES_KEY)
      localStorage.removeItem(this.FAVORITES_KEY)
      localStorage.removeItem(this.API_CONFIG_KEY)
    } catch (error) {
      console.error('清理数据失败:', error)
    }
  }

  // 导出数据
  exportData(): string {
    const data = {
      stories: this.getStories(),
      apiConfig: this.getApiConfig(),
      exportTime: new Date().toISOString()
    }
    return JSON.stringify(data, null, 2)
  }

  // 导入数据
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      if (data.stories) {
        this.saveStories(data.stories)
      }
      if (data.apiConfig) {
        this.saveApiConfig(data.apiConfig)
      }
      return true
    } catch (error) {
      console.error('导入数据失败:', error)
      return false
    }
  }
}

export const storageService = new StorageService() 