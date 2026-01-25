import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
function Login({ setLogin }) {
  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    console.log(name, email);
  }
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <>
      <div className="login-prompt-background">
        <div className="login-prompt-container">
          <button className="login-X-button" onClick={() => navigate("/")}>
            X
          </button>
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Username"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <button className="submit-button" type="submit">
              Continue
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
