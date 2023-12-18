import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md';
import { IoHome } from 'react-icons/io5';

export const Header = () => {
  const { currentUser } = useAuth();

  return (
    <div
      style={{
        height: 70,
        backgroundColor: 'black',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '16px 16px'
      }}>
      <Link to='/' className=''>
        <IoHome fill='white' size={30} />
      </Link>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div
          style={{
            color: 'white',
            paddingRight: 10,
            display: 'flex',
            alignItems: 'center',
            fontSize: 18
          }}>
          Hi {currentUser.displayName}
        </div>
        <Link to='/left-menu' className=''>
          <MdAccountCircle fill='white' size={30} />
        </Link>
      </div>
    </div>
  );
};
