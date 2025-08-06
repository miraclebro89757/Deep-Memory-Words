import axios from 'axios'
import type { StoryRequest, StoryResponse, ApiConfig, WordExplanation } from '../types'

class AliyunApiService {
  private config: ApiConfig | null = null

  setConfig(config: ApiConfig) {
    this.config = config
  }

  getConfig(): ApiConfig | null {
    return this.config
  }

  // 获取代理端点
  private getProxyEndpoint(): string {
    if (!this.config) {
      throw new Error('API配置未设置')
    }

    // 根据模型类型选择代理端点
    if (this.config.model === 'bailian-v1') {
      return '/api/bailian'
    } else if (this.config.model.startsWith('qwen-')) {
      // 通义千问模型使用兼容模式
      return '/api/qwen-compatible/chat/completions'
    } else {
      return '/api/aliyun'
    }
  }

  async generateStory(request: StoryRequest): Promise<StoryResponse> {
    if (!this.config) {
      throw new Error('API配置未设置')
    }

    try {
      const prompt = this.buildPrompt(request)
      const proxyEndpoint = this.getProxyEndpoint()
      
      console.log('使用代理端点:', proxyEndpoint)
      console.log('请求配置:', {
        model: this.config.model,
        endpoint: proxyEndpoint,
        apiKey: this.config.apiKey ? `${this.config.apiKey.substring(0, 10)}...` : '未设置'
      })

      // 使用代理端点发送请求
      const requestBody = this.config.model === 'bailian-v1' 
        ? {
            // 百炼大模型的请求格式
            model: this.config.model,
            prompt: prompt,
            temperature: 0.7,
            top_p: 0.8,
            max_tokens: 2000
          }
        : this.config.model.startsWith('qwen-')
        ? {
            // 通义千问兼容模式的请求格式
            model: this.config.model,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 2000
          }
        : {
            // 通义千问的请求格式
            model: this.config.model,
            input: {
              messages: [
                {
                  role: 'user',
                  content: prompt
                }
              ]
            },
            parameters: {
              temperature: 0.7,
              top_p: 0.8,
              max_tokens: 2000
            }
          }

      const response = await axios.post(
        proxyEndpoint,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30秒超时
        }
      )

      console.log('API响应:', response.data)

      // 首先检查是否是错误响应
      if (response.data.Success === false || response.data.Code) {
        console.error('API返回错误:', response.data)
        const errorMessage = response.data.Message || 'API调用失败'
        throw new Error(errorMessage)
      }

      // 处理百炼大模型的响应格式
      let content = ''
      if (this.config.model === 'bailian-v1') {
        // 百炼大模型的响应格式
        if (response.data.output && response.data.output.text) {
          content = response.data.output.text
        } else if (response.data.data && response.data.data.text) {
          content = response.data.data.text
        } else if (response.data.text) {
          content = response.data.text
        } else if (response.data.response) {
          content = response.data.response
        } else {
          console.error('无法解析百炼大模型响应:', response.data)
          throw new Error('百炼大模型响应格式错误')
        }
      } else if (this.config.model.startsWith('qwen-')) {
        // 通义千问兼容模式的响应格式
        if (response.data.choices && response.data.choices[0]) {
          content = response.data.choices[0].message?.content || ''
        } else if (response.data.output && response.data.output.text) {
          content = response.data.output.text
        } else {
          console.error('无法解析通义千问兼容模式响应:', response.data)
          throw new Error('通义千问兼容模式响应格式错误')
        }
      } else {
        // 通义千问的响应格式
        if (response.data.output && response.data.output.text) {
          content = response.data.output.text
        } else if (response.data.output && response.data.output.choices && response.data.output.choices[0]) {
          content = response.data.output.choices[0].message?.content || ''
        } else if (response.data.choices && response.data.choices[0]) {
          content = response.data.choices[0].message?.content || ''
        } else {
          console.error('无法解析通义千问响应:', response.data)
          throw new Error('通义千问响应格式错误')
        }
      }
      
      if (!content) {
        throw new Error('API返回内容为空')
      }

      // 解析故事内容和解释
      const { storyContent, explanations } = this.parseStoryAndExplanations(content.trim())

      return {
        content: storyContent,
        success: true,
        explanations
      }
    } catch (error) {
      console.error('API调用失败:', error)
      
      // 提供更详细的错误信息
      let errorMessage = '未知错误'
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // 服务器返回错误状态码
          const status = error.response.status
          const data = error.response.data
          console.error('API错误响应:', { status, data })
          
          switch (status) {
            case 401:
              errorMessage = 'API密钥无效或已过期'
              break
            case 403:
              errorMessage = 'API密钥权限不足'
              break
            case 429:
              errorMessage = 'API调用频率超限'
              break
            case 500:
              errorMessage = '服务器内部错误'
              break
            default:
              errorMessage = `API错误 (${status}): ${data?.message || data?.error || '未知错误'}`
          }
        } else if (error.request) {
          // 网络错误
          errorMessage = '网络连接失败，请检查网络设置'
        } else {
          // 其他错误
          errorMessage = error.message
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      return {
        content: '',
        success: false,
        error: errorMessage
      }
    }
  }

  private buildPrompt(request: StoryRequest): string {
    const styleMap = {
      humorous: '幽默',
      fantasy: '奇幻',
      adventure: '冒险',
      educational: '教育',
      mystery: '悬疑',
      romance: '浪漫'
    }

    const lengthMap = {
      short: '简短',
      medium: '中等',
      long: '详细'
    }

    const language = request.language === 'zh' ? '中文' : '英文'
    const style = styleMap[request.style as keyof typeof styleMap] || '幽默'
    const length = lengthMap[request.length as keyof typeof lengthMap] || '中等'

    // 提取英文单词
    const englishWords = request.content.split('\n').filter(word => 
      /^[a-zA-Z\s]+$/.test(word.trim()) && word.trim().length > 0
    )

    let prompt = `请为单词/短语"${request.content}"生成一个${style}风格的${length}${language}故事，帮助记忆这个词汇。故事应该：
1. 有趣且易于记忆
2. 包含目标词汇的用法
3. 符合${style}风格
4. 长度适合${length}要求
5. 用${language}编写

请直接输出故事内容，不要包含任何解释或额外信息。`

    // 如果有英文单词，添加解释要求
    if (englishWords.length > 0 && request.language === 'zh') {
      prompt += `

另外，请为以下英文单词提供中文解释（包括词性、发音和中文含义）：
${englishWords.map(word => word.trim()).join(', ')}

请按以下格式提供解释：
单词1: [词性] /发音/ - 中文含义
单词2: [词性] /发音/ - 中文含义
...`
    }

    return prompt
  }

  private parseStoryAndExplanations(content: string): { storyContent: string, explanations: WordExplanation[] } {
    const lines = content.split('\n')
    const storyLines: string[] = []
    const explanations: WordExplanation[] = []
    let inExplanationSection = false

    for (const line of lines) {
      const trimmedLine = line.trim()
      
      // 检查是否进入解释部分
      if (trimmedLine.includes('单词') && trimmedLine.includes(':')) {
        inExplanationSection = true
      }
      
      if (inExplanationSection) {
        // 解析解释行
        const explanationMatch = trimmedLine.match(/^([a-zA-Z\s]+):\s*\[([^\]]+)\]\s*\/([^\/]+)\/\s*-\s*(.+)$/)
        if (explanationMatch) {
          explanations.push({
            word: explanationMatch[1].trim(),
            partOfSpeech: explanationMatch[2].trim(),
            pronunciation: explanationMatch[3].trim(),
            chineseMeaning: explanationMatch[4].trim()
          })
        }
      } else {
        // 故事内容
        if (trimmedLine && !trimmedLine.startsWith('另外，请为以下英文单词')) {
          storyLines.push(line)
        }
      }
    }

    return {
      storyContent: storyLines.join('\n').trim(),
      explanations
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.config) {
      console.error('API配置未设置')
      return false
    }

    try {
      console.log('开始测试API连接...')
      const proxyEndpoint = this.getProxyEndpoint()
      console.log('使用代理端点:', proxyEndpoint)
      console.log('配置信息:', {
        endpoint: proxyEndpoint,
        model: this.config.model,
        apiKey: this.config.apiKey ? `${this.config.apiKey.substring(0, 10)}...` : '未设置'
      })

      const testRequestBody = this.config.model === 'bailian-v1'
        ? {
            // 百炼大模型的测试请求格式
            model: this.config.model,
            prompt: '你好，这是一个连接测试。',
            temperature: 0.1,
            top_p: 0.8,
            max_tokens: 100
          }
        : this.config.model.startsWith('qwen-')
        ? {
            // 通义千问兼容模式的测试请求格式
            model: this.config.model,
            messages: [
              {
                role: 'user',
                content: '你好，这是一个连接测试。'
              }
            ],
            temperature: 0.1,
            max_tokens: 100
          }
        : {
            // 通义千问的测试请求格式
            model: this.config.model,
            input: {
              messages: [
                {
                  role: 'user',
                  content: '你好，这是一个连接测试。'
                }
              ]
            },
            parameters: {
              temperature: 0.1,
              top_p: 0.8,
              max_tokens: 100
            }
          }

      const response = await axios.post(
        proxyEndpoint,
        testRequestBody,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10秒超时
        }
      )

      console.log('连接测试成功:', response.status)
      return response.status === 200
    } catch (error) {
      console.error('连接测试失败:', error)
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('错误状态码:', error.response.status)
          console.error('错误响应:', error.response.data)
        } else if (error.request) {
          console.error('网络错误:', error.request)
        }
      }
      
      return false
    }
  }
}

export const aliyunApiService = new AliyunApiService() 