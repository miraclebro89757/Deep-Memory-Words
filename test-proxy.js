#!/usr/bin/env node

/**
 * 代理配置测试脚本
 * 用于验证Vite代理是否正常工作
 */

import axios from 'axios'

async function testProxy() {
  console.log('🔍 测试代理配置...')
  
  try {
    // 测试通义千问兼容模式代理
    console.log('测试 /api/qwen-compatible/chat/completions 代理...')
    
    const response = await axios.post(
      'http://localhost:5173/api/qwen-compatible/chat/completions',
      {
        model: 'qwen-plus',
        messages: [
          {
            role: 'user',
            content: '你好，这是一个代理测试。'
          }
        ],
        temperature: 0.1,
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY_HERE', // 替换为您的API密钥
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    )

    console.log('✅ 代理测试成功!')
    console.log('状态码:', response.status)
    console.log('响应数据:', JSON.stringify(response.data, null, 2))
    
    return true
  } catch (error) {
    console.log('❌ 代理测试失败:')
    
    if (error.response) {
      console.log('状态码:', error.response.status)
      console.log('错误响应:', JSON.stringify(error.response.data, null, 2))
    } else if (error.request) {
      console.log('网络错误:', error.message)
      console.log('请确保开发服务器正在运行 (npm run dev)')
    } else {
      console.log('其他错误:', error.message)
    }
    
    return false
  }
}

// 运行测试
testProxy().then(success => {
  if (success) {
    console.log('\n🎉 代理配置正常，应用应该可以正常工作了!')
  } else {
    console.log('\n💥 代理配置有问题，请检查开发服务器状态')
  }
}).catch(error => {
  console.error('测试过程中发生错误:', error)
}) 