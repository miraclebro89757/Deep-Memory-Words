import React, { useState, useEffect } from 'react'
import { Card, Form, Input, Button, message, Switch, Alert, Divider, Select, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { ArrowLeft, Key, Server, TestTube, Save, Eye, EyeOff, Globe, Info } from 'lucide-react'
import { aliyunApiService } from '../services/aliyunApi'
import { storageService } from '../services/storageService'
import type { ApiConfig } from '../types'

const { TextArea } = Input

interface ApiConfigData {
  apiKey: string
  endpoint: string
  model: string
  enableProxy: boolean
}

const ApiConfig: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [currentConfig, setCurrentConfig] = useState<ApiConfig | null>(null)

  // 加载已保存的配置
  useEffect(() => {
    const savedConfig = storageService.getApiConfig()
    if (savedConfig) {
      setCurrentConfig(savedConfig)
      form.setFieldsValue({
        apiKey: savedConfig.apiKey,
        endpoint: savedConfig.endpoint,
        model: savedConfig.model,
        enableProxy: savedConfig.enableProxy
      })
    }
  }, [form])

  const handleSubmit = async (values: ApiConfigData) => {
    setLoading(true)
    try {
      // 保存配置到本地存储
      const config: ApiConfig = {
        apiKey: values.apiKey,
        endpoint: values.endpoint,
        model: values.model,
        enableProxy: values.enableProxy
      }
      
      storageService.saveApiConfig(config)
      aliyunApiService.setConfig(config)
      setCurrentConfig(config)
      
      message.success('配置保存成功！')
    } catch (error) {
      message.error('配置保存失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }

  const handleTestConnection = async () => {
    const values = await form.validateFields()
    setTesting(true)
    
    try {
      // 临时设置配置进行测试
      const testConfig: ApiConfig = {
        apiKey: values.apiKey,
        endpoint: values.endpoint,
        model: values.model,
        enableProxy: values.enableProxy
      }
      
      aliyunApiService.setConfig(testConfig)
      
      // 测试API连接
      const isConnected = await aliyunApiService.testConnection()
      
      if (isConnected) {
        message.success('连接测试成功！API配置正确')
      } else {
        message.error('连接测试失败，请检查API密钥和配置')
      }
    } catch (error) {
      console.error('测试连接失败:', error)
      message.error('连接测试失败，请检查配置和网络连接')
    } finally {
      setTesting(false)
    }
  }

  const handleClearConfig = () => {
    storageService.saveApiConfig({
      apiKey: '',
      endpoint: 'https://bailian.aliyuncs.com/v2/api/invoke',
      model: 'bailian-v1',
      enableProxy: false
    })
    form.resetFields()
    setCurrentConfig(null)
    message.success('配置已清空')
  }

  const getModelDescription = (model: string) => {
    const descriptions = {
      'bailian-v1': '百炼大模型，阿里云企业级大语言模型',
      'qwen-turbo': '快速响应，适合对话和简单任务',
      'qwen-plus': '平衡性能和效果，适合一般应用',
      'qwen-max': '最高质量，适合复杂任务和创意写作'
    }
    return descriptions[model as keyof typeof descriptions] || ''
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="flex items-center text-gray-600 hover:text-primary-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首页
        </Link>
      </div>

      {currentConfig && (
        <Alert
          message="当前配置状态"
          description={`已配置API密钥，模型：${currentConfig.model}，端点：${currentConfig.endpoint}`}
          type="info"
          showIcon
          className="mb-6"
        />
      )}

      <Card 
        title={
          <div className="flex items-center">
            <Key className="w-5 h-5 mr-2 text-primary-600" />
            <span>阿里云API配置</span>
          </div>
        } 
        className="mb-6"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            model: 'bailian-v1',
            endpoint: 'https://bailian.aliyuncs.com/v2/api/invoke',
            enableProxy: false
          }}
        >
          <Form.Item
            label={
              <div className="flex items-center justify-between">
                <span>API 密钥</span>
                <Button
                  type="text"
                  size="small"
                  icon={showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? '隐藏' : '显示'}
                </Button>
              </div>
            }
            name="apiKey"
            rules={[
              { required: true, message: '请输入API密钥' },
              { min: 10, message: 'API密钥长度不正确' }
            ]}
          >
            {showApiKey ? (
              <Input
                prefix={<Key className="w-4 h-4 text-gray-400" />}
                placeholder="请输入阿里云API密钥（以sk-开头）"
              />
            ) : (
              <Input.Password
                prefix={<Key className="w-4 h-4 text-gray-400" />}
                placeholder="请输入阿里云API密钥（以sk-开头）"
                visibilityToggle={false}
              />
            )}
          </Form.Item>

          <Form.Item
            label="端点地址"
            name="endpoint"
            rules={[{ required: true, message: '请输入端点地址' }]}
          >
            <Input
              prefix={<Globe className="w-4 h-4 text-gray-400" />}
              placeholder="API端点地址"
              disabled
              addonAfter={
                <Tooltip title="端点地址会根据模型类型自动选择，无需手动修改">
                  <Info className="w-4 h-4 text-gray-400" />
                </Tooltip>
              }
            />
          </Form.Item>

          <Form.Item
            label="模型选择"
            name="model"
            rules={[{ required: true, message: '请选择模型' }]}
          >
            <Select
              style={{ width: '100%' }}
              options={[
                { label: 'bailian-v1 (百炼大模型)', value: 'bailian-v1' },
                { label: 'qwen-turbo (通义千问-快速)', value: 'qwen-turbo' },
                { label: 'qwen-plus (通义千问-平衡)', value: 'qwen-plus' },
                { label: 'qwen-max (通义千问-高质量)', value: 'qwen-max' }
              ]}
              onChange={(value: string) => {
                const description = getModelDescription(value)
                if (description) {
                  message.info(`模型说明：${description}`)
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="启用代理"
            name="enableProxy"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Divider />

          <Form.Item>
            <div className="flex flex-wrap gap-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<Save className="w-4 h-4" />}
                className="btn-primary"
              >
                保存配置
              </Button>
              <Button
                onClick={handleTestConnection}
                loading={testing}
                icon={<TestTube className="w-4 h-4" />}
                className="btn-secondary"
              >
                测试连接
              </Button>
              <Button
                onClick={handleClearConfig}
                danger
                className="btn-secondary"
              >
                清空配置
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>

      <Card title="配置说明" className="mb-6">
        <div className="space-y-4 text-sm text-gray-600">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">获取百炼大模型API密钥步骤：</h4>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
              <li>登录 <a href="https://bailian.console.aliyun.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline font-medium">百炼大模型控制台</a></li>
              <li>使用阿里云主账号登录</li>
              <li>点击顶部导航栏"应用"</li>
              <li>选择左侧导航栏"API-Key"</li>
              <li>创建新的API密钥</li>
              <li>复制密钥到上方输入框</li>
              <li>点击"测试连接"验证配置</li>
              <li>保存配置后即可使用</li>
            </ol>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">模型说明：</h4>
            <ul className="space-y-1 text-yellow-700">
              <li><strong>bailian-v1：</strong>百炼大模型，阿里云企业级大语言模型</li>
              <li><strong>qwen-turbo：</strong>快速响应，适合对话和简单任务，成本较低</li>
              <li><strong>qwen-plus：</strong>平衡性能和效果，适合一般应用场景</li>
              <li><strong>qwen-max：</strong>最高质量，适合复杂任务和创意写作，成本较高</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">安全提示：</h4>
            <ul className="space-y-1 text-green-700">
              <li>API密钥仅存储在本地浏览器中，不会上传到服务器</li>
              <li>建议定期更换API密钥以保证安全</li>
              <li>不要在公共场所或不安全的设备上保存API密钥</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card title="常见问题" className="text-sm text-gray-600">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-800 mb-1">Q: 如何获取百炼大模型API密钥？</h4>
            <p className="text-gray-600">A: 登录百炼大模型控制台，点击"应用"→"API-Key"，创建新的API密钥。</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-1">Q: 测试连接失败怎么办？</h4>
            <p className="text-gray-600">A: 检查API密钥是否正确，网络连接是否正常，以及API服务是否可用。</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-1">Q: 如何选择合适的模型？</h4>
            <p className="text-gray-600">A: 根据使用场景选择：快速对话选turbo，一般应用选plus，高质量创作选max。</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ApiConfig 