import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars4Icon, XMarkIcon } from "@heroicons/react/24/outline";

import type { User } from "../types";
import storageService from "../services/storageService";

import { useAppSelector } from "../store/hooks";
import { selectUser } from "../store/selectors";
import { useAppDispatch } from "../store/hooks";
import { clearUser } from "../store/reducers/userReducer";
import { setTimedNotification } from "../store/reducers/notificationReducer";

const NavBarMobile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user: User | null = useAppSelector(selectUser);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  const handleLogout = () => {
    storageService.removeUser("quizAppUser");
    dispatch(clearUser());
    dispatch(setTimedNotification("Logged out successfully", 3));
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center p-5 bg-indigo-500">
      <h1 className="text-center text-4xl font-bold text-white leading-tight">
        Quiz!
      </h1>
      <div onClick={() => setShowMobileMenu(!showMobileMenu)}>
        <Bars4Icon className="size-8 cursor-pointer hover:text-white" />
      </div>
      {showMobileMenu && (
        <div
          className="md:hidden overlay-background"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <div className="fixed flex flex-col gap-2 p-4 w-[60%] right-0 top-0 bg-indigo-500 rounded text-lg text-center">
            <div className="cursor-pointer text-white">
              <XMarkIcon className="size-7 justify-self-end" />
            </div>
            <Link to="/create">
              <div className="px-4 py-2 hover:bg-amber-600 text-white rounded">
                Create
              </div>
            </Link>
            {user ? (
              <div
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-amber-600 text-white rounded"
              >
                Logout
              </div>
            ) : (
              <>
                <Link to="/login">
                  <div className="px-4 py-2 hover:bg-amber-600 text-white rounded">
                    Login
                  </div>
                </Link>
                <Link to="/register">
                  <div className="px-4 py-2 hover:bg-amber-600 text-white rounded">
                    Register
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBarMobile;
