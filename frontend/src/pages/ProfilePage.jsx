// frontend/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaUserCircle, FaEdit, FaCalendarAlt } from 'react-icons/fa';
import api from '../api/axios';

// Placeholder for a card displaying one of the user's posts
const AuthoredPostCard = ({ _id, title, createdAt }) => (
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
        <h4 className="text-lg font-semibold text-indigo-700">{title}</h4>
        <p className="text-sm text-gray-500 mt-1 flex items-center"><FaCalendarAlt className="mr-1" /> Published: {new Date(createdAt).toLocaleDateString()}</p>
        <Link to={`/post/${_id}`} className="mt-2 text-sm text-blue-500 hover:text-blue-700 flex items-center"><FaEdit className="mr-1" /> View/Edit</Link>
    </div>
);

const ProfilePage = () => {
    const { userInfo } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [authoredPosts, setAuthoredPosts] = useState([]); // User's posts
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!userInfo?._id) return;
            setIsLoading(true);
            try {
                const response = await api.get(`/posts/user/${userInfo._id}`);
                setAuthoredPosts(response.data.posts || []);
            } catch (error) {
                console.error('Error fetching user posts:', error);
                setAuthoredPosts([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserPosts();
    }, [userInfo?._id]);

    // Authentication Check
    if (!userInfo) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="py-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-2">User Profile & Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1 bg-white p-8 rounded-xl shadow-xl h-fit">
                    <div className="flex flex-col items-center">
                        {userInfo.profilePicture ? (
                            <img
                                src={userInfo.profilePicture}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-indigo-500"
                            />
                        ) : (
                            <FaUserCircle className="text-8xl text-indigo-500 mb-4" />
                        )}
                        <h2 className="text-3xl font-bold text-gray-900">{userInfo.username}</h2>
                        <p className="text-md text-gray-600 flex items-center mt-2"><FaEnvelope className="mr-2" /> {userInfo.email}</p>
                        {userInfo.isAdmin && (
                            <span className="mt-4 px-3 py-1 bg-red-100 text-red-700 font-semibold rounded-full text-sm">ADMIN</span>
                        )}
                        <button
                            onClick={() => navigate('/profile/edit')}
                            className="mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

ic                {/* Authored Blogs Section */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Your Authored Blogs ({authoredPosts.length})</h2>
                    {isLoading ? (
                        <p>Loading your posts...</p>
                    ) : authoredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {authoredPosts.map(post => (
                                <AuthoredPostCard key={post._id} {...post} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">You haven't published any posts yet. <Link to="/create" className="text-indigo-600">Start writing!</Link></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;