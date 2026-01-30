import HomepageBackground from "./Homapage/HomepageBackground.jsx";
import HomeCard from "./Homapage/HomeCard.jsx";
import Login from "./Homapage/Login.jsx";
import Register from "./Homapage/Register.jsx";
import UserHMBackground from "./Userpage/UserHMBackground.jsx";
//user page
import UserHomePage from "./Userpage/UserHomePage.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        {/* Routes for register and login page*/}
        <Routes>
          {/* Routes for register and login page*/}
          <Route element={<HomepageBackground />}>
            <Route path="/" element={<HomeCard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          {/*Routes for user page after login/register*/}
          <Route element={<UserHMBackground />}>
            <Route path="/user" element={<UserHomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
