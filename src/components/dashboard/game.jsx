import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext'; 
import { authAxios } from '../../config/config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import IsLoadingHOC from '../../utils/IsLoadingHOC';

function Game({setLoading}) {
  const { socket } = useSocket();
  const [clickCount, setClickCount] = useState(0);

  const storedUser = localStorage.getItem('userDetail');
  const userId = storedUser ? JSON.parse(storedUser)?.id : null;
  const token = localStorage.getItem('token');

const navigate = useNavigate();
  

const BASE_URL = import.meta.env.VITE_REACT_APP_BASEURL


useEffect(() => {
    if (!userId || !token) return;

    const fetchClickCount = async () => {
      setLoading(true)
      try {
        const res = await authAxios().get(
          `${BASE_URL}/game/points/${userId}`,
        );
        setClickCount(res.data?.data?.points || 0);
      } catch (error) {
        console.error("Error fetching points:", error);
      }finally{
        setLoading(false)
      }
    };

    fetchClickCount();
    socket?.emit('register', userId);
    if (socket) {
      socket.on('player:updateClickCount', (newCount) => {
        setClickCount(newCount);
      });

      socket.on('actionBlocked', (message) => {
        toast.error(message || "You are blocked by admin");
        navigate('/');
    localStorage.removeItem('token');
    localStorage.removeItem('userDetail');
      });

     
      socket.on('error', (msg) => {
        toast.error(msg);
      });
    }

    return () => {
      if (socket) {
        socket.off('player:updateClickCount');
        socket.off('actionBlocked');
        socket.off('error');
      }
    };
  }, [socket, userId, token]);

  const handleBananaClick = () => {
    if (socket && userId) {
      socket?.emit('banana:click', userId);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 px-4">
      
      <h1 className="text-3xl font-bold text-yellow-600 mb-6">
        🍌 Banana Click Game
      </h1>

      <button
        onClick={handleBananaClick}
        className="bg-yellow-400 hover:bg-yellow-500 text-white text-xl font-semibold py-4 px-8 rounded-full shadow-lg transition-transform active:scale-95"
      >
        Click the Banana!
      </button>

      <p className="mt-6 text-lg text-gray-700">
        Your Points: <span className="font-bold text-yellow-600">{clickCount}</span>
      </p>
    </div>
  );
}

export default IsLoadingHOC(Game);