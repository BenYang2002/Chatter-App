import "./ErrorWindow.css";
function ErrorWindow({ErrorMessage,setError}) {
  return (
    <>
      <div className="error-window-background">
        <div className="error-window-container">
          <h2>Meow: Error</h2>
          <p>{ErrorMessage}</p>
          <button onClick={()=>setError(false)}>OK</button>
        </div>
      </div>
    </>
  );
}

export default ErrorWindow;