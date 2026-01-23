import "./Register.css";
import { useState } from "react";
function Register({ setRegister }) {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
    }
    console.log(username, email, password);
  }

  return (
    <>
      <div className="register-prompt-background">
        <div className="register-prompt-container">
          <form>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div
              className={`password-wrapper ${!passwordsMatch ? "error" : ""}`}
            >
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {!passwordsMatch && (
                <p className="password-error">password does not match</p>
              )}
            </div>
            <button
              className="submit-button"
              type="submit"
              onClick={handleSubmit}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
