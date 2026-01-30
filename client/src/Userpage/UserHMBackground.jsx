import "./UserHMBackground.css";
import { Outlet } from "react-router-dom";
function UserHMBackground() {
  return (
    <>
      <div className="user-HM-background"></div>
      <div className="user-page">
        <Outlet />
      </div>
    </>
  );
}
export default UserHMBackground;
