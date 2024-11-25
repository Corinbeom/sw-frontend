import React, { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        userId: "",
        nickName: "",
        userEmail: "",
        password: "",
        verificationCode: "",
    });

    const [emailVerified, setEmailVerified] = useState(false);
    const [conditionsMet, setConditionsMet] = useState({
        userId: false,
        nickName: false,
        userEmail: false,
        password: false,
        verificationCode: false,
    });

    const [emailSent, setEmailSent] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const checkCondition = async (conditionName, endpoint, value) => {
        try {
            const response = await axios.get(endpoint, { params: { [conditionName]: value } });
            setConditionsMet((prev) => ({ ...prev, [conditionName]: response.data }));
            if (!response.data) {
                alert(`${conditionName}은(는) 이미 사용 중입니다.`);
            }
        } catch (error) {
            console.error(error);
            alert(`${conditionName} 확인 중 오류가 발생했습니다.`);
        }
    };

    const sendVerificationEmail = async () => {
        try {
            await axios.post("/api/auth/send-email", { userEmail: formData.userEmail });
            setEmailSent(true);
            alert("인증 코드가 이메일로 전송되었습니다. 확인해 주세요.");
        } catch (error) {
            console.error(error);
            alert("이메일 인증 코드 전송 중 오류가 발생했습니다.");
        }
    };

    const verifyEmailCode = async () => {
        try {
            const response = await axios.post("/api/auth/verify-email", {
                userEmail: formData.userEmail,
                code: formData.verificationCode,
            });
            setEmailVerified(response.data);
            setConditionsMet((prev) => ({ ...prev, verificationCode: response.data }));
            if (response.data) {
                alert("이메일 인증에 성공했습니다!");
            } else {
                alert("잘못된 인증 코드입니다.");
            }
        } catch (error) {
            console.error(error);
            alert("이메일 인증 코드 확인 중 오류가 발생했습니다.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allConditionsMet = Object.values(conditionsMet).every((condition) => condition);
        if (!allConditionsMet) {
            alert("모든 조건을 충족해야 회원가입이 가능합니다.");
            return;
        }

        try {
            await axios.post("/api/auth/register", formData);
            alert("회원가입이 완료되었습니다!");
        } catch (error) {
            console.error(error);
            alert("회원가입 중 오류가 발생했습니다.");
        }
    };

    return (
        <div style={styles.container}>
            <h2>회원가입</h2>
            <form style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label htmlFor="userId">아이디:</label>
                    <input
                        type="text"
                        id="userId"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        onBlur={() => checkCondition("userId", "/api/auth/check-id", formData.userId)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="nickName">닉네임:</label>
                    <input
                        type="text"
                        id="nickName"
                        name="nickName"
                        value={formData.nickName}
                        onChange={handleChange}
                        onBlur={() => checkCondition("nickName", "/api/auth/check-nickname", formData.nickName)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="userEmail">이메일:</label>
                    <input
                        type="email"
                        id="userEmail"
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleChange}
                        onBlur={() => checkCondition("userEmail", "/api/auth/check-email", formData.userEmail)}
                        required
                        style={styles.input}
                    />
                    {!emailSent && (
                        <button type="button" onClick={sendVerificationEmail} style={styles.button}>
                            인증 코드 보내기
                        </button>
                    )}
                </div>
                {emailSent && (
                    <div style={styles.inputGroup}>
                        <label htmlFor="verificationCode">인증 코드:</label>
                        <input
                            type="text"
                            id="verificationCode"
                            name="verificationCode"
                            value={formData.verificationCode}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                        {!emailVerified && (
                            <button type="button" onClick={verifyEmailCode} style={styles.button}>
                                인증 코드 확인
                            </button>
                        )}
                    </div>
                )}
                <div style={styles.inputGroup}>
                    <label htmlFor="password">비밀번호:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => {
                            handleChange(e);
                            setConditionsMet((prev) => ({ ...prev, password: e.target.value.length >= 8 }));
                        }}
                        required
                        style={styles.input}
                    />
                    {formData.password.length < 8 && (
                        <p style={styles.error}>비밀번호는 8자 이상이어야 합니다.</p>
                    )}
                </div>
                <button
                    type="submit"
                    style={{
                        ...styles.button,
                        backgroundColor: Object.values(conditionsMet).every((condition) => condition) ? "#007BFF" : "#CCC",
                    }}
                    disabled={!Object.values(conditionsMet).every((condition) => condition)}
                >
                    회원가입
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "500px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    inputGroup: {
        marginBottom: "15px",
    },
    input: {
        width: "100%",
        padding: "8px",
        borderRadius: "5px",
        border: "1px solid #ddd",
    },
    button: {
        marginTop: "10px",
        padding: "10px 15px",
        border: "none",
        borderRadius: "5px",
        backgroundColor: "#007BFF",
        color: "#fff",
        cursor: "pointer",
    },
    error: {
        color: "red",
        fontSize: "12px",
    },
};

export default RegisterForm;
