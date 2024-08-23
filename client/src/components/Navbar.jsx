/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onSignOut }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    onSignOut();
    navigate("/");
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <button onClick={handleSignOut}>Sign Out</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
