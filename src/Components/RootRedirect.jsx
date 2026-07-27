import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie } from '../cookies/cookieServices';
import HomePageV1 from '../Path/V1/HomePage';
import HomePageV2 from '../Path/V2/HomePage';

const RootRedirect = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const isTerminalView = searchParams.get('terminalView') === 'true';
  const frontendVersion = process.env.REACT_APP_FORNTENDVERSION || '1';

  if (isTerminalView) {
    return frontendVersion === '1' ? <HomePageV1 /> : <HomePageV2 />;
  }

  const accessToken =
    window.localStorage.getItem('accessToken') ||
    window.sessionStorage.getItem('accessToken') ||
    getCookie('accessToken');

  return accessToken
    ? <Navigate to="/Dashboard" replace />
    : <Navigate to="/login" replace />;
};

export default RootRedirect;
