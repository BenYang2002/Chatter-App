import HomepageBackground from "./Homepage/HomepageBackground.jsx";
import HomeCard from "./Homepage/HomeCard.jsx";
import Login from "./Homepage/Login.jsx";
import Register from "./Homepage/Register.jsx";
import UserHMBackground from "./Userpage/UserHMBackground.jsx";
import UserHomePage from "./Userpage/UserHomePage.jsx";
import ProtectedRoute from "./Auth/ProtectedRoute.jsx";
import "./Homepage.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import socket from "./socket.js";
import { getUserId } from "./Service/user.service.js";
import useUserStore from "./store/useUserStore.js";

function App() {
  const updateUserProfile = useUserStore((s) => s.updateUserProfile);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server:", socket.id);
    });
    return () => {
      socket.off("connect");
    };
  }, []);

  useEffect(() => {
    getUserId()
      .then((data) => {
        if (data?.userId) updateUserProfile({ userId: data.userId });
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<HomepageBackground />}>
            <Route path="/" element={<HomeCard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<UserHMBackground />}>
              <Route path="/user" element={<UserHomePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;