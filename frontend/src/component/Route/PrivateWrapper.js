import { Navigate, Outlet} from "react-router-dom";
import { useSelector } from "react-redux";

 const PrivateWrapper = () => { 
   const { isAuthenticated } = useSelector((state) => state.user);
   
  //  return (
  //   (isAuthenticated===false) ? <Navigate to='/login'/>  :  <Outlet/>
  // )
    
    if( isAuthenticated && isAuthenticated===false){
      return <Navigate to='/login' replace/>
    }
    else if(isAuthenticated && isAuthenticated===true){

      return  <Outlet /> 
    }
  //  else{
  //   return <Navigate to='/login' replace/>
  //  }
    
  }

  export default PrivateWrapper

