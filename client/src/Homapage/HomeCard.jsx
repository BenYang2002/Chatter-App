import "./HomeCard.css";
import { useNavigate } from "react-router-dom";
function HomeCard() {
  const navigate = useNavigate();
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
