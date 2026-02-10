import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import ErrorWindow from "./ErrorWindow.jsx";
import SpinCat from "./SpinCat.jsx";
import { validateEmail } from "../Service/format.validate.js";
function Login({ SetUserProfile }) {
  const navigate = useNavigate();
  const [showError, SetShowError] = useState(false);
  const [errorMessage, SetErrorMessage] = useState("");
  const [showSpinCat, SetShowSpinCat] = useState(false);
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      SetErrorMessage("Please fill in all fields");
      SetShowError(true);
      return;
    }
    if (!validateEmail(email)) {
      SetErrorMessage("Invalid email address");
      SetShowError(true);
      return;
    }

    SetShowSpinCat(true);
    const res = await fetch("api/auth/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.status === 200) {
      const data = await res.json();
      SetUserProfile((prev) => ({
        ...prev,
        name: data.name ? data.name : null,
        email: data.email ? data.email : null,
        userId: data.userId ? data.userId : null,
      }));
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      localStorage.setItem("userId", data.userId);
      SetShowSpinCat(false);
      navigate("/user");
    } else {
      SetShowSpinCat(false);
      const data = await res.json();
      SetErrorMessage(data.message);
      SetShowError(true);
    }
  }

  return (
    <>
      <div className="login-prompt-background">
        <div className="login-prompt-container">
          {showSpinCat && <SpinCat />}
          {showError && (
            <ErrorWindow ErrorMessage={errorMessage} setError={SetShowError} />
          )}
          <button className="login-X-button" onClick={() => navigate("/")}>
            X
          </button>
          {!showSpinCat && (
            <form onSubmit={handleSubmit}>
              <input
                placeholder="email"
                onChange={(e) => SetEmail(e.target.value)}
                value={email}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => SetPassword(e.target.value)}
                value={password}
              />
              <button
                className="submit-button"
                type="submit"
                onClick={handleSubmit}
              >
                Continue
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
