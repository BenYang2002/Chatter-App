import "./HomePageBackground.css";
import { Outlet } from "react-router-dom";
function HomepageBackground() {
  return (
    <>
      <div className="hm-background-SVG"></div>
      <div className="hm-page">
        <Outlet />
      </div>
    </>
  );
}

export default HomepageBackground;
