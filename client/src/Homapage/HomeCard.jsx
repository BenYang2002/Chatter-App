import { useEffect } from "react";
import "./HomeCard.css";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../Service/auth.service";
function HomeCard({ SetUserProfile, userProfile }) {
  const navigate = useNavigate();
  useEffect(() => {
    const foo = async () => {
      try {
        const data = await checkAuth();
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("userId", data.user.userId);
        localStorage.setItem("userPK", data.user.userPK);
        SetUserProfile((prev) => ({
          ...prev,
          name: data.user.name,
          email: data.user.email,
          userId: data.user.userId,
          userPK: data.user.userPK,
        }));
        navigate("/user");
      } catch (err) {}
    }; //checkAuth
    foo();
  }, []);
  return (
    <>
      <div className="hm-square">
        <div className="hm-square-blur"></div>
        <div className="hm-page-content">
          <h1>Pixel Chat</h1>
          <p>A cat lover pixel style chat app</p>
          <button
            onClick={() => {
              navigate("/login");
            }}
          >
            Log in
          </button>
          <p
            className="create-account"
            onClick={() => {
              navigate("/register");
            }}
          >
            New user? Create an account
          </p>
        </div>
      </div>
      ;
    </>
  );
}

export default HomeCard;
