import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DecodingInfo from "../DecodingInfo";

const LoginForm = ({ closeModal }) => {
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', {
                userEmail,
                password,
            });

            if (response.data && response.data.token) {
                const decodedToken = DecodingInfo(response.data.token);


                if (decodedToken) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userEmail', response.data.userEmail);
                    localStorage.setItem('userRole', decodedToken.role);

                    setUserEmail('');
                    setPassword('');

                    closeModal && closeModal();
                    navigate('/');
                } else {
                    setError("로그인 정보가 올바르지 않습니다.");
                }
            } else {
                setError("로그인 정보가 올바르지 않습니다.");
            }
        } catch (err) {
            setError("로그인 실패: 잘못된 이메일 또는 비밀번호입니다.");
        }
    };

    return (
        <form className="login-form" onSubmit={handleLogin}>
            <h2>로그인</h2>
            <div>
                <input
                    type="email"
                    placeholder="이메일"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">로그인</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default LoginForm;
