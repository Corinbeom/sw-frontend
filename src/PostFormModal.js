import React, { useState } from "react";
import axios from "axios";

const PostFormModal = ({ league, onPostSubmit }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("league", league);
        Array.from(images).forEach((image) => {
            formData.append("images", image); // 파일 추가
        });

        try {
            const response = await axios.post("/api/boards", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("게시글 작성 성공!");
            onPostSubmit(response.data);
        } catch (error) {
            console.error("게시글 작성 중 오류:", error);
            alert("게시글 작성 실패!");
        }
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        console.log("Selected files:", files); // 선택된 파일 로그 출력
        setImages(files); // 상태에 파일 저장
    };

    return (
        <div style={styles.modal}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h3>글 작성 ({league})</h3>
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
                    accept="image/*, video/*"
                    onChange={handleImageChange}
                    style={styles.fileInput}
                />
                <button type="submit" style={styles.submitButton}>
                    작성하기
                </button>
            </form>
        </div>
    );
};

const styles = {
    modal: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    input: {
        marginBottom: "10px",
        padding: "10px",
    },
    textarea: {
        marginBottom: "10px",
        padding: "10px",
        minHeight: "100px",
    },
    fileInput: {
        marginBottom: "10px",
    },
    submitButton: {
        padding: "10px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default PostFormModal;
