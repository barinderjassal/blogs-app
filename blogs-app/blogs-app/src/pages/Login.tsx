import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const onLogin = async () => {
    if (email === "" || password === "") return;
    try {
      const data = await signInWithEmailAndPassword(getAuth(), email, password);
      console.log("user on login", data);
      navigate("/articles");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <>
      <h1>Login</h1>
      {error && <p className="error"> {error}</p>}
      <input
        type="email"
        required
        placeholder="Enter your email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        required
        placeholder="Enter your password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <div className="login-btn-wrapper">
        <button type="submit" onClick={onLogin}>
          Log in
        </button>
      </div>
      <Link to="/create-account">Don't have an account? Create one here!</Link>
    </>
  );
};
