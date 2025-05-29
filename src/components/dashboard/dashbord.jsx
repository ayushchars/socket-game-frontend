import React, { useEffect, useState } from 'react';
import Users from './users';
import Game from './game';
import { useNavigate } from 'react-router-dom';
import UserDetail from './userDetail';
import { toast } from 'react-toastify';
import { authAxios } from '../../config/config';
import IsLoadingHOC from '../../utils/IsLoadingHOC';

function Dashboard({setLoading}) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchRankings = async () => {
    setLoading(true)
    try {
      const response = await authAxios().get(`/game/rankings`);
      if (response.data.status === 1) {
        setUsers(response.data.data);
      }
    } catch (error) {

      console.log(error)
      toast.error(error.response?.data?.message || "Failed to fetch rankings");
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userDetail = JSON.parse(localStorage.getItem('userDetail'));

    if (!token || !userDetail) {
      navigate('/');
      return;
    }

    setIsAdmin(userDetail?.role === 'ADMIN');
    fetchRankings();
  }, [navigate]);

  const selectedUserData = users.find(u => u._id === selectedUser?._id);

  return (
    <div className="h-screen flex">
      <div className="w-1/4 border-r">
        <Users
          users={users}
          setUsers={setUsers}
          onSelectUser={setSelectedUser}
          selectedUser={selectedUser}
        />
      </div>
      <div className="w-3/4 flex flex-col">
        {isAdmin ? (
          <UserDetail
            selectedUser={selectedUserData}
            refetchUsers={fetchRankings}
          />
        ) : (
          <Game selectedUser={selectedUserData} />
        )}
      </div>
    </div>
  );
}

export default IsLoadingHOC(Dashboard);
