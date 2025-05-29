import React, { useEffect, useState, useCallback } from 'react';
import { authAxios } from '../../config/config';
import { toast } from 'react-toastify';

import { FaUser, FaBan, FaCheckCircle } from 'react-icons/fa';
import { BsCircleFill } from 'react-icons/bs';
import IsLoadingHOC from '../../utils/IsLoadingHOC';


function UserDetail({ selectedUser,refetchUsers,setLoading }) {
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const BASE_URL = import.meta.env.VITE_REACT_APP_BASEURL


  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await authAxios().post(
        `${baseUrl}/auth/getuserbyid`,
        { id: selectedUser?._id }
      );
      setUser(data?.data);
      setEditedUser(data?.data);
    } catch (error) {
      toast.error('Error fetching user data');
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  const toggleBlockStatus = async () => {
    if (!user) return;
    setUpdating(true);
    setLoading(true)
    try {
      const { data } = await authAxios().post(
        `${baseUrl}/auth/block`,
        { id: user._id, isBlocked: !user.isBlocked }
      );

      if (data?.status === 1) {
        toast.success(user.isBlocked ? 'User unblocked' : 'User blocked');
        const updatedStatus = !user.isBlocked;
        setUser(prev => ({ ...prev, isBlocked: updatedStatus }));
        setEditedUser(prev => ({ ...prev, isBlocked: updatedStatus }));
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      toast.error('Error updating user status');
      console.error('Block API error:', error);
    } finally {
      setUpdating(false);
      setLoading(false)
    }
  };

  const saveEdits = async () => {
    setUpdating(true);
    setLoading(true)
    try {
      const { data } = await authAxios().post(
        `${baseUrl}/auth/editUser`,
        {
          id: editedUser._id,
          name: editedUser.name,
          email: editedUser.email,
          role: editedUser.role,
          points: editedUser.points,
        }
      );

      if (data?.status === 1) {
        toast.success(data?.message);
        refetchUsers()
        setUser({ ...editedUser });
        setIsEditing(false);
        
      } else {
        toast.error('Failed to update user');
      }
    } catch (error) {
      toast.error('Error updating user');
      console.error('Update Error:', error);
    } finally {
      setUpdating(false);
      setLoading(false)
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: name === 'points' ? Number(value) : value }));
  };

  useEffect(() => {
    if (selectedUser) fetchUser();
  }, [selectedUser, fetchUser]);

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-blue-100 p-6 rounded-lg shadow-md text-center">
          <p className="text-2xl font-semibold text-gray-800">Hi Admin, how are you?</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
          <FaUser className="text-blue-600" /> User Admin Panel
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">User ID</span>
            <span className="text-gray-800 break-words">{user?._id}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Name</span>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedUser?.name}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm mt-1"
              />
            ) : (
              <span className="text-gray-800 break-words">{editedUser?.name}</span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Email</span>
            {isEditing ? (
              <input
                type="text"
                name="email"
                value={editedUser?.email}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm mt-1"
              />
            ) : (
              <span className="text-gray-800 break-words">{editedUser?.email}</span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Points</span>
            {isEditing ? (
              <input
                type="number"
                name="points"
                value={editedUser?.points || 0}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm mt-1"
              />
            ) : (
              <span className="text-gray-800 break-words">{editedUser?.points}</span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Role</span>
            {isEditing ? (
              <input
                type="text"
                name="role"
                value={editedUser?.role}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm mt-1"
              />
            ) : (
              <span className="text-gray-800 break-words">{editedUser?.role}</span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Online Status</span>
            <span className="text-gray-800 flex items-center gap-2">
              <BsCircleFill className={user?.isOnline ? 'text-green-500' : 'text-gray-400'} />
              {user?.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Blocked</span>
            <span className="text-gray-800 flex items-center gap-2">
              {user?.isBlocked ? (
                <>
                  <FaBan className="text-red-500" /> Blocked
                </>
              ) : (
                <>
                  <FaCheckCircle className="text-green-500" /> Not Blocked
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <button
            onClick={toggleBlockStatus}
            disabled={updating}
            className={`px-6 py-3 font-semibold rounded-md shadow-md transition duration-200 ${user?.isBlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
              } text-white`}
          >
            {updating ? 'Processing...' : user?.isBlocked ? 'Unblock User' : 'Block User'}
          </button>

          <button
            onClick={isEditing ? saveEdits : () => setIsEditing(true)}
            disabled={updating}
            className={`px-6 py-3 font-semibold rounded-md ${isEditing ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
          >
            {updating ? (isEditing ? 'Saving...' : 'Processing...') : isEditing ? 'Save Changes' : 'Edit User'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default IsLoadingHOC(UserDetail);
