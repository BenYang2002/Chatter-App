import "./UserHMContact.css";
import { useState } from "react";
function Contact() {
  const [displayClose, SetDisplayClose] = useState(false);
  return (
    <>
      <div className="contacts">
        <div className="top-field">
          <div className={`search-bar ${displayClose ? "active" : ""}`}>
            <div className="magnify-glass">🔍</div>
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search"
                onClick={() => SetDisplayClose(true)}
                onBlur={() => SetDisplayClose(false)}
              />
            </div>
            {displayClose && <div className="close">❌</div>}
          </div>
        </div>
        <div className="contact-list">
          <div className="example-contact">
            <div className="contact-avatar-container">
              <div className="contact-avatar"></div>
            </div>
            <div className="message-frame">
              <div className="message-container">
                <div className="top-message">
                  <div className="contact-name">
                    <p>赵玹辛</p>
                  </div>
                  <div className="last-message-time">
                    <p>2026/1/29</p>
                  </div>
                </div>
                <div className="bottom-message">
                  <p className="last-message">
                    this is the last message we send
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Contact;
