import React from "react";
import { useDispatch } from "react-redux";
import authService from "../../appwriteService/auth";
import { logout } from "../../features/authSlice"; 
import { useNavigate } from "react-router-dom";

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const LogoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout());
    });
      navigate('/');
  };

  return (
    <button
      className="inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
      onClick={LogoutHandler}
    >
      Logout
    </button>
  );
};

export default LogoutBtn;
