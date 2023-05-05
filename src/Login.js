import "./Login.css";
import TypingAnimation from "./TypingAnimation";

function Login() {
  return (
    <div className="login-container">
      <div className="animation-container">
        <TypingAnimation />
      </div>
      <div className="login-content">
        <h1 className="login-title">Virtual DJ</h1>
        <a href="/auth/login" className="login-button">
          Login with Spotify
        </a>
        <p className="login-disclaimer">* Premium Spotify account required</p>
      </div>
    </div>
  );
}

export default Login;
