import React, { useContext } from 'react';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LogoutButton() {
    const { auth, updateAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        // 서버에 로그아웃 이벤트를 알림
        try {
            await axios.post('/api/logout', { userEmail: auth.userEmail });
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }


        // 로컬 스토리지에서 인증 정보 제거
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');

        // Auth 상태 업데이트
        updateAuth({ token: null, userEmail: null, userRole: null });

        alert('로그아웃 하였습니다.');
        navigate('/');
    };

    return (
        <button onClick={handleLogout}>로그아웃</button>
    );
}

export default LogoutButton;
