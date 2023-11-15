import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { setCookie, removeCookie, getCookie } from './cookies/cookieServices';


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
        window.sessionStorage.removeItem("selectedItem");
        removeCookie("accessToken");
        removeCookie("refreshToken");
        removeCookie("userId");
        removeCookie("cityUsers");
    };

    const getAccessToken = () => {
        const accessToken = window.localStorage.getItem("accessToken") || getCookie("accessToken");
        if (accessToken) {
            return accessToken;
        } else {
            return null;
        }
    }

    const getRefreshToken = () => {
        const refreshToken = window.localStorage.getItem("refreshToken") || getCookie("refreshToken");
        if (refreshToken) {
            return refreshToken;
        } else {
            return null;
        }
    }

    const getUserId = () => {
        const userId = window.localStorage.getItem("userId") || getCookie("userId");
        if (userId) {
            return userId;
        } else {
            return null;
        }
    }

    const isAuthenticated = () => {
        return accessToken !== getAccessToken() && refreshToken !== getRefreshToken() && userId !== getUserId();
    };

    return (
        <AuthContext.Provider
            value={{
                cityUsers,
                setLogin,
                setLogout,
                isAuthenticated,
                getAccessToken,
                getRefreshToken,
                getUserId
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
