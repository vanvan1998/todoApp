import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddTodo } from '..';
import { MODE } from '../../../../constants';

describe('Test AddTodo component', () => {
  test('should match its snapshot', async () => {
    const component = render(
      <AddTodo mode={MODE.ADD} addItem={jest.fn()} onComplete={jest.fn()} />
    );
    expect(component).toMatchSnapshot();
  });
});
