import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { withoutAuthAxios } from '../config/config';
import IsLoadingHOC from '../utils/IsLoadingHOC';

function LoginPage({setLoading}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const BASE_URL = import.meta.env.VITE_REACT_APP_BASEURL

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);



 
useEffect(() => {
  setLoading(true)
  const checkServerHealth = async () => {
    try {
      const response = await withoutAuthAxios().get(`${BASE_URL}/auth/health`);
      const data = response.data;
      console.log(" Server Health:", data);
    } catch (error) {
      console.error(" Server is down or unreachable:", error);
    }finally{
      setLoading(false)
    }
  };

  checkServerHealth();
}, []);




  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    try {
      const response = await withoutAuthAxios().post(`${BASE_URL}/auth/login`, { email, password });

        const data = response?.data
            console.log(data)
            if (data.status ===1 ) {
              toast.success(data?.message);
              localStorage.setItem("token",data?.data?.token)
              localStorage.setItem("userDetail",JSON.stringify(data?.data?.user))
              navigate('/dashboard');
      } else {
        toast.error(response.data.message || 'Login failed!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    }finally{
      setLoading(false)
    }
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Login to your account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Login
          </button>

        </form>
        <p className="text-sm text-center text-gray-600 mt-4" onClick={()=>navigate("/signup")}>
          dont have an account ?{' '}
          <span className="text-black font-medium cursor-pointer hover:underline">
            Register
          </span>
        </p>
      </div>
      
    </div>
  );
}

export default IsLoadingHOC(LoginPage);
