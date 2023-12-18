import React from 'react';
import { SORT_BY } from '../../constants';

export const SortBy = ({ handleSort }: { handleSort: Function }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div
        style={{
          fontSize: 16,
          width: 64,
          display: 'flex',
          alignItems: 'center'
        }}>
        Sort by:
      </div>
      <select
        className='form-select form-select-md'
        placeholder='Sort by'
        id='sort-by'
        onChange={(e) => {
          handleSort(e.target.value);
        }}
        style={{ width: 120, fontSize: 14 }}>
        <option value={SORT_BY.NONE}>None</option>
        <option value={SORT_BY.NEWEST}>Newest</option>
        <option value={SORT_BY.OLDEST}>Oldest</option>
      </select>
    </div>
  );
};
