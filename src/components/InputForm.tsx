import React, { useState } from 'react'
import { Button, Select, Input, Space, Card } from 'antd'
import { Wand2 } from 'lucide-react'

const { TextArea } = Input
const { Option } = Select

interface InputFormProps {
  onSubmit?: (data: {
    content: string
    style: string
    language: string
    length: string
  }) => void
  loading?: boolean
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    content: '',
    style: 'humorous',
    language: 'zh',
    length: 'medium'
  })

  const handleSubmit = () => {
    if (!formData.content.trim()) {
      return
    }
    onSubmit?.(formData)
  }

  return (
    <Card className="mb-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            输入单词、短语或句子
          </label>
          <TextArea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="请输入要记忆的单词、短语或句子..."
            rows={3}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              故事风格
            </label>
            <Select
              value={formData.style}
              onChange={(value) => setFormData({ ...formData, style: value })}
              className="w-full"
            >
              <Option value="humorous">幽默</Option>
              <Option value="fantasy">奇幻</Option>
              <Option value="adventure">冒险</Option>
              <Option value="educational">教育</Option>
              <Option value="mystery">悬疑</Option>
              <Option value="romance">浪漫</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              语言
            </label>
            <Select
              value={formData.language}
              onChange={(value) => setFormData({ ...formData, language: value })}
              className="w-full"
            >
              <Option value="zh">中文</Option>
              <Option value="en">英文</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              故事长度
            </label>
            <Select
              value={formData.length}
              onChange={(value) => setFormData({ ...formData, length: value })}
              className="w-full"
            >
              <Option value="short">简短</Option>
              <Option value="medium">中等</Option>
              <Option value="long">详细</Option>
            </Select>
          </div>
        </div>

        <div className="text-center">
          <Button
            type="primary"
            size="large"
            icon={<Wand2 className="w-4 h-4" />}
            onClick={handleSubmit}
            loading={loading}
            disabled={!formData.content.trim()}
            className="btn-primary"
          >
            生成记忆故事
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default InputForm 