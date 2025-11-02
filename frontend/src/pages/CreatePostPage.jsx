// frontend/src/pages/CreatePostPage.jsx
import React, { useState, forwardRef } from 'react';
import ReactQuill from 'react-quill'; // The rich text editor
import 'react-quill/dist/quill.snow.css'; // Quill editor styles
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Wrap ReactQuill with forwardRef to avoid findDOMNode warning
const QuillEditor = forwardRef((props, ref) => (
  <ReactQuill {...props} ref={ref} />
));

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // Stores HTML content from Quill
    const [category, setCategory] = useState('Technology');
    const [image, setImage] = useState(null); // For image file selection
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Check if user is logged in (Authentication Guard)
    const { userInfo } = useSelector((state) => state.user);
    if (!userInfo) return <Navigate to="/login" />;

    // Quill editor modules (for the toolbar)
    const modules = {
        toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{size: []}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'code-block'],
            ['clean']
        ],
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('category', category);
        if (image) formData.append('image', image);

        try {
            const response = await api.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Post created:', response.data);
            navigate('/'); // Redirect to home page after successful creation
        } catch (error) {
            console.error('Error creating post:', error.response?.data?.message || error.message);
            alert('Failed to create post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Write a New Blog Post</h1>
            <form onSubmit={submitHandler} className="space-y-6">
                
                {/* 1. Title Input */}
                <div>
                    <label className="block text-lg font-medium text-gray-700">Post Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="A concise, engaging title for your article"
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-xl font-semibold"
                    />
                </div>

                {/* 2. Content Editor (React Quill) */}
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Content (Quill.js Rich Editor)</label>
                    <div className="bg-white rounded-lg shadow-sm">
                        <QuillEditor
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            placeholder="Start writing your amazing article here..."
                            className="h-96 pb-12"
                        />
                    </div>
                </div>
                
                {/* 3. Category & Image Upload */}
                <div className="grid grid-cols-2 gap-6 pt-4">
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Category Tag</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="Technology">Technology</option>
                            <option value="Finance">Finance</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Career">Career</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Feature Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        {image && <p className="mt-1 text-xs text-gray-500">{image.name}</p>}
                    </div>
                </div>

                {/* 4. Submission Button */}
                <button
                    type="submit"
                    disabled={isLoading || !title || content === '<p><br></p>'}
                    className="w-full py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150"
                >
                    {isLoading ? 'Publishing...' : 'Publish Post'}
                </button>
            </form>
        </div>
    );
};

export default CreatePostPage;