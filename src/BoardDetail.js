import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BoardDetail = () => {
    const { boardId } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchBoardDetail = async () => {
            try {
                const response = await axios.get(`/api/boards/${boardId}`);
                console.log(response.data.images); // 이미지 URL 확인
                setPost(response.data);
            } catch (error) {
                console.error("게시글 상세 정보 가져오기 실패:", error);
            }
        };

        fetchBoardDetail();
    }, [boardId]);

    if (!post) {
        return <p>게시글을 불러오는 중입니다...</p>;
    }

    const handleVote = async (type) => {
        try {
            await axios.post(`/api/boards/${boardId}/${type}`);
            alert(`${type.toUpperCase()} 투표가 반영되었습니다.`);
            const response = await axios.get(`/api/boards/${boardId}`);
            setPost(response.data);
        } catch (error) {
            console.error(`${type.toUpperCase()} 투표 실패:`, error);
            alert(`${type.toUpperCase()} 투표에 실패했습니다.`);
        }
    };

    return (
        <div style={styles.container}>
            <h1>{post.title}</h1>
            <p style={styles.meta}>
                작성자: {post.nickName} | 작성일: {new Date(post.createdTime).toLocaleDateString()} |
                MOM: {post.momCount} | Worst: {post.worstCount}
            </p>
            <div style={styles.content}>{post.content}</div>
            {/* 이미지 및 파일 렌더링 */}
            {post.fileUrls.map((fileUrl, index) => (
                fileUrl.endsWith(".mp4") ? (
                    <video key={index} controls style={styles.video}>
                        <source src={`/${fileUrl}`} type="video/mp4" />
                    </video>
                ) : (
                    <img
                        key={index}
                        src={`/${fileUrl}`}
                        alt={`Image ${index}`}
                        style={styles.image}
                    />
                )
            ))}

            <div style={styles.voteSection}>
                <button style={styles.voteButton} onClick={() => handleVote("mom")}>MOM</button>
                <button style={styles.voteButton} onClick={() => handleVote("worst")}>Worst</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
    },
    meta: {
        marginBottom: "20px",
        color: "#777",
        fontSize: "14px",
    },
    content: {
        marginBottom: "20px",
        fontSize: "16px",
        lineHeight: "1.6",
        color: "#333",
    },
    imageContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
    },
    image: {
        maxWidth: "100%",
        borderRadius: "8px",
    },
    fileContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
    },
    voteSection: {
        marginTop: "20px",
    },
    voteButton: {
        padding: "10px 20px",
        margin: "0 10px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default BoardDetail;
