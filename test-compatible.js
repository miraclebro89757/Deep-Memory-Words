#!/usr/bin/env node

/**
 * 通义千问兼容模式API测试脚本
 * 用于验证API密钥在兼容模式下的工作状态
 */

import axios from 'axios'

// 配置信息
const config = {
  apiKey: 'YOUR_API_KEY_HERE', // 替换为您的API密钥
  model: 'qwen-plus',
  endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
}

async function testCompatibleAPI() {
  console.log('🔍 开始测试通义千问兼容模式API...')
  console.log('配置信息:', {
    model: config.model,
    endpoint: config.endpoint,
    apiKey: config.apiKey ? `${config.apiKey.substring(0, 10)}...` : '未设置'
  })

  try {
    // 测试请求 - 使用OpenAI兼容格式
    const response = await axios.post(
      `${config.endpoint}/chat/completions`,
      {
        model: config.model,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "你是谁？" }
        ],
        temperature: 0.7,
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
    if (response.data.choices && response.data.choices[0]) {
      console.log('✅ 响应格式正确')
      console.log('生成内容:', response.data.choices[0].message.content)
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
testCompatibleAPI().then(success => {
  if (success) {
    console.log('\n🎉 测试完成，通义千问兼容模式API配置正确!')
    console.log('现在您可以在应用中使用这个配置了!')
  } else {
    console.log('\n💥 测试失败，请检查配置')
    process.exit(1)
  }
}).catch(error => {
  console.error('测试过程中发生错误:', error)
  process.exit(1)
}) 