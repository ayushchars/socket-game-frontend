import React, { useEffect, useState } from 'react';
import { authAxios } from '../../config/config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { FaTrash } from 'react-icons/fa';
import { BsCircleFill } from 'react-icons/bs';
import IsLoadingHOC from '../../utils/IsLoadingHOC';

function Users({ onSelectUser, selectedUser,users,setUsers,setLoading }) {

  const storedUser = JSON.parse(localStorage.getItem('userDetail'));
  const loggedInUserName = storedUser?.name || 'User';
  const userRole = storedUser?.role || 'USER';

  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const handleRankingUpdate = (updatedList) => {
      setUsers(updatedList);
    };

    socket.on('ranking:update', handleRankingUpdate);

    return () => {
      socket.off('ranking:update', handleRankingUpdate);
    };
  }, [socket]);

  const handleLogout = () => {
    navigate('/');
    localStorage.removeItem('token');
    localStorage.removeItem('userDetail');
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    setLoading(true)
    try {
      const { data } = await authAxios().post(`/auth/deleteuserbyid`, { id });

      if (data.status === 1) {
        toast.success(data.message);
        setUsers(prev => prev.filter(user => user._id !== id));
      } else {
        toast.error(data.message || 'Failed to delete user');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting user');
      console.error('Delete error:', error);
    }
    finally{setLoading(false)}
  };

  return (
    <div className="bg-white h-full p-4">
      <div className="flex justify-between items-center mb-6 p-4 bg-blue-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">Hello {loggedInUserName}</h2>
        <button
          onClick={handleLogout}
          className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
        >
          Logout
        </button>
      </div>

      {userRole === 'ADMIN' && (
        <button
          onClick={() => navigate('/create-user')}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4 transition duration-300"
        >
          + Create User
        </button>
      )}

      <h1 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
        Leaderboard
      </h1>

      {users.map(user => (
        <div
          key={user._id}
          onClick={() => onSelectUser(user)}
          className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-100 ${selectedUser?._id === user._id ? 'bg-gray-200' : ''}`}
        >
          <div className="flex items-center gap-2">
            <img src="/avatar.jpg" alt="avatar" className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-500">Points: {user.points}</p>
            </div>
          </div>

          {userRole === 'ADMIN' && (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs">
                <BsCircleFill className={user.isOnline ? 'text-green-500' : 'text-gray-400'} />
                {user.isOnline ? 'online' : 'offline'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteUser(user._id);
                }}
                title="Delete User"
                className="text-red-500 hover:text-red-700 text-base"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default IsLoadingHOC(Users);
