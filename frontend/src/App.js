import "./App.css";
import React ,{ useEffect, useState } from 'react';
import Header from './component/layout/Header/Header';
import {
  BrowserRouter,
  Routes,
  Route
  
} from "react-router-dom";
import WebFont from "webfontloader";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home.js"
import ProductDetails from "./component/Product/ProductDetails.js"
import Products from './component/Product/Products.js'
import Search from './component/Product/Search.js'
import LoginSignUp from "./component/User/LoginSignUp";
import store from './store'
import { loadUser } from "./actions/userAction";
import UserOptions from './component/layout/Header/UserOptions.js'
import { useSelector } from "react-redux";
import Profile from './component/User/Profile.js'
// import ProtectedRoute from "./component/Route/ProtectedRoute";
import PrivateWrapper from './component/Route/PrivateWrapper'
import UpdateProfile from './component/User/UpdateProfile.js'
import UpdatePassword from './component/User/UpdatePassword.js'
import ForgotPassword from './component/User/ForgotPassword.js'
import ResetPassword from './component/User/ResetPassword.js'
import Cart from './component/Cart/Cart.js'
import Shipping from './component/Cart/Shipping.js'
import ConfirmOrder from './component/Cart/ConfirmOrder.js'
import axios from "axios";
import Payment from './component/Cart/Payment.js'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from './component/Cart/OrderSuccess.js'
import MyOrders from './component/Order/MyOrders.js'
import OrderDetails from './component/Order/OrderDetails.js'
import PrivateWrapperAdmin from './component/Route/PrivateWrapperAdmin.js'
import Dashboard from './component/admin/Dashboard'
import ProductList from './component/admin/ProductList'
import NewProduct from './component/admin/NewProduct.js'
import UpdateProduct from './component/admin/UpdateProduct.js'
import OrderList from './component/admin/OrderList.js'
import ProcessOrder from './component/admin/ProcessOrder.js'
import UsersList from './component/admin/UsersList.js'
import UpdateUser from './component/admin/UpdateUser.js'
import ProductReviews from './component/admin/ProductReviews.js'
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";
// import NotFound from "./component/layout/Not Found/NotFound.js";

function App() {
  
  const {isAuthenticated,user} = useSelector(state=>state.user)

  // apni stripe api key ko revceive krety hue
  const [stripeApiKey, setStripeApiKey] = useState("");
  async function getStripeApiKey() {
    try {
      const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey); 
    } catch (error) {
      
    }
      
  }
    // console.log(stripeApiKey)

  // aise call kiya ki page load honey se pehly ye call krein useeffect dwara
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser())  // another way to use dispatch
    getStripeApiKey()
    
  }, []);
  console.warn = () => {};
  window.addEventListener("contextmenu",(e)=>e.preventDefault()) // no right click

  return (
   <>
   <BrowserRouter>
    <Header/>
    {isAuthenticated && <UserOptions user={user} />}
   
    {stripeApiKey && (
  <Elements stripe={loadStripe(stripeApiKey)}>
    {/* <ProtectedRoute exact path="/process/payment" component={Payment} /> */}
    <Routes>
    <Route path="/process/payment" element={<PrivateWrapper/>}>
      <Route path="/process/payment" element={ <Payment />}/>
    </Route>
    
    </Routes>
  </Elements>
)} 


    <Routes>
      <Route  exact path="/" element={<Home/>} />
      <Route  exact path="/about" element={<About/>} />
      <Route  exact path="/contact" element={<Contact/>} />
      <Route  exact path="/product/:id" element={<ProductDetails/>} />
      <Route  exact path="/products" element={<Products/>} />
      <Route   path="/products/:keyword" element={<Products/>} />
      <Route  exact path="/Search" element={<Search/>} />
      <Route  exact path='/login' element={<LoginSignUp/>} />
    {/*1st way working */}
    {/* {isAuthenticated && <Route  exact path="/account" element={<Profile/>} />} */}   

      
      {/*not working */}
      {/* <ProtectedRoute exact path="/account" element={Profile} /> */} 
       

          {/*2nd way working */}
          <Route  element={<PrivateWrapper />}>
            <Route path="/account" element={ <Profile />}/>
            <Route path="/me/update" element={ <UpdateProfile />}/>
            <Route path="/password/update" element={ <UpdatePassword />}/>
            <Route path="/shipping" element={ <Shipping />}/>
            <Route path="/order/confirm" element={ <ConfirmOrder />}/>
            <Route exact path="/success" element={ <OrderSuccess />}/>
            <Route exact path="/orders" element={ <MyOrders />}/>
            <Route exact path="/order/:id" element={ <OrderDetails />}/>

          </Route>  

        
          
          <Route path="/password/reset/:token" element={ <ResetPassword />}/>
          <Route path="/cart" element={ <Cart />}/>
          <Route path="/password/forgot" element={ <ForgotPassword />}/>

        
          <Route  element={<PrivateWrapperAdmin/>}>
            <Route exact path="/admin/dashboard" element={ <Dashboard />}/>
            <Route exact path="/admin/products" element={ <ProductList />}/>
            <Route exact path="/admin/product" element={ <NewProduct />}/>
            <Route exact path="/admin/product/:id" element={ <UpdateProduct />}/>
            <Route exact path="/admin/orders" element={ <OrderList />}/>
            <Route exact path="/admin/order/:id" element={ <ProcessOrder />}/>
            <Route exact path="/admin/users" element={ <UsersList />}/>
            <Route exact path="/admin/user/:id" element={ <UpdateUser />}/>
            <Route exact path="/admin/reviews" element={ <ProductReviews />}/>
          </Route>  


      {/* <Route path="*" element={window.location.pathname === "/process/payment" ? null : NotFound} /> */}


     </Routes>
    <Footer/>
   </BrowserRouter>

   </>
  );
}

export default App;
