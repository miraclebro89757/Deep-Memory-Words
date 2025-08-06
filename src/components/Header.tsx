import React from 'react'
import { Link } from 'react-router-dom'
import { Settings, BookOpen, History } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-gray-900">
            <BookOpen className="w-6 h-6 text-primary-600" />
            <span>单词记忆故事生成器</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link 
              to="/history" 
              className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <History className="w-4 h-4" />
              <span>学习历史</span>
            </Link>
            <Link 
              to="/settings" 
              className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>设置</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header 