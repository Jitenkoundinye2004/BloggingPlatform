// frontend/src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/slices/postsSlice';

// Placeholder components for structure
const FeaturedPost = ({ post }) => (
    <div className="bg-white shadow-xl rounded-lg p-6 border-l-4 border-indigo-600 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-4">{post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...</p>
        <Link to={`/post/${post._id}`} className="text-indigo-600 hover:text-indigo-800 font-semibold">
            Read Full Article &rarr;
        </Link>
    </div>
);

const BlogCard = ({ post }) => (
    <div className="bg-white shadow-md hover:shadow-lg transition duration-300 rounded-lg overflow-hidden">
        <img src={post.image || `https://picsum.photos/400/200?random=${post._id}`} alt={post.title} className="w-full h-40 object-cover" />
        <div className="p-4">
            <span className="text-sm font-medium text-indigo-600 uppercase">{post.category}</span>
            <h3 className="text-xl font-semibold text-gray-900 mt-1 mb-2 line-clamp-2">{post.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-3">{post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
            <Link to={`/post/${post._id}`} className="mt-3 inline-block text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                Continue Reading
            </Link>
        </div>
    </div>
);

const HomePage = () => {
    const dispatch = useDispatch();
    const { posts, isLoading, error } = useSelector((state) => state.posts);
    const { userInfo } = useSelector((state) => state.user);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        dispatch(fetchPosts({ keyword: '', category: '' }));
    }, [dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(fetchPosts({ keyword, category }));
    };

    if (isLoading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    return (
        <div className="py-8">
            {/* 1. Hero Section */}
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                Welcome to the Blogging Platform
            </h1>

            {/* 2. Search and Filter Bar */}
            <form onSubmit={handleSearch} className="flex justify-between items-center mb-8 p-4 bg-gray-100 rounded-lg shadow-inner">
                <input
                    type="search"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search posts, authors, or tags..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="ml-4 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">All Categories</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Career">Career</option>
                </select>
                <button type="submit" className="ml-4 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700">
                    Search
                </button>
            </form>

            {/* 3. Posts Grid */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map(post => (
                    <BlogCard key={post._id} post={post} />
                ))}
            </div>

            {/* 4. Call to Action (CTA) */}
            {!userInfo && (
                <div className="mt-12 text-center p-10 bg-indigo-50 rounded-lg shadow-inner">
                    <h3 className="text-2xl font-bold text-indigo-800 mb-3">Ready to share your knowledge?</h3>
                    <p className="text-indigo-700 mb-6">Join our community of professional developers and start publishing your articles today.</p>
                    <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300">
                        Get Started Now
                    </Link>
                </div>
            )}
        </div>
    );
};

export default HomePage;