// frontend/src/pages/CategoriesPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/slices/postsSlice';

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

const CategoriesPage = () => {
    const dispatch = useDispatch();
    const { posts, isLoading, error } = useSelector((state) => state.posts);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        dispatch(fetchPosts({ keyword: '', category: selectedCategory }));
    }, [dispatch, selectedCategory]);

    const categories = ['Technology', 'Finance', 'Lifestyle', 'Career'];

    if (isLoading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    return (
        <div className="py-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                Browse by Categories
            </h1>

            {/* Category Filter Buttons */}
            <div className="flex justify-center mb-8 space-x-4">
                <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded-full font-medium transition duration-150 ${
                        selectedCategory === '' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    All Categories
                </button>
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full font-medium transition duration-150 ${
                            selectedCategory === category ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map(post => (
                    <BlogCard key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default CategoriesPage;
