import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const MultiQuestionForm = () => {
  const [mainTitle, setMainTitle] = useState('');
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState([{
    id: 1,
    title: '',
    content: '',
    answers: ['', '', '', ''],
    correctAnswer: 0,
    isExpanded: true
  }]);

  const addQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    setQuestions([...questions, {
      id: newId,
      title: '',
      content: '',
      answers: ['', '', '', ''],
      correctAnswer: 0,
      isExpanded: true
    }]);
  };

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const updateAnswer = (questionId, answerIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newAnswers = [...q.answers];
        newAnswers[answerIndex] = value;
        return { ...q, answers: newAnswers };
      }
      return q;
    }));
  };

  const toggleExpand = (id) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        return { ...q, isExpanded: !q.isExpanded };
      }
      return q;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>設問グループの作成</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* メインタイトルと種別 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">設問グループタイトル</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={mainTitle}
                  onChange={(e) => setMainTitle(e.target.value)}
                  placeholder="設問グループのタイトルを入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">カテゴリー</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">選択してください</option>
                  <option value="frontend">フロントエンド</option>
                  <option value="backend">バックエンド</option>
                  <option value="basic">基礎</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 個別の設問 */}
      {questions.map((question, index) => (
        <Card key={question.id} className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">設問 {index + 1}</span>
              <button
                onClick={() => toggleExpand(question.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {question.isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
            <button
              onClick={() => removeQuestion(question.id)}
              className="text-red-500 hover:text-red-700"
              disabled={questions.length === 1}
            >
              <Trash2 size={20} />
            </button>
          </CardHeader>
          
          {question.isExpanded && (
            <CardContent>
              <div className="space-y-4">
                {/* 設問タイトル */}
                <div>
                  <label className="block text-sm font-medium mb-2">設問タイトル</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={question.title}
                    onChange={(e) => updateQuestion(question.id, 'title', e.target.value)}
                    placeholder="設問のタイトルを入力"
                  />
                </div>

                {/* 設問内容 */}
                <div>
                  <label className="block text-sm font-medium mb-2">設問内容</label>
                  <textarea
                    className="w-full p-2 border rounded-md h-32"
                    value={question.content}
                    onChange={(e) => updateQuestion(question.id, 'content', e.target.value)}
                    placeholder="設問の内容を入力"
                  />
                </div>

                {/* 解答選択肢 */}
                <div>
                  <label className="block text-sm font-medium mb-2">解答選択肢</label>
                  <div className="space-y-3">
                    {question.answers.map((answer, answerIndex) => (
                      <div key={answerIndex} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correctAnswer === answerIndex}
                          onChange={() => updateQuestion(question.id, 'correctAnswer', answerIndex)}
                          className="w-4 h-4"
                        />
                        <input
                          type="text"
                          className="flex-1 p-2 border rounded-md"
                          value={answer}
                          onChange={(e) => updateAnswer(question.id, answerIndex, e.target.value)}
                          placeholder={`選択肢 ${answerIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {/* 設問追加ボタン */}
      <button
        onClick={addQuestion}
        className="w-full p-4 border-2 border-dashed rounded-lg 
                 text-gray-500 hover:text-gray-700 hover:border-gray-400 
                 flex items-center justify-center gap-2 mt-4"
      >
        <Plus size={20} />
        設問を追加
      </button>

      {/* 保存ボタン */}
      <div className="mt-6 flex justify-end">
        <button 
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => console.log({ mainTitle, category, questions })}
        >
          保存
        </button>
      </div>
    </div>
  );
};

export default MultiQuestionForm;