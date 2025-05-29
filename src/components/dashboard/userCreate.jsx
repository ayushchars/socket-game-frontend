import React, { useEffect, useState } from 'react';
import { authAxios } from '../../config/config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import IsLoadingHOC from '../../utils/IsLoadingHOC';

function UserCreate({setLoading}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_REACT_APP_BASEURL

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userDetail = JSON.parse(localStorage.getItem('userDetail'));

    if (!token || !userDetail) {
      navigate('/');
      return;
    }

  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    try {
      const response = await authAxios().post(
        `${BASE_URL}/auth/adminCreateUser`,
        form
      );

      if (response.data?.status === 1) {
        toast.success(response?.data?.message);
        navigate('/dashboard');
      } else {
        toast.error(response.data?.message || 'Failed to create user');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Server error');
    }finally{
      setLoading(false)
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">

        <button
          onClick={handleBack}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium mb-4 flex items-center gap-1"
        >
          <IoIosArrowBack size={16} />
          Back
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default IsLoadingHOC(UserCreate);
