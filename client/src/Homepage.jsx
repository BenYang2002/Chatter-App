import HomepageBackground from "./Homapage/HomepageBackground.jsx";
import HomeCard from "./Homapage/HomeCard.jsx";
import Login from "./Homapage/Login.jsx";
import Register from "./Homapage/Register.jsx";
import UserHMBackground from "./Userpage/UserHMBackground.jsx";
//user page
import UserHomePage from "./Userpage/UserHomePage.jsx";
import ProtectedRoute from "./Auth/ProtectedRoute.jsx";
import "./Homepage.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import socket from "./socket.js";
import { getUserId } from "./Service/user.service.js";
function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server:", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);
  const [userProfile, SetUserProfile] = useState(async () => {
    const getAvatarKey = localStorage.getItem("avatarKey");
    const getName = localStorage.getItem("name");
    const getEmail = localStorage.getItem("email");
    const getUserPK = localStorage.getItem("userPK");

    const userIdData = await getUserId().catch(() => null);

    const avatarKey = getAvatarKey ? getAvatarKey : null;
    const name = getName ? getName : null;
    const email = getEmail ? getEmail : null;
    const userId = userIdData?.userId ?? null;
    const userPK = getUserPK && getUserPK !== "null" ? getUserPK : null;

    return {
      avatarKey: avatarKey,
      name: name,
      email: email,
      userId: userId,
      userPK: userPK,
    };
  });
  return (
    <>
      <BrowserRouter>
        {/* Routes for register and login page*/}
        <Routes>
          {/* Routes for register and login page*/}
          <Route element={<HomepageBackground />}>
            <Route
              path="/"
              element={
                <HomeCard
                  SetUserProfile={SetUserProfile}
                  userProfile={userProfile}
                />
              }
            />
            <Route
              path="/login"
              element={<Login SetUserProfile={SetUserProfile} />}
            />
            <Route
              path="/register"
              element={
                <Register
                  userProfile={userProfile}
                  SetUserProfile={SetUserProfile}
                />
              }
            />
          </Route>
          {/*Routes for user page after login/register*/}
          <Route element={<ProtectedRoute />}>
            <Route element={<UserHMBackground />}>
              <Route
                path="/user"
                element={
                  <UserHomePage
                    userProfile={userProfile}
                    SetUserProfile={SetUserProfile}
                  />
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
