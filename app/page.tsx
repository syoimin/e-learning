// app/lectures/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Search } from 'lucide-react';
import Link from 'next/link';

interface Lecture {
 lectureId: string;
 lectureTitle: string;
 category: string;
 nuberOfLessons: number;
 createdAt: string;
}

export default function LectureList() {
 const [lectures, setLectures] = useState<Lecture[]>([]);
 const [searchTerm, setSearchTerm] = useState('');
 const [selectedCategory, setSelectedCategory] = useState('すべてのカテゴリー');
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 const categories = ['すべてのカテゴリー', 'FE', 'BE'];

 const fetchLectures = async (title?: string, category?: string) => {
   try {
     setIsLoading(true);
     let url = `${process.env.NEXT_PUBLIC_API_URL}/lectures`;
     
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
     setError('講義一覧の取得に失敗しました');
     console.error('Error fetching lectures:', err);
   } finally {
     setIsLoading(false);
   }
 };

 useEffect(() => {
   fetchLectures();
 }, []);

 useEffect(() => {
   const debounceTimer = setTimeout(() => {
     fetchLectures(
       searchTerm || undefined,
       selectedCategory !== 'すべてのカテゴリー' ? selectedCategory : undefined
     );
   }, 500);

   return () => clearTimeout(debounceTimer);
 }, [searchTerm, selectedCategory]);

 return (
   <div className="max-w-6xl mx-auto p-6">
     <div className="mb-6">
       <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold">設問グループ一覧</h1>
         <Link 
           href="/lectures/create"
           className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
         >
           新規作成
         </Link>
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
             <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
           </div>
         </div>
         <select
           className="border rounded p-2 min-w-[200px]"
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
       <div className="flex justify-center py-8">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
       </div>
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
             {lectures.map((lecture) => (
               <tr key={lecture.lectureId} className="hover:bg-gray-50">
                 <td className="px-6 py-4 text-sm text-gray-900">
                   {lecture.category}
                 </td>
                 <td className="px-6 py-4 text-sm text-gray-900">
                   {lecture.lectureTitle}
                 </td>
                 <td className="px-6 py-4 text-sm text-gray-900">
                   {lecture.nuberOfLessons}問
                 </td>
                 <td className="px-6 py-4 text-sm text-gray-900">
                   {lecture.createdAt}
                 </td>
                 <td className="px-6 py-4 text-sm text-gray-900">
                   <div className="flex gap-3">
                     <button className="text-blue-600 hover:text-blue-800 transition-colors">
                       <Pencil className="w-5 h-5" />
                     </button>
                     <button className="text-red-600 hover:text-red-800 transition-colors">
                       <Trash2 className="w-5 h-5" />
                     </button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>

         {lectures.length === 0 && (
           <div className="text-center py-8 text-gray-500">
             講義が見つかりませんでした
           </div>
         )}
       </div>
     )}
   </div>
 );
}