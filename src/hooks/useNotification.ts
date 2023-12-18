import { useEffect } from 'react';
import dayjs from 'dayjs';
import { useFirebase } from './useFirebase';

export const useNotification = () => {
  const { todos: allTodos, handleUpdateTodo } = useFirebase();

  useEffect(() => {
    Notification.requestPermission().then((result) => {
      if (result === 'denied') {
        console.log('please enable notification permission');
      }
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(async () => {
      const todo = allTodos.find(
        (item) =>
          item?.notification &&
          dayjs(`${item?.startDate} ${item?.startTime}`).unix() - dayjs().unix() < 10 * 60
      );

      if (todo) {
        Notification.requestPermission().then(async (result) => {
          if (result === 'denied') {
            console.log('please enable notification permission');
          }
          if (result === 'granted') {
            new Notification(`${todo.title} is start at ${todo?.startDate} ${todo?.startTime}`, {});
            await handleUpdateTodo({ todo, fieldsToUpdate: { notification: false } });
          }
        });
      }
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [allTodos, handleUpdateTodo]);
};
