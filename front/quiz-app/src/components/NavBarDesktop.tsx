import { Link, useNavigate } from "react-router-dom";

import type { User } from "../types";
import storageService from "../services/storageService";

import { useAppSelector } from "../store/hooks";
import { selectUser } from "../store/selectors";
import { useAppDispatch } from "../store/hooks";
import { clearUser } from "../store/reducers/userReducer";
import { setTimedNotification } from "../store/reducers/notificationReducer";

const NavBarDesktop = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user: User | null = useAppSelector(selectUser);

  const handleLogout = () => {
    storageService.removeUser("quizAppUser");
    dispatch(clearUser());
    dispatch(setTimedNotification("Logged out successfully", 3));
    navigate("/");
  };

  return (
    <div>
      <div className="p-4 flex justify-end gap-2">
        {user && <p className="m-2">Hello {user.name}</p>}
        <Link to="/create">
          <button className="btn btn-blue font-semibold">Create</button>
        </Link>
        {user ? (
          <button onClick={handleLogout} className="btn btn-white font-semibold">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">
              <button className="btn btn-white font-semibold">Login</button>
            </Link>
            <Link to="/register">
              <button className="btn btn-white font-semibold">Register</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBarDesktop;
