import Cookie from 'js-cookie';

export const setCookie = (cookieName, value) => {
    Cookie.set(cookieName, value, {
        expires: 1,
        secure: true,
        sameSite: 'strict',
        path: '/'
    });
}

export const getCookie = (cookieName) => {
    return Cookie.get(cookieName);
}

export const getAllCookies = () => {
    return Cookie.get();
}

export const removeCookie = (cookieName) => {
    Cookie.remove(cookieName);
}
