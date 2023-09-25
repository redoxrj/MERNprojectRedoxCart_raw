import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";


 const PrivateWrapper = () => {
    const { loading, isAuthenticated, user } = useSelector((state) => state.user);
    // return ( isAuthenticated===true && user.role==='admin' )  ? <Outlet /> : <Navigate to='/login' replace/>;
    if( isAuthenticated && isAuthenticated===false && user.role==='admin'){
      return <Navigate to='/login' replace/>
    }
    else if(isAuthenticated  && user.role==='admin'){

      return  <Outlet /> 
    }
    // else{
    //   return <Navigate to='/login' replace/>

    // }
    
  }

  export default PrivateWrapper