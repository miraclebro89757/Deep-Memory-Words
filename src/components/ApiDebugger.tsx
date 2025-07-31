import React, { useState } from 'react'
import { Card, Button, message, Input, Space, Typography } from 'antd'
import { Bug, Eye, EyeOff } from 'lucide-react'
import { aliyunApiService } from '../services/aliyunApi'
import { storageService } from '../services/storageService'

const { TextArea } = Input
const { Text } = Typography

const ApiDebugger: React.FC = () => {
  const [showApiKey, setShowApiKey] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const checkConfig = () => {
    const config = storageService.getApiConfig()
    if (!config) {
      setDebugInfo('❌ 未找到API配置')
      return
    }

    let info = '📋 当前配置信息:\n'
    info += `🔑 API密钥: ${config.apiKey ? `${config.apiKey.substring(0, 10)}...` : '未设置'}\n`
    info += `🌐 端点: ${config.endpoint}\n`
    info += `🤖 模型: ${config.model}\n`
    info += `🔧 代理: ${config.enableProxy ? '启用' : '禁用'}\n\n`

    // 验证配置
    if (!config.apiKey) {
      info += '❌ API密钥未设置\n'
    } else if (!config.apiKey.startsWith('sk-')) {
      info += '❌ API密钥格式不正确（应以sk-开头）\n'
    } else {
      info += '✅ API密钥格式正确\n'
    }

    if (!config.endpoint) {
      info += '❌ 端点地址未设置\n'
    } else {
      info += '✅ 端点地址已设置\n'
    }

    if (!config.model) {
      info += '❌ 模型未选择\n'
    } else {
      info += '✅ 模型已选择\n'
    }

    setDebugInfo(info)
  }

  const testApiConnection = async () => {
    setLoading(true)
    const config = storageService.getApiConfig()
    
    if (!config || !config.apiKey) {
      message.error('请先配置API密钥')
      setLoading(false)
      return
    }

    try {
      aliyunApiService.setConfig(config)
      const isConnected = await aliyunApiService.testConnection()
      
      if (isConnected) {
        message.success('✅ API连接测试成功！')
        setDebugInfo(prev => prev + '\n✅ API连接测试成功！')
      } else {
        message.error('❌ API连接测试失败')
        setDebugInfo(prev => prev + '\n❌ API连接测试失败')
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '未知错误'
      message.error(`❌ 测试失败: ${errorMsg}`)
      setDebugInfo(prev => prev + `\n❌ 测试失败: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const showFullApiKey = () => {
    const config = storageService.getApiConfig()
    if (config && config.apiKey) {
      setDebugInfo(prev => prev + `\n🔑 完整API密钥: ${config.apiKey}`)
    } else {
      setDebugInfo(prev => prev + '\n❌ 未找到API密钥')
    }
  }

  const clearDebugInfo = () => {
    setDebugInfo('')
  }

  return (
    <Card 
      title={
        <div className="flex items-center">
          <Bug className="w-5 h-5 mr-2 text-orange-600" />
          <span>API调试工具</span>
        </div>
      }
      className="mb-6"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={checkConfig} type="primary">
            检查配置
          </Button>
          <Button onClick={testApiConnection} loading={loading}>
            测试连接
          </Button>
          <Button 
            onClick={showFullApiKey}
            icon={showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          >
            显示完整密钥
          </Button>
          <Button onClick={clearDebugInfo} danger>
            清空信息
          </Button>
        </div>

        {debugInfo && (
          <div className="mt-4">
            <Text strong>调试信息:</Text>
            <TextArea
              value={debugInfo}
              rows={8}
              readOnly
              className="mt-2 font-mono text-sm"
              style={{ backgroundColor: '#f5f5f5' }}
            />
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <Text strong className="text-blue-800">调试说明:</Text>
          <ul className="mt-2 text-blue-700 text-sm space-y-1">
            <li>• 点击"检查配置"查看当前配置状态</li>
            <li>• 点击"测试连接"验证API是否可用</li>
            <li>• 点击"显示完整密钥"查看完整的API密钥</li>
            <li>• 查看浏览器控制台获取更详细的错误信息</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}

export default ApiDebugger 