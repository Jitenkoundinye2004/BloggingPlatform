// frontend/src/pages/RegisterPage.jsx (Structure is similar to LoginPage.jsx)
// Use the same imports (useState, useEffect, useDispatch, useSelector, useNavigate, Link, api)
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginRequest, loginSuccess, loginFail } from '../redux/slices/userSlice';
import api from '../api/axios';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo, isLoading, error } = useSelector((state) => state.user);

    // Redirect if already logged in
    useEffect(() => {
        if (userInfo) navigate('/');
        if (error) dispatch({ type: 'user/loginFail', payload: null });
    }, [userInfo, navigate, error, dispatch]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (password !== confirmPassword) {
            return setLocalError('Passwords do not match');
        }

        dispatch(loginRequest()); // Use the same loading state action

        try {
            const { data } = await api.post('/users/register', { username, email, password });
            
            dispatch(loginSuccess(data)); // Registration success also means logged in
            navigate('/');
        } catch (err) {
            const errMsg = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;
            dispatch(loginFail(errMsg));
            setLocalError(errMsg);
        }
    };
    
    // RENDER: Use the same Tailwind structure as LoginPage, 
    // but include the 'username' and 'confirmPassword' fields.
    // The main difference is the `submitHandler` and the form fields.
    
    return (
         <div className="flex justify-center items-center py-12">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Create Your Account</h2>
                
                {/* ... Error/Loading blocks ... */}
                {(error || localError) && ( /* Error rendering */
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error || localError}</span>
                    </div>
                )}
                
                <form onSubmit={submitHandler} className="space-y-6">
                    {/* Username Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {/* Confirm Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;