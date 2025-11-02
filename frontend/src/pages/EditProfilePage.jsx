// frontend/src/pages/EditProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSave, FaArrowLeft, FaCamera, FaCheck, FaTimes } from 'react-icons/fa';
import api from '../api/axios';
import { updateProfileRequest, updateProfileSuccess, updateProfileFail } from '../redux/slices/userSlice';
import { hasFace } from '../utils/faceDetection';

const EditProfilePage = () => {
    const { userInfo, isLoading, error } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePicture: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [profilePicPreview, setProfilePicPreview] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [faceDetected, setFaceDetected] = useState(null);
    const [isDetectingFace, setIsDetectingFace] = useState(false);

    useEffect(() => {
        if (userInfo) {
            setFormData({
                username: userInfo.username || '',
                email: userInfo.email || '',
                password: '',
                confirmPassword: '',
                profilePicture: userInfo.profilePicture || ''
            });
        }
    }, [userInfo]);

    // Authentication Check
    if (!userInfo) {
        return <Navigate to="/login" />;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = async (e) => {
                const imageSrc = e.target.result;
                setProfilePicPreview(imageSrc);

                // Detect face in the uploaded image
                setIsDetectingFace(true);
                try {
                    const faceFound = await hasFace(imageSrc);
                    setFaceDetected(faceFound);
                } catch (error) {
                    console.error('Face detection error:', error);
                    setFaceDetected(false);
                } finally {
                    setIsDetectingFace(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (formData.password && formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        dispatch(updateProfileRequest());

        try {
            const updateData = new FormData();
            updateData.append('username', formData.username);
            updateData.append('email', formData.email);

            if (selectedFile) {
                updateData.append('profilePicture', selectedFile);
            } else if (formData.profilePicture) {
                updateData.append('profilePicture', formData.profilePicture);
            }

            if (formData.password) {
                updateData.append('password', formData.password);
            }

            const response = await api.put('/users/profile', updateData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            dispatch(updateProfileSuccess(response.data));
            navigate('/profile');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            dispatch(updateProfileFail(errorMessage));
        }
    };

    return (
        <div className="py-8 max-w-4xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Profile
                </button>
                <h1 className="text-4xl font-extrabold text-gray-900">Edit Profile</h1>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative">
                            {profilePicPreview || formData.profilePicture ? (
                                <img
                                    src={profilePicPreview || formData.profilePicture}
                                    alt="Profile Preview"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
                                />
                            ) : (
                                <FaUserCircle className="w-32 h-32 text-gray-400" />
                            )}
                            <label
                                htmlFor="fileInput"
                                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700"
                            >
                                <FaCamera className="w-4 h-4" />
                            </label>
                            <input
                                type="file"
                                id="fileInput"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {isDetectingFace && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                    <div className="text-white text-sm">Detecting...</div>
                                </div>
                            )}
                    
                        </div>
                      
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900">Update Your Information</h2>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    formErrors.username ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter your username"
                            />
                            {formErrors.username && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter your email"
                            />
                            {formErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                            )}
                        </div>
                    </div>

                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password (Optional)
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    formErrors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter new password"
                            />
                            {formErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Confirm new password"
                            />
                            {formErrors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaSave className="mr-2" />
                            {isLoading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;
