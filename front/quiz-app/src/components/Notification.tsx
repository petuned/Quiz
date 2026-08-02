import { useAppSelector } from "../store/hooks";
import { notification } from "../store/selectors";

const Notification = () => {
  const message = useAppSelector(notification);

  if (message === null) {
    return null;
  }
  return (
    <div className="overlay w-fit md:max-w-1/3 wrap-anywhere px-4 py-2 rounded border-2 border-gray-300 text-center font-semibold">
      {message}
    </div>
  );
};

export default Notification;
