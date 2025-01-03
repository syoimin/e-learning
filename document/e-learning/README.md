# e-learning フロントエンド作成

## 1. Step1 設問一覧の取得

### プロンプト
下記講義一覧のワイヤーフレームに沿ったNext.js のコードを作成してください。  
ただし下記の条件に沿って記述してください。
- tsx ファイルで作成
- サンプルレスポンスデータはこちらで実装してください
- インポートパッケージは下記を利用してください
  - lucide-react
- CSS フレームワークは `tailwindcss` を利用してください
- カテゴリ検索は下記で検索できるようにしてください。
  `const categories = ['すべてのカテゴリー', 'FE', 'BE'];`

```json
[
  {
    "lectureId": "LC8f6011e9",
    "lectureTitle": "HTML 基礎",
    "category": "FE",
    "nuberOfLessons": 5,
    "createdAt": "2024/12/12"
  },
  {
    "lectureId": "LC46a49d34",
    "lectureTitle": "javascript 基礎",
    "category": "BE",
    "nuberOfLessons": 5,
    "createdAt": "2024/12/12"
  }
]
```

以降 バックエンド側の実装へ

## 2. Step2 設問一覧フロントエンドとAPIのつなぎ込み

### プロンプト
サンプルで作成した講義一覧のフロントコードとAPIをつなぎ込んでください。  
エンドポイントは環境変数から取得するようにしてください。  
エンドポイントは `GET: /lectures?category=<category>&title=<title>` です。

レスポンスBodyは下記のとおりです。

▼ レスポンス Body
```json
[
  {
    "lectureId": "LC42394D34",
    "lectureTitle": "GO 言語基礎",
    "category": "BE",
    "nuberOfLessons": 5,
    "createdAt": "2024/12/12"
  },
  {
    "lectureId": "LC4320611c",
    "lectureTitle": "HTML 基礎",
    "category": "FE",
    "nuberOfLessons": 0,
    "createdAt": "2025/01/01"
  }
]
```

```js
// app/questions/page.tsx
'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface Lecture {
  lectureId: string;
  lectureTitle: string;
  category: string;
  nuberOfLessons: number;
  createdAt: string;
}

// サンプルデータ
const sampleData: Lecture[] = [
  {
    lectureId: "LC8f6011e9",
    lectureTitle: "HTML基礎",
    category: "フロントエンド, プログラミング",
    nuberOfLessons: 5,
    createdAt: "2024/12/12"
  }
];

export default function QuestionList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべてのカテゴリー');

  // カテゴリーの一覧を取得
  const categories = ['すべてのカテゴリー', 'フロントエンド', 'バックエンド', '基礎'];

  // 検索とフィルタリングの処理
  const filteredData = sampleData.filter(item => {
    const matchesSearch = item.lectureTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'すべてのカテゴリー' || 
      item.category.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

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
            {filteredData.map((item) => (
              <tr key={item.lectureId}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.category.split(',')[0].trim()}
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
    </div>
  );
}
```

## 3. Step3 設問の作成 API とのつなぎ込み
設問の作成 API とフロントエンドをつなぎこんだ画面を作成します。

事前に新規作成用のページを作成しておきます。
`/lectures/create/page.tsx`


### プロンプト
添付画像のワイヤーフレームを下にフロントコードとAPIをつなぎ込んだコードを出力してください。  
API のエンドポイントは `POST: /lectures` です。  

ただし下記の条件に沿って記述してください。  
- tsx ファイルで作成
- サンプルのリクエスト Body レスポンス Body を参考に実装してください
- インポートパッケージは下記を利用してください
  - lucide-react
- CSS フレームワークは `tailwindcss` を利用してください
- エンドポイントは環境変数から取得するようにしてください。
- 保存が成功したら `/` にリダイレクトするように実装してください。

レスポンスBodyは下記のとおりです。

▼ リクエスト Body  

```json
{
  "lectureTitle": "HTML 基礎",
  "category": "FE",
  "lessons": [
    {
      "lessonTitle": "Pタグとは",
      "lessonContents": "Pタグとは...",
      "lessonQuestions": [
        {
          "value": "選択肢1",
          "correct": false
        },
        {
          "value": "選択肢2",
          "correct": true
        }
      ]
    },
    {
      "lessonTitle": "aタグとは",
      "lessonContents": "aタグとは...",
      "lessonQuestions": [
        {
          "value": "選択肢1",
          "correct": false
        },
        {
          "value": "選択肢2",
          "correct": true
        }
      ]
    }
  ]
}
```

▼ レスポンス Body  

```json
{
  "lectureId": "LCd75e78a0",
  "lessons": [
    {
      "lessonId": "LSbf5efc2e"
    },
    {
      "lessonId": "LSe350ac7f"
    }
  ]
}
```