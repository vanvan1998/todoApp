import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { isEmpty } from "lodash";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Search, TodoItem, AddTodoModal, SortBy } from "./components";
import { SORT_BY } from "../constants";
import { TodoItemType } from "../types";

export const DashBoard = () => {
  const { currentUser } = useAuth();
  const [allTodos, setAllTodos] = useState<TodoItemType[]>([]);
  const [todoList, setTodoList] = useState<TodoItemType[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>(SORT_BY.NONE);
  const dbKey = currentUser.uid;
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 520);

  const handleUpdateTodo = async ({
    todo,
    title,
    detail,
    notification,
    startDate,
    startTime,
  }: {
    todo: TodoItemType;
    title: string;
    detail?: string;
    notification?: boolean;
    startDate?: string;
    startTime?: string;
  }) => {
    await updateDoc(doc(db, dbKey, todo.id), {
      title: title,
      detail: detail || "",
      startDate: startDate,
      startTime: startTime,
      notification: notification || false,
    });
  };

  const handleSort = (sortBy: string, items: TodoItemType[]) => {
    if (sortBy === SORT_BY.NONE) {
      return items;
    } else if (sortBy === SORT_BY.NEWEST) {
      return items.sort((a, b) =>
        dayjs(a.createdAt).isBefore(b.createdAt) ? 1 : -1
      );
    } else {
      return items.sort((a, b) =>
        dayjs(a.createdAt).isAfter(b.createdAt) ? 1 : -1
      );
    }
  };

  const handleSearch = async (searchString: string) => {
    setSearchString(searchString);
    if (isEmpty(searchString)) {
      setTodoList(handleSort(sortBy, allTodos));
    } else {
      const searchStringArray = searchString.split(" ");
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

  const handleCompleteTodo = async (todo: TodoItemType) => {
    await updateDoc(doc(db, dbKey, todo.id), { completed: !todo.completed });
  };

  const handleDeleteTodoItem = async (id: string) => {
    await deleteDoc(doc(db, dbKey, id));
  };

  const handleAddTodoItem = async ({
    title,
    detail,
    notification,
    startDate,
    startTime,
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
      createdAt: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
    });
  };

  useEffect(() => {
    const q = query(collection(db, dbKey));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const todos: TodoItemType[] = [];
      querySnapshot.forEach((doc: any) => {
        todos.push({ ...doc.data(), id: doc.id });
      });

      setAllTodos(todos);
      setSearchString("");
      setTodoList(handleSort(sortBy, todos));
    });
    return () => unsub();
  }, [dbKey, sortBy]);

  useEffect(() => {
    Notification.requestPermission().then((result) => {
      if (result === "denied") {
        console.log("please enable notification permission");
      }
    });

    const updateWindowDimensions = () => {
      const newWidth = window.innerWidth;
      setIsMobile(newWidth < 520);
    };

    window.addEventListener("resize", updateWindowDimensions);
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  useEffect(() => {
    const timer = setInterval(async () => {
      const todo = allTodos.find(
        (item) =>
          item?.notification &&
          dayjs(`${item?.startDate} ${item?.startTime}`).unix() -
          dayjs().unix() <
          10 * 60
      );

      if (todo) {
        Notification.requestPermission().then(async (result) => {
          if (result === "denied") {
            console.log("please enable notification permission");
          }
          if (result === "granted") {
            new Notification(
              `${todo.title} is start at ${todo?.startDate} ${todo?.startTime}`,
              {}
            );
            await updateDoc(doc(db, dbKey, todo.id), {
              notification: false,
            });
          }
        });
      }
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [allTodos, dbKey]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        paddingBottom: 16,
        paddingTop: 16,
      }}
      className="col-lg-8 col-md-10 col-10"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0 16px 0",
        }}
      >
        <div style={{ fontSize: 30, fontWeight: "bold" }}>Todo List</div>
        <AddTodoModal addItem={handleAddTodoItem} />
      </div>
      <div
        style={{
          display: "flex",
          ...(isMobile ? { flexDirection: "column", gap: 8 } : {}),
        }}
      >
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
          border: "1px solid #ced4da",
          backgroundColor: "white",
          marginTop: 16,
          paddingTop: 16,
          borderRadius: 4,
          height: `calc(100vh - ${isMobile ? 280 : 240}px)`,
          minHeight: 400,
          overflow: "auto",
        }}
      >
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
