"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { API_ENDPOINTS } from '@/lib/api-config';

interface User {
  key: string;
  name: string;
}

interface ApiError {
  message: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>({ key: '', name: '' });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // ユーザー一覧の取得
  const fetchUsers = async (): Promise<void> => {
    try {
      const response = await fetch(API_ENDPOINTS.users);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data: User[] = await response.json();
      setUsers(data);
    } catch (err) {
      const error = err as ApiError;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ユーザーの作成
  const createUser = async (userData: User): Promise<void> => {
    try {
      const response = await fetch(API_ENDPOINTS.users, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to create user');
      await fetchUsers();
    } catch (err) {
      const error = err as ApiError;
      setError(error.message);
    }
  };

  // ユーザーの更新
  const updateUser = async (userId: string, userData: User): Promise<void> => {
    try {
      const response = await fetch(API_ENDPOINTS.user(userId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to update user');
      await fetchUsers();
    } catch (err) {
      const error = err as ApiError;
      setError(error.message);
    }
  };

  // ユーザーの削除
  const deleteUser = async (userId: string): Promise<void> => {
    if (!window.confirm('このユーザーを削除してもよろしいですか？')) return;
    try {
      const response = await fetch(API_ENDPOINTS.user(userId), {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      await fetchUsers();
    } catch (err) {
      const error = err as ApiError;
      setError(error.message);
    }
  };

  // 以下、コンポーネントの残りの部分は同じ
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (isEditing) {
      await updateUser(currentUser.key, currentUser);
    } else {
      await createUser(currentUser);
    }
    setIsDialogOpen(false);
    setCurrentUser({ key: '', name: '' });
  };

  // 編集ダイアログを開く
  const openEditDialog = (user: User): void => {
    setCurrentUser(user);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  // 新規作成ダイアログを開く
  const openCreateDialog = (): void => {
    setCurrentUser({ key: '', name: '' });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* 既存のJSX部分は変更なし */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>ユーザー一覧</CardTitle>
          <button
            onClick={openCreateDialog}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            新規作成
          </button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Key</th>
                  <th className="px-4 py-2 text-left">名前</th>
                  <th className="px-4 py-2 text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.key} className="border-b">
                    <td className="px-4 py-2">{user.key}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => openEditDialog(user)}
                          className="p-1 text-blue-500 hover:text-blue-700"
                          title="編集"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(user.key)}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="削除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'ユーザーの編集' : 'ユーザーの新規作成'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Key</label>
              <input
                type="text"
                value={currentUser.key}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, key: e.target.value })
                }
                className="w-full p-2 border rounded-md"
                disabled={isEditing}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">名前</label>
              <input
                type="text"
                value={currentUser.name}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, name: e.target.value })
                }
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {isEditing ? '更新' : '作成'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;