// frontend/src/pages/AdminDashboardPage.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { FaChartLine, FaTrashAlt, FaUsers } from 'react-icons/fa';

const AdminDashboardPage = () => {
    const { userInfo } = useSelector((state) => state.user);

    // Access Control (Critical professional step)
    if (!userInfo || !userInfo.isAdmin) {
        // Redirect non-admins or unauthenticated users
        return <Navigate to="/" />; 
    }

    return (
        <div className="py-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-extrabold text-red-700 mb-8 border-b pb-2">ADMINISTRATION DASHBOARD</h1>
            <p className="text-gray-600 text-xl mb-10">Manage all posts, users, and system health.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AdminCard 
                    icon={FaChartLine} 
                    title="System Analytics" 
                    description="View traffic and usage statistics."
                    color="bg-indigo-100 text-indigo-800"
                />
                <AdminCard 
                    icon={FaTrashAlt} 
                    title="Manage Posts" 
                    description="Review, edit, or delete all user submissions."
                    color="bg-yellow-100 text-yellow-800"
                />
                <AdminCard 
                    icon={FaUsers} 
                    title="Manage Users" 
                    description="Update roles and review user profiles."
                    color="bg-green-100 text-green-800"
                />
            </div>
            
            <div className="mt-12 p-8 bg-white rounded-xl shadow-xl border border-red-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Actions</h2>
                <p className="text-red-600">
                    *This is where tables for post management and user management would be built, including **delete** functionality and **status updates**.*
                </p>
            </div>
        </div>
    );
};

// Helper Card Component
const AdminCard = ({ icon, title, description, color }) => {
  const IconComponent = icon;
  return (
    <div className={`p-6 rounded-xl shadow-lg flex items-center space-x-4 ${color}`}>
        <IconComponent className="text-4xl" />
        <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm mt-1">{description}</p>
        </div>
    </div>
  );
};

export default AdminDashboardPage;