#!/usr/bin/env node

/**
 * API配置诊断脚本
 * 用于详细诊断百炼大模型API配置问题
 */

import axios from 'axios'

// 配置信息
const config = {
  apiKey: 'YOUR_API_KEY_HERE', // 替换为您的API密钥
  model: 'bailian-v1',
  endpoint: 'https://bailian.aliyuncs.com/v2/api/invoke'
}

async function diagnoseAPI() {
  console.log('🔍 开始API配置诊断...\n')
  
  // 1. 检查API密钥格式
  console.log('1️⃣ 检查API密钥格式:')
  console.log(`   密钥: ${config.apiKey}`)
  console.log(`   长度: ${config.apiKey.length} 字符`)
  console.log(`   前缀: ${config.apiKey.startsWith('sk-') ? '✅ 正确' : '❌ 错误'}`)
  console.log(`   格式: ${/^sk-[a-zA-Z0-9]{32,}$/.test(config.apiKey) ? '✅ 符合格式' : '❌ 格式异常'}`)
  console.log()

  // 2. 测试不同的请求格式
  console.log('2️⃣ 测试不同的请求格式:')
  
  const testCases = [
    {
      name: '标准格式',
      data: {
        model: config.model,
        prompt: '你好，这是一个测试。',
        temperature: 0.1,
        top_p: 0.8,
        max_tokens: 100
      }
    },
    {
      name: '简化格式',
      data: {
        model: config.model,
        prompt: '你好，这是一个测试。'
      }
    },
    {
      name: '通义千问格式',
      data: {
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
      }
    }
  ]

  for (const testCase of testCases) {
    console.log(`   测试 ${testCase.name}...`)
    try {
      const response = await axios.post(
        config.endpoint,
        testCase.data,
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      )
      
      console.log(`   状态码: ${response.status}`)
      console.log(`   响应: ${JSON.stringify(response.data, null, 2)}`)
      
      if (response.data.Success === false) {
        console.log(`   ❌ ${testCase.name} 失败: ${response.data.Message}`)
      } else {
        console.log(`   ✅ ${testCase.name} 成功!`)
      }
    } catch (error) {
      console.log(`   ❌ ${testCase.name} 异常: ${error.message}`)
      if (error.response) {
        console.log(`   错误响应: ${JSON.stringify(error.response.data, null, 2)}`)
      }
    }
    console.log()
  }

  // 3. 测试不同的端点
  console.log('3️⃣ 测试不同的端点:')
  const endpoints = [
    'https://bailian.aliyuncs.com/v2/api/invoke',
    'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'
  ]

  for (const endpoint of endpoints) {
    console.log(`   测试端点: ${endpoint}`)
    try {
      const response = await axios.post(
        endpoint,
        {
          model: config.model,
          prompt: '你好，这是一个测试。'
        },
        {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      )
      
      console.log(`   状态码: ${response.status}`)
      console.log(`   响应: ${JSON.stringify(response.data, null, 2)}`)
    } catch (error) {
      console.log(`   ❌ 端点测试失败: ${error.message}`)
      if (error.response) {
        console.log(`   错误响应: ${JSON.stringify(error.response.data, null, 2)}`)
      }
    }
    console.log()
  }

  // 4. 提供建议
  console.log('4️⃣ 诊断建议:')
  console.log('   根据测试结果，可能的问题和解决方案:')
  console.log('   • API密钥可能已过期或无效')
  console.log('   • 账户可能没有百炼大模型的访问权限')
  console.log('   • 账户余额可能不足')
  console.log('   • 服务可能未开通')
  console.log()
  console.log('   建议操作:')
  console.log('   1. 登录阿里云控制台检查API密钥状态')
  console.log('   2. 确认百炼大模型服务已开通')
  console.log('   3. 检查账户余额')
  console.log('   4. 重新生成API密钥')
  console.log('   5. 联系阿里云客服确认账户权限')
}

// 运行诊断
diagnoseAPI().catch(error => {
  console.error('诊断过程中发生错误:', error)
  process.exit(1)
}) 