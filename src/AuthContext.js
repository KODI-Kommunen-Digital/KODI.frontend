import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { setCookie, removeCookie } from './cookies/cookieServices';


const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [cityUsers, setCityUsers] = useState(null);

    const setLogin = (accessToken, refreshToken, userId, cityUsers, rememberMe) => {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setUserId(userId);
        setCityUsers(cityUsers);
        if (rememberMe) {
            window.localStorage.setItem("accessToken", accessToken);
            window.localStorage.setItem("refreshToken", refreshToken);
            window.localStorage.setItem("userId", userId);
            window.localStorage.setItem("cityUsers", JSON.stringify(cityUsers));
        } else {
            setCookie("accessToken", accessToken);
            setCookie("refreshToken", refreshToken);
            setCookie("userId", userId);
            setCookie("cityUsers", JSON.stringify(cityUsers));
        }
    };

    const setLogout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUserId(null);
        setCityUsers(null);
        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("refreshToken");
        window.localStorage.removeItem("userId");
        window.localStorage.removeItem("selectedItem");
        window.localStorage.removeItem("cityUsers");
        removeCookie("accessToken");
        removeCookie("refreshToken");
        removeCookie("userId");
        removeCookie("cityUsers");
    };

    const isAuthenticated = () => {
        return accessToken !== null && refreshToken !== null && userId !== null;
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                userId,
                cityUsers,
                setLogin,
                setLogout,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
