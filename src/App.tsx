import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ConfigProvider, message } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import Header from './components/Header'
import Footer from './components/Footer'
import InputForm from './components/InputForm'
import StoryDisplay from './components/StoryDisplay'
import ApiConfig from './components/ApiConfig'
import ConfigTest from './components/ConfigTest'
import ApiDebugger from './components/ApiDebugger'
import { useStoryStore } from './stores/storyStore'
import { aliyunApiService } from './services/aliyunApi'
import { storageService } from './services/storageService'

function App() {
  const { 
    stories, 
    loading, 
    error, 
    loadStories, 
    generateStory, 
    toggleFavorite, 
    clearError 
  } = useStoryStore()

  // 初始化应用
  useEffect(() => {
    // 加载本地存储的故事
    loadStories()
    
    // 加载API配置
    const apiConfig = storageService.getApiConfig()
    if (apiConfig) {
      aliyunApiService.setConfig(apiConfig)
    }
  }, [loadStories])

  // 错误处理
  useEffect(() => {
    if (error) {
      message.error(error)
      clearError()
    }
  }, [error, clearError])

  const handleGenerateStory = async (data: {
    content: string
    style: string
    language: string
    length: string
  }) => {
    await generateStory(data)
  }

  const handleToggleFavorite = (storyId: string) => {
    toggleFavorite(storyId)
  }

  const handleCopy = (content: string) => {
    message.success('故事已复制到剪贴板')
  }

  const handleShare = (story: any) => {
    if (navigator.share) {
      navigator.share({
        title: `单词记忆故事: ${story.originalText}`,
        text: story.content,
        url: window.location.href
      })
    } else {
      // 降级到复制链接
      navigator.clipboard.writeText(window.location.href)
      message.success('链接已复制到剪贴板')
    }
  }

  return (
    <ConfigProvider locale={zhCN}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    单词记忆故事生成器
                  </h1>
                  <p className="text-lg text-gray-600">
                    通过有趣的故事来记忆单词、短语和句子
                  </p>
                </div>
                <InputForm 
                  onSubmit={handleGenerateStory}
                  loading={loading}
                />
                <StoryDisplay 
                  stories={stories}
                  loading={loading}
                  onToggleFavorite={handleToggleFavorite}
                  onCopy={handleCopy}
                  onShare={handleShare}
                />
              </div>
            } />
            <Route path="/settings" element={
              <div>
                <ApiDebugger />
                <ConfigTest />
                <ApiConfig />
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </ConfigProvider>
  )
}

export default App 