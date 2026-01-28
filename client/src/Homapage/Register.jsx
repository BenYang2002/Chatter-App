import "./Register.css";
import ErrorWindow from "./ErrorWindow";
("./ErrorWindow.jsx");
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  // user info states
  const [username, SetName] = useState("");
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");

  // confirm password states
  const [confirmPassword, SetConfirmPassword] = useState("");
  const [passwordsMatch, SetPasswordsMatch] = useState(true);
  const [missingFields, SetMissingFields] = useState(false);

  // error window states
  const [showError, SetShowError] = useState(false);
  const [errorMessage, SetErrorMessage] = useState("");

  // change cat's mood
  const [countPassRule, SetCountPass] = useState(0);

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
      SetMissingFields(true);
      console.log("missing fields");
      return;
    }
    console.log(username, email, password);
    const res = await fetch("api/auth/register", {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    console.log(data.message);
    if (res.status === 409) {
      SetShowError(true);
      SetErrorMessage(data.message);
    }
  }

  return (
    <>
      <div className="register-prompt-background">
        <div className="register-prompt-container">
          <div className={`register-prompt-password-cat mood-${countPassRule}`}>
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
                  SetPassword(e.target.value);
                  SetCountPass(Object.values(rules).filter(Boolean).length);
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
                placeholder="confirm password"
                value={confirmPassword}
                onChange={(e) => SetConfirmPassword(e.target.value)}
              />
              {!passwordsMatch && (
                <p className="password-error">password does not match</p>
              )}
            </div>
            <div className="register-submit-wrapper">
              {missingFields && (
                <p className="missing-fields-error">
                  Please fill in all fields
                </p>
              )}
              <button
                className="submit-button"
                type="submit"
                onClick={handleSubmit}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
