import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { Search, TodoItem, AddTodoModal, SortBy } from './components';
import { SORT_BY } from '../constants';
import { TodoItemType } from '../types';
import { useFirebase, useNotification, useMediaQuery } from '../hooks';

export const DashBoard = () => {
  const [allTodos, setAllTodos] = useState<TodoItemType[]>([]);
  const [todoList, setTodoList] = useState<TodoItemType[]>([]);
  const [searchString, setSearchString] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>(SORT_BY.NONE);
  const { todos, handleUpdateTodo, handleCompleteTodo, handleDeleteTodoItem, handleAddTodoItem } =
    useFirebase();
  useNotification();
  const { isMobile } = useMediaQuery();

  const handleSort = (sortBy: string, items: TodoItemType[]) => {
    if (sortBy === SORT_BY.NONE) {
      return items;
    } else if (sortBy === SORT_BY.NEWEST) {
      return items.sort((a, b) => (dayjs(a.createdAt).isBefore(b.createdAt) ? 1 : -1));
    } else {
      return items.sort((a, b) => (dayjs(a.createdAt).isAfter(b.createdAt) ? 1 : -1));
    }
  };

  const handleSearch = async (searchString: string) => {
    setSearchString(searchString);
    if (isEmpty(searchString)) {
      setTodoList(handleSort(sortBy, allTodos));
    } else {
      const searchStringArray = searchString.split(' ');
      const searchResult = allTodos.filter((todo) => {
        let isInclude = true;
        searchStringArray.forEach((item) => {
          if (!todo.title.includes(item)) {
            isInclude = false;
            return;
          }
        });
        return isInclude;
      });
      setTodoList(handleSort(sortBy, searchResult));
    }
  };

  useEffect(() => {
    setAllTodos(todos);
    setSearchString('');
    setTodoList(handleSort(sortBy, todos));
  }, [todos, sortBy]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        paddingBottom: 16,
        paddingTop: 16
      }}
      className='col-lg-8 col-md-10 col-10'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 0 16px 0'
        }}>
        <div style={{ fontSize: 30, fontWeight: 'bold' }}>Todo List</div>
        <AddTodoModal addItem={handleAddTodoItem} />
      </div>
      <div
        style={{
          display: 'flex',
          ...(isMobile ? { flexDirection: 'column', gap: 8 } : {})
        }}>
        <div style={{ flex: 1, paddingRight: isMobile ? 0 : 16 }}>
          <Search searchString={searchString} handleSearch={handleSearch} />
        </div>
        <SortBy
          handleSort={(value: string) => {
            setSortBy(value);
            setTodoList(handleSort(value, todoList));
          }}
        />
      </div>

      <div
        style={{
          border: '1px solid #ced4da',
          backgroundColor: 'white',
          marginTop: 16,
          paddingTop: 16,
          borderRadius: 4,
          height: `calc(100vh - ${isMobile ? 280 : 240}px)`,
          minHeight: 400,
          overflow: 'auto'
        }}>
        {todoList.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleCompleteTodo={handleCompleteTodo}
            handleDeleteTodo={handleDeleteTodoItem}
            handleUpdateTodo={handleUpdateTodo}
          />
        ))}
      </div>
    </div>
  );
};
