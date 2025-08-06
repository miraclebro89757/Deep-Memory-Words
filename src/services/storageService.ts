import type { Story, ApiConfig, WordRecord, WordHistory, WordStats } from '../types'

class StorageService {
  private readonly STORIES_KEY = 'word_stories'
  private readonly FAVORITES_KEY = 'word_favorites'
  private readonly API_CONFIG_KEY = 'api_config'
  private readonly WORD_HISTORY_KEY = 'word_history'

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

  // 单词追踪相关
  private getWordHistory(): WordHistory[] {
    try {
      const data = localStorage.getItem(this.WORD_HISTORY_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('获取单词历史失败:', error)
      return []
    }
  }

  private saveWordHistory(history: WordHistory[]): void {
    try {
      localStorage.setItem(this.WORD_HISTORY_KEY, JSON.stringify(history))
    } catch (error) {
      console.error('保存单词历史失败:', error)
    }
  }

  // 记录单词搜索
  recordWordSearch(word: string, storyId?: string): void {
    const history = this.getWordHistory()
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    const now = Date.now()

    // 查找今天的记录
    let todayRecord = history.find(h => h.date === today)
    if (!todayRecord) {
      todayRecord = { date: today, words: [] }
      history.unshift(todayRecord)
    }

    // 查找是否已有这个单词的记录
    let wordRecord = todayRecord.words.find(w => w.word.toLowerCase() === word.toLowerCase())
    
    if (wordRecord) {
      // 更新现有记录
      wordRecord.searchCount += 1
      wordRecord.lastSearched = now
      if (storyId) {
        wordRecord.storyId = storyId
      }
    } else {
      // 创建新记录
      const newWordRecord: WordRecord = {
        id: Date.now().toString(),
        word: word.trim(),
        timestamp: now,
        storyId,
        searchCount: 1,
        lastSearched: now
      }
      todayRecord.words.push(newWordRecord)
    }

    this.saveWordHistory(history)
  }

  // 获取单词历史
  getWordHistoryData(): WordHistory[] {
    return this.getWordHistory()
  }

  // 获取指定日期的单词记录
  getWordsByDate(date: string): WordRecord[] {
    const history = this.getWordHistory()
    const dayRecord = history.find(h => h.date === date)
    return dayRecord ? dayRecord.words : []
  }

  // 获取所有单词记录（按日期分组）
  getAllWordRecords(): WordRecord[] {
    const history = this.getWordHistory()
    return history.flatMap(day => day.words)
  }

  // 获取单词统计信息
  getWordStats(): WordStats {
    const allWords = this.getAllWordRecords()
    const wordCounts = new Map<string, number>()
    
    allWords.forEach(record => {
      const word = record.word.toLowerCase()
      wordCounts.set(word, (wordCounts.get(word) || 0) + record.searchCount)
    })

    const mostSearchedWords = Array.from(wordCounts.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalWords: allWords.length,
      totalSearches: allWords.reduce((sum, record) => sum + record.searchCount, 0),
      uniqueWords: wordCounts.size,
      mostSearchedWords
    }
  }

  // 删除单词记录
  deleteWordRecord(wordId: string, date: string): void {
    const history = this.getWordHistory()
    const dayRecord = history.find(h => h.date === date)
    if (dayRecord) {
      dayRecord.words = dayRecord.words.filter(w => w.id !== wordId)
      // 如果当天没有单词了，删除这一天
      if (dayRecord.words.length === 0) {
        const index = history.findIndex(h => h.date === date)
        if (index !== -1) {
          history.splice(index, 1)
        }
      }
      this.saveWordHistory(history)
    }
  }

  // 清理数据
  clearAllData(): void {
    try {
      localStorage.removeItem(this.STORIES_KEY)
      localStorage.removeItem(this.FAVORITES_KEY)
      localStorage.removeItem(this.API_CONFIG_KEY)
      localStorage.removeItem(this.WORD_HISTORY_KEY)
    } catch (error) {
      console.error('清理数据失败:', error)
    }
  }

  // 导出数据
  exportData(): string {
    const data = {
      stories: this.getStories(),
      apiConfig: this.getApiConfig(),
      wordHistory: this.getWordHistoryData(),
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
      if (data.wordHistory) {
        this.saveWordHistory(data.wordHistory)
      }
      return true
    } catch (error) {
      console.error('导入数据失败:', error)
      return false
    }
  }
}

export const storageService = new StorageService() 