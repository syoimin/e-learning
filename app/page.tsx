'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface Lecture {
  lectureId: string;
  lectureTitle: string;
  category: string;
  nuberOfLessons: number;
  createdAt: string;
}

export default function QuestionList() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべてのカテゴリー');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['すべてのカテゴリー', 'FE', 'BE', '基礎'];

  // 講義データを取得する関数
  const fetchLectures = async (title?: string, category?: string) => {
    try {
      setIsLoading(true);
      let url = 'https://bldggys750.execute-api.us-east-1.amazonaws.com/dev/lectures';
      
      // クエリパラメータの構築
      const params = new URLSearchParams();
      if (title) params.append('title', title);
      if (category && category !== 'すべてのカテゴリー') params.append('category', category);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch lectures');
      
      const data = await response.json();
      setLectures(data);
      setError(null);
    } catch (err) {
      setError('Failed to load lectures');
      console.error('Error fetching lectures:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 初回レンダリング時にデータを取得
  useEffect(() => {
    fetchLectures();
  }, []);

  // 検索とフィルタリングの実行
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchLectures(
        searchTerm || undefined,
        selectedCategory !== 'すべてのカテゴリー' ? selectedCategory : undefined
      );
    }, 500); // 500ms のデバウンス

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">設問グループ一覧</h1>
        
        <div className="flex justify-between items-center mb-6">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            新規作成
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="設問グループを検索..."
                className="w-full p-2 border rounded pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                🔍
              </span>
            </div>
          </div>
          <select
            className="border rounded p-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  カテゴリー
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  タイトル
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  設問数
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  作成日
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {lectures.map((item) => (
                <tr key={item.lectureId}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.lectureTitle}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.nuberOfLessons}問
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.createdAt}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}