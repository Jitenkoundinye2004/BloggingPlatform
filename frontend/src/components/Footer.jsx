// frontend/src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4">
                            <span className="text-indigo-400">DEV</span>BLOG
                        </h3>
                        <p className="text-gray-300 mb-4">
                            A platform for professional developers to share knowledge, insights, and experiences in the tech industry.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-indigo-400 transition duration-150">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-indigo-400 transition duration-150">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-indigo-400 transition duration-150">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-indigo-400 transition duration-150">
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-indigo-400 transition duration-150">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/search" className="text-gray-300 hover:text-indigo-400 transition duration-150">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link to="/create" className="text-gray-300 hover:text-indigo-400 transition duration-150">
                                    Create Post
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="text-gray-300 hover:text-indigo-400 transition duration-150">
                                    Profile
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Categories</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/search" className="text-gray-300 hover:text-indigo-400 transition duration-150">
                                    Technology
                                </Link>
                            </li>
                            <li>
                                <Link to="/search" className="text-gray-300 hover:text-indigo-400 transition duration-150">
                                    Finance
                                </Link>
                            </li>
                            <li>
                                <Link to="/search" className="text-gray-300 hover:text-indigo-400 transition duration-150">
                                    Lifestyle
                                </Link>
                            </li>
                            <li>
                                <Link to="/search" className="text-gray-300 hover:text-indigo-400 transition duration-150">
                                    Career
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-400">
                        &copy; {new Date().getFullYear()} DEV BLOG. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
