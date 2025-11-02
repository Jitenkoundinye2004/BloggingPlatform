// frontend/src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/userSlice';
import { FaSignOutAlt, FaPlusSquare, FaUserCircle } from 'react-icons/fa'; // Requires 'react-icons' package

const Header = () => {
    const { userInfo } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo/Brand */}
                <Link to="/" className="text-2xl font-extrabold text-indigo-600 tracking-wider">
                    <span className="text-gray-900">DEV</span>BLOG
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex space-x-6 items-center">
                    <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-150">
                        Home
                    </Link>
                    <Link to="/search" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-150">
                        Categories
                    </Link>
                    {/* Only show 'Create Post' if logged in */}
                    {userInfo && (
                        <Link 
                            to="/create" 
                            className="flex items-center text-green-600 hover:text-green-700 font-bold transition duration-150"
                        >
                            <FaPlusSquare className="mr-1" />
                            Create Post
                        </Link>
                    )}
                </nav>

                {/* Auth/Profile Actions */}
                <div className="flex items-center space-x-4">
                    {userInfo ? (
                        <>
                            {/* User Profile Dropdown Placeholder (Industry Level) */}
                            <Link to="/profile" className="flex items-center text-gray-700 hover:text-indigo-600 transition duration-150">
                                <FaUserCircle className="text-xl mr-1" />
                                {userInfo.username}
                            </Link>

                            <button 
                                onClick={logoutHandler}
                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full text-sm font-semibold transition duration-150 flex items-center"
                            >
                                <FaSignOutAlt className="mr-1" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium">
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-full font-medium transition duration-150 shadow-md"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;