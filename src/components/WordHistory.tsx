import React, { useState, useEffect } from 'react'
import { Card, List, Tag, Button, Statistic, Row, Col, Empty, Popconfirm, message } from 'antd'
import { Delete, Book, Search, Calendar } from 'lucide-react'
import { useStoryStore } from '../stores/storyStore'
import type { WordRecord, WordHistory } from '../types'

const WordHistory: React.FC = () => {
  const { wordHistory, wordStats, loadWordHistory, deleteWordRecord } = useStoryStore()
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'history' | 'stats'>('history')

  useEffect(() => {
    loadWordHistory()
  }, [loadWordHistory])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateStr === today.toISOString().split('T')[0]) {
      return '今天'
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return '昨天'
    } else {
      return date.toLocaleDateString('zh-CN', { 
        month: 'short', 
        day: 'numeric',
        weekday: 'short'
      })
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDeleteWord = (wordId: string, date: string, word: string) => {
    deleteWordRecord(wordId, date)
    message.success(`已删除单词 "${word}"`)
  }

  const renderWordCard = (wordRecord: WordRecord, date: string) => (
    <Card
      key={wordRecord.id}
      size="small"
      style={{ marginBottom: 8 }}
      extra={
        <Popconfirm
          title="删除单词记录"
          description="确定要删除这个单词记录吗？"
          onConfirm={() => handleDeleteWord(wordRecord.id, date, wordRecord.word)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="text"
            size="small"
            icon={<Delete />}
            danger
          />
        </Popconfirm>
      }
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
            {wordRecord.word}
          </h4>
          <div style={{ marginTop: 4, fontSize: '12px', color: '#666' }}>
            <Search style={{ marginRight: 4, width: 16, height: 16 }} />
            搜索 {wordRecord.searchCount} 次
            {wordRecord.storyId && (
              <>
                <span style={{ margin: '0 8px' }}>•</span>
                <Book style={{ marginRight: 4, width: 16, height: 16 }} />
                已生成故事
              </>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#999' }}>
          {formatTime(wordRecord.lastSearched)}
        </div>
      </div>
    </Card>
  )

  const renderHistoryTab = () => (
    <div>
      {wordHistory.length === 0 ? (
        <Empty
          description="暂无单词记录"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          dataSource={wordHistory}
          renderItem={(dayRecord: WordHistory) => (
            <List.Item key={dayRecord.date}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Calendar style={{ marginRight: 8, width: 16, height: 16 }} />
                    {formatDate(dayRecord.date)}
                    <Tag color="blue" style={{ marginLeft: 8 }}>
                      {dayRecord.words.length} 个单词
                    </Tag>
                  </div>
                }
                style={{ width: '100%' }}
              >
                {dayRecord.words.length === 0 ? (
                  <Empty description="当天没有单词记录" size="small" />
                ) : (
                  dayRecord.words.map(wordRecord => 
                    renderWordCard(wordRecord, dayRecord.date)
                  )
                )}
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  )

  const renderStatsTab = () => (
    <div>
      {wordStats ? (
        <>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Statistic
                title="总单词数"
                value={wordStats.totalWords}
                prefix={<Book />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="总搜索次数"
                value={wordStats.totalSearches}
                prefix={<Search />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="独特单词"
                value={wordStats.uniqueWords}
                prefix={<Book />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="平均搜索次数"
                value={wordStats.totalWords > 0 ? (wordStats.totalSearches / wordStats.totalWords).toFixed(1) : 0}
                prefix={<Search />}
              />
            </Col>
          </Row>

          <Card title="最常搜索的单词" size="small">
            {wordStats.mostSearchedWords.length === 0 ? (
              <Empty description="暂无数据" size="small" />
            ) : (
              <List
                dataSource={wordStats.mostSearchedWords}
                renderItem={(item, index) => (
                  <List.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>
                        <Tag color="blue">{index + 1}</Tag>
                        {item.word}
                      </span>
                      <span style={{ color: '#666' }}>
                        搜索 {item.count} 次
                      </span>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </>
      ) : (
        <Empty description="暂无统计数据" />
      )}
    </div>
  )

  return (
    <div style={{ padding: '16px' }}>
      <Card
        title="单词学习历史"
        extra={
          <div>
            <Button
              type={activeTab === 'history' ? 'primary' : 'default'}
              size="small"
              onClick={() => setActiveTab('history')}
              style={{ marginRight: 8 }}
            >
              历史记录
            </Button>
            <Button
              type={activeTab === 'stats' ? 'primary' : 'default'}
              size="small"
              onClick={() => setActiveTab('stats')}
            >
              统计信息
            </Button>
          </div>
        }
      >
        {activeTab === 'history' ? renderHistoryTab() : renderStatsTab()}
      </Card>
    </div>
  )
}

export default WordHistory 