#!/usr/bin/env node

/**
 * API配置测试脚本
 * 用于验证百炼大模型API配置是否正确
 */

import axios from 'axios'

// 配置信息 - 请替换为您的实际配置
const config = {
  apiKey: 'YOUR_API_KEY_HERE', // 替换为您的API密钥
  model: 'bailian-v1',
  endpoint: 'https://bailian.aliyuncs.com/v2/api/invoke'
}

async function testBailianAPI() {
  console.log('🔍 开始测试百炼大模型API...')
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
        prompt: '你好，这是一个测试。',
        temperature: 0.1,
        top_p: 0.8,
        max_tokens: 100
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
    if (response.data.Success === false) {
      console.log('❌ API返回错误:', response.data.Message)
      return false
    }

    console.log('✅ 响应格式正确')
    return true

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
testBailianAPI().then(success => {
  if (success) {
    console.log('\n🎉 测试完成，API配置正确!')
  } else {
    console.log('\n💥 测试失败，请检查配置')
    process.exit(1)
  }
}).catch(error => {
  console.error('测试过程中发生错误:', error)
  process.exit(1)
}) 