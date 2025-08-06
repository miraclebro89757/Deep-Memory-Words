// Test file for word tracking functionality
// This simulates the word tracking features

// Mock localStorage for testing
const mockLocalStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null
  },
  setItem(key, value) {
    this.data[key] = value
  },
  removeItem(key) {
    delete this.data[key]
  }
}

// Mock the storage service
class MockStorageService {
  constructor() {
    this.WORD_HISTORY_KEY = 'word_history'
    this.localStorage = mockLocalStorage
  }

  getWordHistory() {
    try {
      const data = this.localStorage.getItem(this.WORD_HISTORY_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('获取单词历史失败:', error)
      return []
    }
  }

  saveWordHistory(history) {
    try {
      this.localStorage.setItem(this.WORD_HISTORY_KEY, JSON.stringify(history))
    } catch (error) {
      console.error('保存单词历史失败:', error)
    }
  }

  recordWordSearch(word, storyId) {
    const history = this.getWordHistory()
    const today = new Date().toISOString().split('T')[0]
    const now = Date.now()

    let todayRecord = history.find(h => h.date === today)
    if (!todayRecord) {
      todayRecord = { date: today, words: [] }
      history.unshift(todayRecord)
    }

    let wordRecord = todayRecord.words.find(w => w.word.toLowerCase() === word.toLowerCase())
    
    if (wordRecord) {
      wordRecord.searchCount += 1
      wordRecord.lastSearched = now
      if (storyId) {
        wordRecord.storyId = storyId
      }
    } else {
      const newWordRecord = {
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

  getWordStats() {
    const allWords = this.getAllWordRecords()
    const wordCounts = new Map()
    
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

  getAllWordRecords() {
    const history = this.getWordHistory()
    return history.flatMap(day => day.words)
  }
}

// Test the functionality
const storageService = new MockStorageService()

console.log('🧪 Testing Word Tracking Functionality...\n')

// Test 1: Record some words
console.log('📝 Recording words...')
storageService.recordWordSearch('hello', 'story1')
storageService.recordWordSearch('world', 'story2')
storageService.recordWordSearch('hello', 'story3') // Duplicate word
storageService.recordWordSearch('test', null) // Word without story

// Test 2: Check word history
console.log('\n📊 Word History:')
const history = storageService.getWordHistory()
console.log(JSON.stringify(history, null, 2))

// Test 3: Check statistics
console.log('\n📈 Word Statistics:')
const stats = storageService.getWordStats()
console.log(JSON.stringify(stats, null, 2))

// Test 4: Verify data structure
console.log('\n✅ Verification:')
console.log(`- Total words recorded: ${stats.totalWords}`)
console.log(`- Total searches: ${stats.totalSearches}`)
console.log(`- Unique words: ${stats.uniqueWords}`)
console.log(`- Most searched word: ${stats.mostSearchedWords[0]?.word || 'N/A'} (${stats.mostSearchedWords[0]?.count || 0} times)`)

console.log('\n🎉 Word tracking functionality test completed!') 