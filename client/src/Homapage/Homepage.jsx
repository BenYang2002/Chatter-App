import { useState } from "react";
import "./Homepage.css";
import HomeCard from "./HomeCard.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {

  return (
    <>
      <div className="hm-background-SVG"></div>
      <div className="hm-page">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeCard/>} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/register"
              element={<Register />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
