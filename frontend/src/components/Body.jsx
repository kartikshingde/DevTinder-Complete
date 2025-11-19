import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router";
import Footer from "./Footer";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import axiosInstance from "../utils/axiosConfig";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axiosInstance.get("/profile/view"); // ← Removed BASE_URL (axiosInstance has it)
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.response?.status === 401) {
        // ← Fixed: err.response.status
        navigate("/login");
      }
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ ADD THIS - Listen for 401 errors from axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      navigate("/login");
    };

    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-4 pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
