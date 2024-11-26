import React, { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        userEmail: "",
        verificationCode: "",
        password: "",
        nickName: "",
        birthDate: "",
    });
    const [emailVerified, setEmailVerified] = useState(false); // 이메일 중복 확인 여부
    const [emailSent, setEmailSent] = useState(false); // 인증 메일 전송 여부
    const [codeVerified, setCodeVerified] = useState(false); // 인증 코드 확인 여부
    const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrorMessage(""); // 오류 메시지 초기화
    };

    const checkEmailDuplication = async () => {
        try {
            const response = await axios.get("/api/auth/check-email", {
                params: { userEmail: formData.userEmail },
            });

            if (response.data) {
                setEmailVerified(true);
                setErrorMessage("");
                alert("이메일 사용이 가능합니다.");
            } else {
                setEmailVerified(false);
                setErrorMessage("이미 사용 중인 이메일입니다.");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("이메일 중복 확인 중 오류가 발생했습니다.");
        }
    };

    const sendVerificationEmail = async () => {
        try {
            await axios.post("/api/auth/send-email", { userEmail: formData.userEmail });
            setEmailSent(true);
            alert("인증 코드가 이메일로 전송되었습니다. 확인해 주세요.");
        } catch (error) {
            console.error(error);
            alert("인증 코드 전송 중 오류가 발생했습니다.");
        }
    };

    const verifyCode = async () => {
        try {
            const response = await axios.post("/api/auth/verify-email", {
                userEmail: formData.userEmail,
                code: formData.verificationCode,
            });
            if (response.data) {
                setCodeVerified(true);
                alert("인증에 성공했습니다!");
            } else {
                setCodeVerified(false);
                alert("잘못된 인증 코드입니다.");
            }
        } catch (error) {
            console.error(error);
            alert("인증 코드 확인 중 오류가 발생했습니다.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                {!codeVerified && (
                    <>
                        <div style={styles.inputGroup}>
                            <label htmlFor="userEmail">이메일:</label>
                            <input
                                type="email"
                                id="userEmail"
                                name="userEmail"
                                value={formData.userEmail}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                            <button
                                type="button"
                                onClick={checkEmailDuplication}
                                style={styles.button}
                                disabled={!formData.userEmail}
                            >
                                중복 확인
                            </button>
                        </div>
                        {errorMessage && <p style={styles.error}>{errorMessage}</p>}

                        {emailVerified && !emailSent && (
                            <div style={styles.inputGroup}>
                                <button type="button" onClick={sendVerificationEmail} style={styles.button}>
                                    인증 메일 전송
                                </button>
                            </div>
                        )}

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
                                <button
                                    type="button"
                                    onClick={verifyCode}
                                    style={styles.button}
                                    disabled={!formData.verificationCode}
                                >
                                    인증 코드 확인
                                </button>
                            </div>
                        )}
                    </>
                )}

                {codeVerified && (
                    <>
                        <div style={styles.inputGroup}>
                            <label htmlFor="password">비밀번호:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
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
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="birthDate">생일:</label>
                            <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>
                        <button type="submit" style={styles.button}>
                            회원가입
                        </button>
                    </>
                )}
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
