import "./Register.css";
import ErrorWindow from "./ErrorWindow";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SpinCat from "./SpinCat";
import userInfo from "../UserInfo.jsx";
import { validateEmail } from "../Service/format.validate.js";
function Register() {
  const navigate = useNavigate();
  // user info states
  const [username, SetName] = useState("");
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");

  // confirm password states
  const [confirmPassword, SetConfirmPassword] = useState("");
  const [passwordsMatch, SetPasswordsMatch] = useState(true);

  // error window states
  const [showError, SetShowError] = useState(false);
  const [errorMessage, SetErrorMessage] = useState("");

  // change cat's mood
  const [countPassRule, SetCountPass] = useState(0);
  const [visible, SetVisible] = useState(true);

  // show spin cat when loading
  const [showSpinCat, SetShowSpinCat] = useState(false);

  const rules = {
    length: password.length >= 8,
    uppercase: /^(?=.*[A-Z])/.test(password),
    lowercase: /^(?=.*[a-z])/.test(password),
    number: /^(?=.*[0-9])/.test(password),
    special: /^(?=.*[^A-Za-z0-9])/.test(password),
  };

  const displayRules = [
    { key: "length", label: "At least 8 characters" },
    { key: "uppercase", label: "At least one uppercase letter" },
    { key: "lowercase", label: "At least one lowercase letter" },
    { key: "number", label: "At least one number" },
    { key: "special", label: "At least one special character" },
  ];

  // show dialog box when focusing on password input
  const [showDialogBox, SetShowDialogBox] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      SetPasswordsMatch(false);
      return;
    }
    if (!password || !confirmPassword || !email || !username) {
      SetErrorMessage("Please fill in all fields");
      SetShowError(true);
      return;
    }
    if (Object.values(rules).filter(Boolean).length < 5) {
      SetErrorMessage("Password does not meet all requirements");
      SetShowError(true);
      return;
    }
    if (!validateEmail(email)) {
      SetErrorMessage("Invalid email address");
      SetShowError(true);
      return;
    }
    SetShowSpinCat(true);
    const res = await fetch("api/auth/register", {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.ok) {
      userInfo.name = username;
      userInfo.email = email;
      navigate("/user");
    } else {
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      SetShowSpinCat(false);
      SetShowError(true);
      SetErrorMessage(data.message || "Internal server error");
    }
  }

  function imageTransition() {
    SetVisible(false);
    setTimeout(() => {
      SetVisible(true);
    }, 200);
  }

  return (
    <>
      <div className="register-prompt-background">
        <div className="register-prompt-container">
          <div className="cat-wrapper">
            <div
              className={`register-prompt-password-cat mood-${countPassRule}`}
              style={visible ? { opacity: 1 } : { opacity: 0 }}
            ></div>
            <div
              className={`register-prompt-dialogbox-background ${showDialogBox ? "visible" : ""}`}
            >
              <img
                className="dialogbox-image"
                src="src/assets/homepage/dialog-box.png"
              />
            </div>
            <div
              className={`register-prompt-dialogbox ${showDialogBox ? "visible" : ""}`}
            >
              <h3>Password must contain:</h3>
              <ul className="password-requirements">
                {displayRules.map((rule) => {
                  const passed = rules[rule.key];
                  return (
                    <li key={rule.key}>
                      <span>{passed ? "✅" : "❌"}</span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {showError && (
            <ErrorWindow ErrorMessage={errorMessage} setError={SetShowError} />
          )}
          <button className="register-X-button" onClick={() => navigate("/")}>
            X
          </button>
          {!showSpinCat && (
            <form>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => SetName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => SetEmail(e.target.value)}
              />

              <div
                className={`password-wrapper ${!passwordsMatch ? "error" : ""}`}
              >
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    const oldPass = Object.values(rules).filter(Boolean).length;
                    SetPassword(e.target.value);
                    const rulesNow = {
                      length: e.target.value.length >= 8,
                      uppercase: /[A-Z]/.test(e.target.value),
                      lowercase: /[a-z]/.test(e.target.value),
                      number: /\d/.test(e.target.value),
                      special: /[^A-Za-z0-9]/.test(e.target.value),
                    };
                    const newPass =
                      Object.values(rulesNow).filter(Boolean).length;
                    if (oldPass !== newPass) {
                      SetCountPass(newPass);
                      imageTransition();
                    }
                  }}
                  onFocus={() => SetShowDialogBox(true)}
                  onBlur={() => SetShowDialogBox(false)}
                />
                {!passwordsMatch && (
                  <p className="password-error">password does not match</p>
                )}
              </div>

              <div
                className={`password-wrapper ${!passwordsMatch ? "error" : ""}`}
              >
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => SetConfirmPassword(e.target.value)}
                />
                {!passwordsMatch && (
                  <p className="password-error">password does not match</p>
                )}
              </div>
              <div className="register-submit-wrapper">
                <button
                  className="submit-button"
                  type="submit"
                  onClick={(e) => {
                    handleSubmit(e);
                  }}
                >
                  Register
                </button>
              </div>
            </form>
          )}
          {showSpinCat && (
            <div className="spin-cat-display">
              <SpinCat />
              <p>Creating your account...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Register;
