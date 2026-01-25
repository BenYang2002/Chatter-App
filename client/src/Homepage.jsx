import { useState } from "react";
import "./Homepage.css";
import HomeCard from "./HomeCard.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  const [isLoginOpen, setLogin] = useState(false);
  const [IsRegisterOpen, setRegister] = useState(false);

  return (
    <>
      <div className="hm-background-SVG"></div>
      <div className="hm-page">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeCard setLogin={setLogin} />} />
            <Route path="/login" element={<Login setLogin={setLogin} />} />
            <Route
              path="/register"
              element={<Register setRegister={setRegister} />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
