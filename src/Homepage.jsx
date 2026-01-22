import { useState } from "react";
import "./Homepage.css";
import HomeCard from "./HomeCard.jsx";
import Login from "./Login.jsx";
function App() {
  const [isLoginOpen, setLogin] = useState(false);

  return (
    <>
      <div className="hm-background-SVG"></div>
      <div className="hm-page">
        {!isLoginOpen && <HomeCard setLogin={setLogin} />}
        {isLoginOpen && <Login setLogin={setLogin} />}
      </div>
    </>
  );
}

export default App;
