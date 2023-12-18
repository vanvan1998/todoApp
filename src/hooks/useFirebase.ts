import { useState, useEffect } from 'react';
import { db } from '../firebase';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';
import { TodoItemType } from '../types';
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc
} from 'firebase/firestore';

export const useFirebase = () => {
  const { currentUser } = useAuth();
  const dbKey = currentUser.uid;
  const [todos, setTodos] = useState<TodoItemType[]>([]);

  useEffect(() => {
    const q = query(collection(db, dbKey));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let todos: TodoItemType[] = [];
      querySnapshot.forEach((doc: any) => {
        todos.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todos);
    });
    return () => unsub();
  }, [dbKey]);

  const handleAddTodoItem = async ({
    title,
    detail,
    notification,
    startDate,
    startTime
  }: {
    title: string;
    detail: string;
    notification?: boolean;
    startDate?: string;
    startTime?: string;
  }) => {
    await addDoc(collection(db, dbKey), {
      title,
      completed: false,
      detail,
      startDate: startDate,
      startTime: startTime,
      notification: notification || false,
      createdAt: dayjs().format('YYYY-MM-DDTHH:mm:ss')
    });
  };

  const handleUpdateTodo = async ({
    todo,
    fieldsToUpdate
  }: {
    todo: TodoItemType;
    fieldsToUpdate: Partial<TodoItemType>;
  }) => {
    await updateDoc(doc(db, dbKey, todo.id), {
      ...todo,
      ...fieldsToUpdate
    });
  };

  const handleCompleteTodo = async (todo: TodoItemType) => {
    await updateDoc(doc(db, dbKey, todo.id), { completed: !todo.completed });
  };

  const handleDeleteTodoItem = async (id: string) => {
    await deleteDoc(doc(db, dbKey, id));
  };

  return { todos, handleAddTodoItem, handleUpdateTodo, handleCompleteTodo, handleDeleteTodoItem };
};
