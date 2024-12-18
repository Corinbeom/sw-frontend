import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(); // 인증 컨텍스트 생성

export const useAuth = () => useContext(AuthContext); // 인증 컨텍스트 사용 훅

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token') || null,
        userEmail: localStorage.getItem('userEmail') || null,
        userRole: localStorage.getItem('userRole') || null
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('userEmail');
        const userRole = localStorage.getItem('userRole');

        if (token && userEmail && userRole) {
            setAuth({
                token,
                userEmail,
                userRole
            });
        } else {
            console.warn("토큰이 유효하지 않음, 상태 초기화 생략");
        }
    }, []);


    // updateAuth에서 null도 허용하도록 처리
    const updateAuth = (newAuth) => {
        if (newAuth && newAuth.token !== null) {
            localStorage.setItem('token', newAuth.token);
            localStorage.setItem('userEmail', newAuth.userEmail);
            localStorage.setItem('userRole', newAuth.userRole);
            setAuth(newAuth);
        } else if (newAuth && newAuth.token === null) {
            // 로그아웃 시에는 그대로 상태를 null로 업데이트
            setAuth({
                token: null,
                userEmail: null,
                userRole: null
            });
        } else {
            console.error("Received invalid auth data:", newAuth);
        }
    };

    const logout = () => {
        localStorage.clear(); // 로컬 스토리지 비우기
        updateAuth({ token: null, userEmail: null, userRole: null });
    };

    return (
        <AuthContext.Provider value={{ auth, updateAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
