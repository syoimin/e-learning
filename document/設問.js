import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const QuizInterface = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  const totalQuestions = 5;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* 進捗バー */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">問題 {currentQuestion} / {totalQuestions}</div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* 左側：問題文エリア */}
        <Card className="flex-1">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">問題文</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">
                ここに問題文が入ります。長文の場合でも対応できるように、
                十分なスペースを確保しています。必要に応じてスクロールも可能です。
              </p>
              <div className="mt-4">
                <img 
                  src="/api/placeholder/400/200" 
                  alt="問題の補足画像" 
                  className="rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 右側：回答エリア */}
        <Card className="flex-1">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">回答</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((option) => (
                <button
                  key={option}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all
                    ${selectedAnswer === option 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-200'}`}
                  onClick={() => setSelectedAnswer(option)}
                >
                  選択肢 {option}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ナビゲーションボタン */}
      <div className="flex justify-between mt-6">
        <button
          className={`flex items-center px-4 py-2 rounded-lg
            ${currentQuestion > 1 
              ? 'bg-gray-200 hover:bg-gray-300' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          onClick={() => currentQuestion > 1 && setCurrentQuestion(prev => prev - 1)}
          disabled={currentQuestion === 1}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          前の問題
        </button>

        <button
          className={`flex items-center px-4 py-2 rounded-lg
            ${selectedAnswer 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          onClick={() => selectedAnswer && setCurrentQuestion(prev => prev + 1)}
          disabled={!selectedAnswer}
        >
          {currentQuestion === totalQuestions ? '結果を見る' : '次の問題'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default QuizInterface;