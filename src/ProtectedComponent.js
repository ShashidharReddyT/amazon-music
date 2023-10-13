import { Navigate } from "react-router-dom";
import { useUser } from "./UserProvider";

function ProtectedComponent(props) {
  const { isUserLoggedIn: isAuth } = useUser();

  console.log("ProtectedComponent isUserLoggedIn", isAuth);

  const { children } = props;

  if (!isAuth) {
    return <Navigate to={"/login"} />;
  } else {
    return children;
  }
}

export default ProtectedComponent;
