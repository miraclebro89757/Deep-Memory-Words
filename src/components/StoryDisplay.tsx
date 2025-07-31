import React from 'react'
import { Card, Empty, Spin } from 'antd'
import { BookOpen, Star, Copy, Share2 } from 'lucide-react'

interface Story {
  id: string
  content: string
  originalText: string
  style: string
  language: string
  length: string
  timestamp: number
  isFavorite: boolean
}

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
          </div>
        </Card>
      ))}
    </div>
  )
}

export default StoryDisplay 