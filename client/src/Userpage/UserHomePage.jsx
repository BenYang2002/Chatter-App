import "./UserHomePage.css";
import UserHMChatContent from "./UserHMChatContent";
import UserHMContact from "./UserHMContact";
import UserHMSidebar from "./UserHMSidebar";
function UserHomePage() {
  return (
    <>
      <div className="userPage-container">
        <UserHMSidebar />
        <UserHMContact />
        <UserHMChatContent />
      </div>
    </>
  );
}
export default UserHomePage;
