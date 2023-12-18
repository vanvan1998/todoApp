import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import dayjs from 'dayjs';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { DATE_FORMAT, MODE, TIME_FORMAT } from '../../../constants';
import { TodoItemType } from '../../../types';
import { isEmpty } from 'lodash';

export const AddTodo = ({
  mode,
  addItem,
  updateItem,
  onComplete,
  todo
}: {
  mode: string;
  addItem?: Function;
  updateItem?: Function;
  todo?: TodoItemType;
  onComplete: () => void;
}) => {
  const isAddItem = mode === MODE.ADD;
  const newDateTime = dayjs().add(1, 'hours');
  const currentDateTime = dayjs(`${todo?.startDate} ${todo?.startTime}`);

  const [title, setTitle] = useState(isAddItem ? '' : todo?.title);
  const [detail, setDetail] = useState(isAddItem ? '' : todo?.detail);
  const [notification, setNotification] = useState(isAddItem ? false : todo?.notification);
  const [date, setDate] = useState(
    !isAddItem && todo?.notification ? currentDateTime : newDateTime
  );
  const [time, setTime] = useState(
    !isAddItem && todo?.notification ? currentDateTime : newDateTime
  );

  const handleAddOrEdit = async (e: any) => {
    e.preventDefault();
    if (isAddItem) {
      if (title !== '') {
        addItem &&
          addItem({
            title,
            detail,
            notification,
            startDate: notification ? date.format(DATE_FORMAT) : '',
            startTime: notification ? time.format(TIME_FORMAT) : ''
          });
        setTitle('');
        setDetail('');
      }
    } else {
      updateItem &&
        updateItem({
          todo,
          fieldsToUpdate: {
            title,
            detail,
            notification,
            startDate: notification ? date.format(DATE_FORMAT) : '',
            startTime: notification ? time.format(TIME_FORMAT) : ''
          }
        });
    }
    onComplete();
  };

  return (
    <div style={{ padding: '8px 30px 30px 30px', height: 420, overflow: 'auto' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 0 24px 0'
        }}>
        <div style={{ fontSize: 20, fontWeight: 'bold' }}>
          {isAddItem ? 'Add todo' : 'Update todo'}
        </div>
        <Button
          className='button-complete'
          onClick={onComplete}
          style={{ backgroundColor: 'white', border: 'none', padding: 0 }}>
          <IoCloseCircleOutline size={24} color='black' />
        </Button>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type='text'
            placeholder='Enter new todo...'
            value={title}
            onChange={(e) => {
              e.preventDefault();
              setTitle(e.target.value);
            }}
            style={{
              width: '100%',
              height: 40,
              padding: '4px 48px 4px 16px',
              borderRadius: 4,
              fontSize: 16,
              border: '1px solid #ced4da',
              color: '#212529'
            }}
          />
        </div>

        <div style={{ paddingLeft: 16, display: 'flex', alignItems: 'center' }}>
          <Button
            style={{ width: 100, height: 40 }}
            onClick={handleAddOrEdit}
            disabled={isEmpty(title)}>
            {isAddItem ? 'Add' : 'Update'}
          </Button>
        </div>
      </div>

      <div style={{ height: 150 }}>
        <textarea
          placeholder='Enter detail...'
          value={detail}
          onChange={(e) => {
            e.preventDefault();
            setDetail(e.target.value);
          }}
          style={{
            width: '100%',
            height: 150,
            padding: '8px 16px',
            borderRadius: 4,
            fontSize: 16,
            border: '1px solid #ced4da',
            color: '#212529',
            marginTop: 8
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: 24,
          gap: 10,
          alignItems: 'center'
        }}>
        <div>Notification: </div>
        <div className='form-check form-switch'>
          <input
            className='form-check-input'
            type='checkbox'
            role='switch'
            id='flexSwitchCheckDefault'
            checked={notification}
            style={{ width: 40, height: 20 }}
            onChange={() => {
              setNotification(!notification);
            }}
          />
        </div>
      </div>
      {notification ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 10,
              gap: 10
            }}>
            <TimePicker
              orientation='landscape'
              defaultValue={time}
              onChange={(value) => {
                if (value) {
                  setTime(value);
                }
              }}
            />
            <DatePicker
              defaultValue={date}
              onChange={(value) => {
                if (value) {
                  setDate(value);
                }
              }}
              slotProps={{
                actionBar: {
                  actions: ['today']
                }
              }}
            />
          </div>
        </LocalizationProvider>
      ) : (
        <></>
      )}
    </div>
  );
};
