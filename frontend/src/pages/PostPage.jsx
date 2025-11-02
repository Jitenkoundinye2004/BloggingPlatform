// frontend/src/pages/PostPage.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DOMPurify from 'dompurify'; // Essential for rendering user-submitted HTML safely
import { FaHeart, FaComment, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { fetchPost } from '../redux/slices/postSlice';
import CommentsSection from '../components/CommentsSection';


const PostPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentPost, isLoading, error } = useSelector((state) => state.post);

    useEffect(() => {
        if (id) {
            dispatch(fetchPost(id));
        }
    }, [dispatch, id]);

    if (isLoading) return <div className="text-center py-20 text-xl font-semibold">Loading Post...</div>;
    if (error) return <div className="text-center py-20 text-xl font-semibold text-red-600">{error}</div>;
    if (!currentPost) return <div className="text-center py-20 text-xl font-semibold text-red-600">Post Not Found</div>;

    // Sanitize the HTML content before injecting it into the DOM
    const sanitizedHtml = DOMPurify.sanitize(currentPost.content);

    return (
        <article className="py-8 max-w-5xl mx-auto">
            {/* Post Header */}
            <div className="text-center mb-8">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full uppercase mb-3">{currentPost.category}</span>
                <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">{currentPost.title}</h1>
                <div className="flex justify-center items-center text-gray-600 space-x-4 text-sm">
                    <span className="flex items-center"><FaUser className="mr-1" /> {currentPost.user?.username}</span>
                    <span className="flex items-center"><FaCalendarAlt className="mr-1" /> {new Date(currentPost.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center text-red-500"><FaHeart className="mr-1" /> {currentPost.likes?.length || 0}</span>
                </div>
            </div>

            {/* Feature Image */}
            {currentPost.image && (
                <img src={currentPost.image} alt={currentPost.title} className="w-full h-auto object-cover rounded-xl mb-10 shadow-lg" />
            )}

            {/* Post Content (Rendering Sanitized HTML) */}
            <div
                className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            >
            </div>

            <hr className="my-10" />

            {/* Comments and Likes System */}
            <CommentsSection postId={id} />

        </article>
    );
};

export default PostPage;