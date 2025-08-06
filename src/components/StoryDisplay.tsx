import React from 'react'
import { Card, Empty, Spin, Tag } from 'antd'
import { BookOpen, Star, Copy, Share2, Info } from 'lucide-react'
import type { Story } from '../types'

interface StoryDisplayProps {
  stories: Story[]
  loading?: boolean
  onToggleFavorite?: (storyId: string) => void
  onCopy?: (content: string) => void
  onShare?: (story: Story) => void
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({
  stories,
  loading = false,
  onToggleFavorite,
  onCopy,
  onShare
}) => {
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    onCopy?.(content)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Spin size="large" />
        <p className="mt-4 text-gray-600">正在生成故事...</p>
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <Card>
        <Empty
          image={<BookOpen className="w-16 h-16 text-gray-400" />}
          description="还没有生成任何故事，请在上方输入内容并生成故事"
        />
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <Card key={story.id} className="story-card">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {story.originalText}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <span>风格: {story.style}</span>
                  <span>语言: {story.language === 'zh' ? '中文' : '英文'}</span>
                  <span>长度: {story.length}</span>
                  <span>{new Date(story.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onToggleFavorite?.(story.id)}
                  className={`p-2 rounded-full transition-colors ${
                    story.isFavorite
                      ? 'text-yellow-500 hover:text-yellow-600'
                      : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  <Star className={`w-5 h-5 ${story.isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => handleCopy(story.content)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onShare?.(story)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {story.content}
              </p>
            </div>
            
            {/* 单词解释部分 */}
            {story.explanations && story.explanations.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center mb-3">
                  <Info className="w-4 h-4 text-blue-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-700">单词解释</h4>
                </div>
                <div className="grid gap-2">
                  {story.explanations.map((explanation, index) => (
                    <div key={index} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-blue-800">{explanation.word}</span>
                        {explanation.partOfSpeech && (
                          <Tag color="blue">
                            {explanation.partOfSpeech}
                          </Tag>
                        )}
                      </div>
                      {explanation.pronunciation && (
                        <div className="text-sm text-gray-600 mb-1">
                          发音: /{explanation.pronunciation}/
                        </div>
                      )}
                      <div className="text-gray-800">
                        {explanation.chineseMeaning}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

export default StoryDisplay 