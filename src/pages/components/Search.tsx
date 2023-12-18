import React from 'react';

export const Search = ({
  searchString,
  handleSearch
}: {
  searchString: string;
  handleSearch: Function;
}) => {
  return (
    <form>
      <div className='input_container'>
        <input
          type='text'
          placeholder='Search for title'
          value={searchString}
          onChange={(e) => {
            e.preventDefault();
            handleSearch(e.target.value);
          }}
          style={{
            width: '100%',
            height: 40,
            padding: '4px 16px',
            borderRadius: 4,
            fontSize: 14,
            border: '1px solid #ced4da',
            color: '#212529'
          }}
        />
      </div>
    </form>
  );
};
