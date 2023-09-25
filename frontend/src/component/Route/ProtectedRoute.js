import React from "react";
import { useSelector } from "react-redux";
import { Navigate , Outlet  } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, element: Element, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
 
  // we are doing this so that no need to write isAuthenticated && for every protected component
  return (
    <>
      {loading === false && (
        <Outlet 
          {...rest} //...rest is exact path="/account" for example
          render={(props) => {
            if (isAuthenticated === false) {
              return <Navigate  to="/login" />;
            }

            if (isAdmin === true && user.role !== "admin") {
              return <Navigate  to="/login" />;
            }

            return <Element {...props} />;
          }}
        />
      )}
    </>
  );
};

export default ProtectedRoute;
