import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const Header = () => {
  const { userInfo, logOut } = useContext(AuthContext);
  return (
    <header>
      <Link to="/" className="logo">
        MyBlog
      </Link>
      <nav>
        {userInfo && (
          <>
            <NavLink to="/newPost">Create New Post</NavLink>
            <Link onClick={logOut}>Logout ({userInfo.username})</Link>
          </>
        )}

        {!userInfo && (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
