import React, {useContext, useState} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import AuthContext from "./AuthContext";
import LoginForm from "./login/LoginForm";

function MainNavigation() {
    const navigate = useNavigate();
    const {auth} = useContext(AuthContext);

    const [isLoginOpen, setIsLoginOpen] = useState(false); // 로그인 모달 상태

    const openLoginModal = () => setIsLoginOpen(false);
    const closeLoginModal = () => setIsLoginOpen(false); // 로그인 모달 닫기

    const navigateToHome = () => {
        navigate('/');
    }

    return (
        <>
            <img
                src="/img/mainlogo.png"
                alt="Main Logo"
                onClick={navigateToHome} // 이미지 클릭 시 메인 페이지로 이동
                style={{cursor: 'pointer', width: '150px'}} // 원하는 스타일 추가
            />
            <nav className='test-container'>
                <ul className='backend-test'>
                    <li>
                        <NavLink to="/register">회원가입</NavLink></li>
                    {!auth.token && (
                        <li>
                            <button onClick={openLoginModal}>로그인</button>
                        </li>
                    )}
                    <li><NavLink to="/matchList">리그 별 매치 업 리스트 보기</NavLink></li>
                    {auth.token && (
                        <>
                            <li>
                                <NavLink to="/userProfile">유저 프로필(미사용)</NavLink>
                            </li>
                            <li>
                                <NavLink to="/">리그 게시판 선택</NavLink>
                            </li>
                            <li>
                                {/*<NavLink to="/">게시판 입장</NavLink>*/}
                            </li>
                            <li>
                                <LogoutButton/>
                            </li>
                        </>
                    )}
                    <LoginForm
                        isOpen={isLoginOpen}
                        onClose={closeLoginModal}
                    />
                </ul>
            </nav>
        </>

    );
}

export default MainNavigation;
