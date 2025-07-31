#!/usr/bin/env node

/**
 * 通义千问API测试脚本
 * 用于验证通义千问API配置是否正确
 */

import axios from 'axios'

// 配置信息 - 请替换为您的实际配置
const config = {
  apiKey: 'YOUR_QWEN_API_KEY_HERE', // 替换为您的通义千问API密钥
  model: 'qwen-turbo',
  endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'
}

async function testQwenAPI() {
  console.log('🔍 开始测试通义千问API...')
  console.log('配置信息:', {
    model: config.model,
    endpoint: config.endpoint,
    apiKey: config.apiKey ? `${config.apiKey.substring(0, 10)}...` : '未设置'
  })

  try {
    // 测试请求
    const response = await axios.post(
      config.endpoint,
      {
        model: config.model,
        input: {
          messages: [
            {
              role: 'user',
              content: '你好，这是一个测试。'
            }
          ]
        },
        parameters: {
          temperature: 0.1,
          top_p: 0.8,
          max_tokens: 100
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    )

    console.log('✅ API调用成功!')
    console.log('响应状态:', response.status)
    console.log('响应数据:', JSON.stringify(response.data, null, 2))

    // 检查响应格式
    if (response.data.output && response.data.output.text) {
      console.log('✅ 响应格式正确')
      console.log('生成内容:', response.data.output.text)
      return true
    } else {
      console.log('❌ 响应格式异常')
      return false
    }

  } catch (error) {
    console.log('❌ API调用失败:')
    
    if (error.response) {
      console.log('状态码:', error.response.status)
      console.log('错误响应:', JSON.stringify(error.response.data, null, 2))
    } else if (error.request) {
      console.log('网络错误:', error.message)
    } else {
      console.log('其他错误:', error.message)
    }
    
    return false
  }
}

// 运行测试
if (config.apiKey === 'YOUR_QWEN_API_KEY_HERE') {
  console.log('❌ 请先在脚本中配置您的通义千问API密钥')
  console.log('编辑 test-qwen.js 文件，将 YOUR_QWEN_API_KEY_HERE 替换为您的实际API密钥')
  console.log('\n获取通义千问API密钥的步骤:')
  console.log('1. 访问 https://dashscope.console.aliyun.com/')
  console.log('2. 登录您的阿里云账户')
  console.log('3. 创建新的API密钥')
  console.log('4. 复制密钥并替换脚本中的配置')
  process.exit(1)
}

testQwenAPI().then(success => {
  if (success) {
    console.log('\n🎉 测试完成，通义千问API配置正确!')
    console.log('现在您可以在应用中使用通义千问模型了!')
  } else {
    console.log('\n💥 测试失败，请检查配置')
    process.exit(1)
  }
}).catch(error => {
  console.error('测试过程中发生错误:', error)
  process.exit(1)
}) 