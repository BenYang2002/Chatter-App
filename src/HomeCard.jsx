import "./HomeCard.css";
function HomeCard() {
  return (
    <>
      <div className="hm-page">
        <div className="hm-square">
          <div className="hm-square-blur"></div>

          <div className="hm-page-content">
            <h1>Pixel Chat</h1>
            <p>A cat lover pixel style chat app</p>
            <button>Log in</button>
            <p>New user? Create an account</p>
          </div>
        </div>
      </div>
      ;
    </>
  );
}

export default HomeCard;
