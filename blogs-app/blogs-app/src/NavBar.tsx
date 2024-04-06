import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useUser } from "./hooks";

const NavBar: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(getAuth());
    navigate("/login");
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/articles">Articles</Link>
        </li>
      </ul>
      <div className="nav-right">
        {user ? (
          <button onClick={handleLogout}>Log Out</button>
        ) : (
          <button onClick={() => navigate("/login")}>Log In</button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
