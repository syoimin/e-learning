// app/lectures/[lectureId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Question {
 key: string;
 value: string;
 correct: boolean;
}

interface Lesson {
 lessonId: string;
 lessonTitle: string;
 lessonContents: string;
 lessonQuestions: Question[];
}

export default function LectureQuestions() {
 const params = useParams();
 const router = useRouter();
 const [lessons, setLessons] = useState<Lesson[]>([]);
 const [currentIndex, setCurrentIndex] = useState(0);
 const [isLoading, setIsLoading] = useState(true);
 const [showModal, setShowModal] = useState(false);
 const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

 useEffect(() => {
   const fetchLessons = async () => {
     try {
       const response = await fetch(
         `${process.env.NEXT_PUBLIC_API_URL}/lectures/${params.id}`
       );
       if (!response.ok) throw new Error('Failed to fetch lessons');
       const data = await response.json();
       setLessons(data);
     } catch (error) {
       console.error('Error:', error);
     } finally {
       setIsLoading(false);
     }
   };

   fetchLessons();
 }, [params.id]);

 const currentLesson = lessons[currentIndex];
 const isLastQuestion = currentIndex === lessons.length - 1;

 const handleNext = () => {
   if (isLastQuestion) {
     setShowModal(true);
   } else {
     setCurrentIndex(prev => prev + 1);
     setSelectedAnswer(null);
   }
 };

 const handlePrevious = () => {
   setCurrentIndex(prev => prev - 1);
   setSelectedAnswer(null);
 };

 if (isLoading) {
   return (
     <div className="flex justify-center items-center min-h-screen">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
     </div>
   );
 }

 if (!currentLesson) {
   return <div>No lessons found</div>;
 }

 return (
   <div className="max-w-4xl mx-auto p-6">
     {/* Progress Bar */}
     <div className="mb-6">
       <div className="text-sm text-gray-600 mb-2">
         問題 {currentIndex + 1} / {lessons.length}
       </div>
       <div className="bg-gray-200 h-2 rounded-full">
         <div 
           className="bg-blue-500 h-full rounded-full transition-all"
           style={{ width: `${((currentIndex + 1) / lessons.length) * 100}%` }}
         />
       </div>
     </div>

     {/* Question Card */}
     <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
       <div className="mb-6">
         <h2 className="text-xl font-bold mb-4">問題文</h2>
         <div className="bg-gray-50 p-4 rounded-lg">
           <h3 className="font-medium mb-2">{currentLesson.lessonTitle}</h3>
           <p className="text-gray-700">{currentLesson.lessonContents}</p>
           {currentLesson.lessonContents.includes('img') && (
             <div className="mt-4 bg-gray-200 w-[400px] h-[200px] rounded flex items-center justify-center">
               <span className="text-gray-500">400 x 200</span>
             </div>
           )}
         </div>
       </div>

       <div className="mb-6">
         <h2 className="text-xl font-bold mb-4">回答</h2>
         <div className="space-y-3">
           {currentLesson.lessonQuestions.map((question) => (
             <button
               key={question.key}
               onClick={() => setSelectedAnswer(question.key)}
               className={`w-full p-4 text-left rounded-lg border transition-colors
                 ${selectedAnswer === question.key 
                   ? 'border-blue-500 bg-blue-50' 
                   : 'border-gray-200 hover:bg-gray-50'
                 }`}
             >
               {question.value}
             </button>
           ))}
         </div>
       </div>
     </div>

     {/* Navigation Buttons */}
     <div className="flex justify-between">
       <button
         onClick={handlePrevious}
         disabled={currentIndex === 0}
         className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50"
       >
         <ChevronLeft className="w-5 h-5 mr-1" />
         前の問題
       </button>
       <button
         onClick={handleNext}
         disabled={!selectedAnswer}
         className="flex items-center px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
       >
         {isLastQuestion ? '解答する' : (
           <>
             次の問題
             <ChevronRight className="w-5 h-5 ml-1" />
           </>
         )}
       </button>
     </div>

     {/* Completion Modal */}
     {showModal && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
         <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
           <h2 className="text-xl font-bold mb-4">完了</h2>
           <p className="mb-6">解答が送信されました</p>
           <button
             onClick={() => router.push('/')}
             className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
           >
             一覧に戻る
           </button>
         </div>
       </div>
     )}
   </div>
 );
}