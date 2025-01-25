// app/lectures/create/page.tsx
'use client';

import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Question {
 value: string;
 correct: boolean;
}

interface Lesson {
 lessonTitle: string;
 lessonContents: string;
 lessonQuestions: Question[];
}

interface CreateLecturePayload {
 lectureTitle: string;
 category: string;
 lessons: Lesson[];
}

export default function CreateLecture() {
 const router = useRouter();
 const categories = ['FE', 'BE'];
 const [isSubmitting, setIsSubmitting] = useState(false);
 
 const [formData, setFormData] = useState<CreateLecturePayload>({
   lectureTitle: '',
   category: '',
   lessons: [
     {
       lessonTitle: '',
       lessonContents: '',
       lessonQuestions: Array(4).fill({ value: '', correct: false })
     }
   ]
 });

 const handleAddLesson = () => {
   setFormData(prev => ({
     ...prev,
     lessons: [...prev.lessons, {
       lessonTitle: '',
       lessonContents: '',
       lessonQuestions: Array(4).fill({ value: '', correct: false })
     }]
   }));
 };

 const handleRemoveLesson = (index: number) => {
   setFormData(prev => ({
     ...prev,
     lessons: prev.lessons.filter((_, i) => i !== index)
   }));
 };

 const handleLessonChange = (index: number, field: keyof Lesson, value: string) => {
   setFormData(prev => ({
     ...prev,
     lessons: prev.lessons.map((lesson, i) => 
       i === index ? { ...lesson, [field]: value } : lesson
     )
   }));
 };

 const handleQuestionChange = (lessonIndex: number, questionIndex: number, value: string) => {
   setFormData(prev => ({
     ...prev,
     lessons: prev.lessons.map((lesson, i) => 
       i === lessonIndex ? {
         ...lesson,
         lessonQuestions: lesson.lessonQuestions.map((q, qIndex) =>
           qIndex === questionIndex ? { ...q, value } : q
         )
       } : lesson
     )
   }));
 };

 const handleCorrectAnswerChange = (lessonIndex: number, questionIndex: number) => {
   setFormData(prev => ({
     ...prev,
     lessons: prev.lessons.map((lesson, i) => 
       i === lessonIndex ? {
         ...lesson,
         lessonQuestions: lesson.lessonQuestions.map((q, qIndex) => ({
           ...q,
           correct: qIndex === questionIndex
         }))
       } : lesson
     )
   }));
 };

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setIsSubmitting(true);

   try {
     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lectures`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         ...formData,
         lessons: formData.lessons.map(lesson => ({
           ...lesson,
           lessonQuestions: lesson.lessonQuestions.filter(q => q.value.trim() !== '')
         }))
       })
     });

     if (!response.ok) {
       throw new Error('Failed to create lecture');
     }

     router.push('/lectures');
   } catch (error) {
     console.error('Error creating lecture:', error);
     alert('講義の作成に失敗しました');
   } finally {
     setIsSubmitting(false);
   }
 };

 return (
   <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
     <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
       <h1 className="text-2xl font-bold mb-6">設問グループの作成</h1>
       
       <div className="mb-6">
         <label className="block mb-2 font-medium">設問グループタイトル</label>
         <input
           type="text"
           value={formData.lectureTitle}
           onChange={(e) => setFormData(prev => ({ ...prev, lectureTitle: e.target.value }))}
           placeholder="設問グループのタイトルを入力"
           className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
           required
         />
       </div>

       <div className="mb-6">
         <label className="block mb-2 font-medium">カテゴリー</label>
         <select
           value={formData.category}
           onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
           className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
           required
         >
           <option value="">選択してください</option>
           {categories.map((category) => (
             <option key={category} value={category}>{category}</option>
           ))}
         </select>
       </div>
     </div>

     {formData.lessons.map((lesson, lessonIndex) => (
       <div key={lessonIndex} className="bg-white rounded-lg shadow-lg p-6 mb-6">
         <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-semibold">設問 {lessonIndex + 1}</h2>
           {formData.lessons.length > 1 && (
             <button
               type="button"
               onClick={() => handleRemoveLesson(lessonIndex)}
               className="text-red-600 hover:text-red-800 transition-colors"
               aria-label="設問を削除"
             >
               <Trash2 className="w-5 h-5" />
             </button>
           )}
         </div>

         <div className="mb-4">
           <label className="block mb-2 font-medium">設問タイトル</label>
           <input
             type="text"
             value={lesson.lessonTitle}
             onChange={(e) => handleLessonChange(lessonIndex, 'lessonTitle', e.target.value)}
             placeholder="設問のタイトルを入力"
             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
             required
           />
         </div>

         <div className="mb-4">
           <label className="block mb-2 font-medium">設問内容</label>
           <textarea
             value={lesson.lessonContents}
             onChange={(e) => handleLessonChange(lessonIndex, 'lessonContents', e.target.value)}
             placeholder="設問の内容を入力"
             className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500 resize-none"
             required
           />
         </div>

         <div className="mb-4">
           <label className="block mb-2 font-medium">解答選択肢</label>
           {lesson.lessonQuestions.map((question, qIndex) => (
             <div key={qIndex} className="flex items-center gap-2 mb-2">
               <input
                 type="radio"
                 name={`correct-${lessonIndex}`}
                 checked={question.correct}
                 onChange={() => handleCorrectAnswerChange(lessonIndex, qIndex)}
                 className="w-4 h-4 text-blue-600"
                 required={qIndex === 0}
               />
               <input
                 type="text"
                 value={question.value}
                 onChange={(e) => handleQuestionChange(lessonIndex, qIndex, e.target.value)}
                 placeholder={`選択肢 ${qIndex + 1}`}
                 className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
               />
             </div>
           ))}
         </div>
       </div>
     ))}

     <div className="flex justify-center mb-6">
       <button
         type="button"
         onClick={handleAddLesson}
         className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
       >
         <Plus className="w-5 h-5 mr-2" />
         設問を追加
       </button>
     </div>

     <div className="flex justify-end">
       <button
         type="submit"
         disabled={isSubmitting}
         className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors disabled:bg-gray-400"
       >
         {isSubmitting ? '保存中...' : '保存'}
       </button>
     </div>
   </form>
 );
}