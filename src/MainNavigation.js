import React from "react";
import {Link, useNavigate} from "react-router-dom";

function MainNavigation() {
    const navigate = useNavigate();

    const navigateToHome = () => {
        navigate('/');
    }

    return (
        <>
            <nav>
                <img
                    src="../src/logo.svg"
                    alt="logo"
                    onClick={navigateToHome}
                    style={{ cursor: "pointer", width: "150px" }}
                />
                <ul>
                    <li>
                        <Link to="/matchList">리그 별 매치 리스트업 보기</Link>
                    </li>
                    <li>
                        <Link to="/register">회원가입</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default MainNavigation;