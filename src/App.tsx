import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Signup,
  LeftMenu,
  Login,
  PrivateRoute,
  ForgotPassword,
  UpdatePassword,
  UpdateProfile,
  DashBoard
} from './pages';

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route
              path='/update-password'
              element={
                <PrivateRoute>
                  <UpdatePassword />
                </PrivateRoute>
              }
            />
            <Route
              path='/update-profile'
              element={
                <PrivateRoute>
                  <UpdateProfile />
                </PrivateRoute>
              }
            />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route
              path='/left-menu'
              element={
                <PrivateRoute>
                  <LeftMenu />
                </PrivateRoute>
              }
            />
            <Route
              path='/'
              element={
                <PrivateRoute>
                  <DashBoard />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
