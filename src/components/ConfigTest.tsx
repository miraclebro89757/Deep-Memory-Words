import React from 'react'
import { Card, Button, message } from 'antd'
import { aliyunApiService } from '../services/aliyunApi'
import { storageService } from '../services/storageService'

const ConfigTest: React.FC = () => {
  const testCurrentConfig = async () => {
    const config = storageService.getApiConfig()
    if (!config || !config.apiKey) {
      message.error('请先配置API密钥')
      return
    }

    try {
      aliyunApiService.setConfig(config)
      const isConnected = await aliyunApiService.testConnection()
      
      if (isConnected) {
        message.success('当前配置测试成功！')
      } else {
        message.error('当前配置测试失败，请检查API密钥')
      }
    } catch (error) {
      message.error('测试失败：' + (error instanceof Error ? error.message : '未知错误'))
    }
  }

  const showCurrentConfig = () => {
    const config = storageService.getApiConfig()
    if (config) {
      message.info(`当前配置：模型=${config.model}, 端点=${config.endpoint}`)
    } else {
      message.info('未找到配置信息')
    }
  }

  return (
    <Card title="配置测试" className="mb-4">
      <div className="space-x-4">
        <Button onClick={testCurrentConfig} type="primary">
          测试当前配置
        </Button>
        <Button onClick={showCurrentConfig}>
          查看当前配置
        </Button>
      </div>
    </Card>
  )
}

export default ConfigTest 