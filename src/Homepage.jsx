import { useState } from "react";
import "./Homepage.css";
import HomeCard from "./HomeCard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="hm-background-SVG"></div>
      <div className="hm-page">
        <HomeCard />
      </div>
    </>
  );
}

export default App;
