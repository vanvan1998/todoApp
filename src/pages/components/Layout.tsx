import React from 'react';

export const Layout = ({ children }: any) => {
  return (
    <div
      className='align-items-center justify-content-center'
      style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
        className='col-md-6 col-sm-10 col-10'>
        {children}
      </div>
    </div>
  );
};
