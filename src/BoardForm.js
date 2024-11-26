import React, { useState } from "react";
import axios from "axios";

const BoardForm = ({ onBoardCreated }) => {
    const [league, setLeague] = useState(""); // 선택된 리그
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [error, setError] = useState("");

    const leagues = [
        { name: "EPL", emblem: "/emblems/epl-logo.png" },
        { name: "LaLiga", emblem: "/emblems/laliga-logo.png" },
        { name: "Bundesliga", emblem: "/emblems/bundes-logo.png" },
        { name: "Serie A", emblem: "/emblems/Serie-A-logo.png" },
        { name: "Ligue 1", emblem: "/emblems/Ligue1-logo.png" },
        { name: "K League", emblem: "/emblems/K-league-logo.png" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!league) {
            setError("리그를 선택해주세요!");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("league", league);
        images.forEach((image) => formData.append("images", image));

        try {
            const response = await axios.post(`/api/boards`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("게시글 작성 성공!");
            onBoardCreated(response.data); // 새 게시글 추가
            setTitle("");
            setContent("");
            setImages([]);
            setLeague("");
        } catch (error) {
            console.error("게시글 작성 중 오류:", error);
            setError("게시글 작성 실패!");
        }
    };

    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    return (
        <div style={styles.container}>
            <h2>게시글 작성</h2>
            <div style={styles.leagueContainer}>
                {leagues.map((lg) => (
                    <div
                        key={lg.name}
                        style={{
                            ...styles.leagueButton,
                            border: league === lg.name ? "3px solid blue" : "1px solid gray",
                        }}
                        onClick={() => setLeague(lg.name)}
                    >
                        <img
                            src={lg.emblem}
                            alt={lg.name}
                            style={styles.leagueImage}
                        />
                    </div>
                ))}
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={styles.input}
                    required
                />
                <textarea
                    placeholder="내용"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={styles.textarea}
                    required
                />
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={styles.fileInput}
                />
                <button type="submit" style={styles.submitButton}>
                    게시글 작성
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
    },
    leagueContainer: {
        display: "flex",
        justifyContent: "space-around",
        marginBottom: "20px",
    },
    leagueButton: {
        width: "80px",
        height: "80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        borderRadius: "50%",
    },
    leagueImage: {
        width: "100%",
        height: "100%",
        objectFit: "contain",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    input: {
        marginBottom: "10px",
        padding: "10px",
        fontSize: "16px",
    },
    textarea: {
        marginBottom: "10px",
        padding: "10px",
        fontSize: "16px",
        minHeight: "100px",
    },
    fileInput: {
        marginBottom: "10px",
    },
    submitButton: {
        padding: "10px 20px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    error: {
        color: "red",
        marginBottom: "10px",
    },
};

export default BoardForm;
