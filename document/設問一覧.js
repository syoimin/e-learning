import React, { useState } from 'react';
import { Search, Filter, Trash2, Edit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const QuestionList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // サンプルデータ
  const questions = [
    { id: 1, title: 'Reactライフサイクル', category: 'frontend', question: 'Reactのライフサイクルについて', created_at: '2024-03-23' },
    { id: 2, title: 'DBインデックス', category: 'backend', question: 'DBのインデックスについて', created_at: '2024-03-23' },
    { id: 3, title: '変数スコープ', category: 'basic', question: '変数のスコープについて', created_at: '2024-03-23' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>設問一覧</CardTitle>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            新規作成
          </button>
        </CardHeader>
        <CardContent>
          {/* 検索・フィルター部分 */}
          <div className="mb-6 flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="設問を検索..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-64">
              <select
                className="w-full p-2 border rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">すべてのカテゴリー</option>
                <option value="frontend">フロントエンド</option>
                <option value="backend">バックエンド</option>
                <option value="basic">基礎</option>
              </select>
            </div>
          </div>

          {/* 設問一覧テーブル */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">カテゴリー</th>
                  <th className="px-4 py-2 text-left">タイトル</th>
                  <th className="px-4 py-2 text-left">設問内容</th>
                  <th className="px-4 py-2 text-left">作成日</th>
                  <th className="px-4 py-2 text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr key={question.id} className="border-b">
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                        {question.category}
                      </span>
                    </td>
                    <td className="px-4 py-2">{question.title}</td>
                    <td className="px-4 py-2">{question.question}</td>
                    <td className="px-4 py-2">{question.created_at}</td>
                    <td className="px-4 py-2 text-center">
                      <button className="p-1 text-blue-500 hover:text-blue-700 mr-2">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-red-500 hover:text-red-700">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionList;