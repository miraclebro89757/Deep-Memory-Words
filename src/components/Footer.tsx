import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 单词记忆故事生成器. 基于阿里云通义千问大模型.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 