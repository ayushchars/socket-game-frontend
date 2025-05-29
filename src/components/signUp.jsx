import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { withoutAuthAxios } from '../config/config';
import IsLoadingHOC from '../utils/IsLoadingHOC';
function Signup({setLoading}) {
  const [userDetail, setUserDetail] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();

  const ADMIN_SECRET = 'admin'; 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, []);

  const handleChange = (e) => {
    setUserDetail((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleCheckboxChange = (e) => {
    setIsAdmin(e.target.checked);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const payload = { ...userDetail };
    if (isAdmin) {
      payload.role = 'ADMIN';
    }

    try {
      const response = await withoutAuthAxios().post('/auth/register', payload);
      const data = response?.data;
      if (data.status === 1) {
        toast.success(data?.message);
        navigate('/');
      } else {
        toast.error(response.data.message || 'Signup failed!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    }finally{
      setLoading(false)
    }
  };

  const handleVerify = () => {
    if (adminToken === ADMIN_SECRET) {
      setIsVerified(true);
      toast.success('Access granted!');
    } else {
      toast.error('Invalid admin token');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
      {!isVerified && (
        <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4 text-center">Admin Access Required</h2>
            <input
              type="password"
              placeholder="Enter admin token"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            <button
              onClick={handleVerify}
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            >
              Verify Token
            </button>
          </div>
        </div>
      )}

      {isVerified && (
        <div className="w-full max-w-md bg-white p-8 rounded shadow-md z-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">Admin Signup</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                name="name"
                required
                value={userDetail.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={userDetail.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={userDetail.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>


            <div className="flex items-center">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              checked={isAdmin}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">
              Register as Admin
            </label>
          </div>
            <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
              Sign Up
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4" onClick={() => navigate("/")}>
            Already have an account?{' '}
            <span className="text-black font-medium cursor-pointer hover:underline">
              Login
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default IsLoadingHOC(Signup);
