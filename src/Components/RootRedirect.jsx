import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie } from '../cookies/cookieServices';

const RootRedirect = () => {
  const accessToken =
    window.localStorage.getItem('accessToken') ||
    window.sessionStorage.getItem('accessToken') ||
    getCookie('accessToken');

  return accessToken
    ? <Navigate to="/Dashboard" replace />
    : <Navigate to="/login" replace />;
};

export default RootRedirect;
