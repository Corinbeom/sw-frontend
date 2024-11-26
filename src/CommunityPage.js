import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PostFormModal from "./PostFormModal";

const CommunityPage = () => {
    const { league } = useParams(); // URL 파라미터에서 리그 이름 추출
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // 해당 리그의 게시글 목록 가져오기
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`/api/boards?league=${league}`);
                setPosts(response.data);
            } catch (error) {
                console.error("게시글 목록을 불러오는 중 오류 발생:", error);
            }
        };

        fetchPosts();
    }, [league]);

    const handlePostSubmit = (newPost) => {
        setPosts([newPost, ...posts]); // 새로운 게시글을 리스트 맨 앞에 추가
        setIsModalOpen(false);
    };

    const handleTitleClick = (boardId) => {
        navigate(`/boards/${boardId}`); // 상세 페이지로 이동
    };

    return (
        <div style={styles.container}>
            <h2>{league} 커뮤니티</h2>
            <button style={styles.createButton} onClick={() => setIsModalOpen(true)}>
                글 작성
            </button>
            <ul style={styles.postList}>
                {posts.map((post) => (
                    <li key={post.id} style={styles.postItem}>
                        <h3 style={styles.clickable} onClick={() => handleTitleClick(post.id)}>
                            {post.title}
                        </h3>
                        <p>{post.content}</p>
                        {post.imageUrl && <img src={post.imageUrl} alt="Post Image" />}
                        <span>작성자: {post.nickName}</span>
                    </li>
                ))}
            </ul>
            {isModalOpen && <PostFormModal league={league} onPostSubmit={handlePostSubmit} />}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
    },
    createButton: {
        padding: "10px 20px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    postList: {
        listStyle: "none",
        padding: 0,
    },
    postItem: {
        borderBottom: "1px solid #ddd",
        marginBottom: "10px",
        paddingBottom: "10px",
    },
    clickable: {
        cursor: "pointer",
        color: "#007BFF",
        textDecoration: "underline",
    },
};

export default CommunityPage;
