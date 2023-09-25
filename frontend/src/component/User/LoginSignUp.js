import React, { useEffect, useRef, useState } from 'react'
import './LoginSignUp.css'
import '../layout/Loader/Loader'
import { Link, useLocation, useNavigate } from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { clearErrors, login ,register} from '../../actions/userAction';
import {useDispatch,useSelector} from 'react-redux'
import {useAlert} from 'react-alert'
import Loader from '../layout/Loader/Loader';

const LoginSignUp = () => { 
  const location = useLocation()
  const navigate = useNavigate() 
  const dispatch = useDispatch()
  const alert = useAlert()  
  
  const {loading,error,isAuthenticated} = useSelector (state=>state.user)
  
    const loginTab = useRef(null) // react mein hum direcly DOM ke elements access ni kr sktey thats why we have to use useRef hook
    const registerTab = useRef(null) 
    const switcherTab = useRef(null)

    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    })

    const {name, email, password} = user  // user se fetch hotey hue

    const [avatar, setAvatar] = useState(""); 
    const [avatarPreview, setAvatarPreview] = useState(""); // public walein folder ke liye seedha / krke likh/access kr skety

    const loginSubmit =(e)=>{
        e.preventDefault()
        dispatch(login(loginEmail,loginPassword))  // we did't used useEffect as we dispatched this login when the form is submitted

    }
    const registerSubmit=(e)=>{
        e.preventDefault()
        const myForm = new FormData() // form ka poora data bna ke bhejnegy | FormData is a inbuilt class/constructor
        myForm.set("name",name)
        myForm.set("email",email)
        myForm.set("password",password)
        if(avatar){

          myForm.set("avatar",avatar)
        }

        dispatch(register(myForm))

    
    }

    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
          const reader = new FileReader();
    
          reader.onload = () => {
            if (reader.readyState === 2) { // 0 initial 1 processing 2 done 
              setAvatarPreview(reader.result);
              setAvatar(reader.result);
            }
          };
    
          reader.readAsDataURL(e.target.files[0]);
        } else {
          setUser({ ...user, [e.target.name]: e.target.value });
        }
      };
     // location.search mein dhundega = ko and 2 tukdo mein baat dega left wala 0 index pe and right wala 1 index pe
     const redirect = location.search ? location.search.split("=")[1] : "/account";
      //otherwise agar location.search kuch bhi ni hai toh else wla condtion

      useEffect(() => {
        if(error){
          alert.error(error);
          dispatch(clearErrors())
        }
        if(isAuthenticated){
          navigate(redirect)
          // console.log(redirect)
        }
        
      },[dispatch,error,alert,navigate,isAuthenticated,redirect]);

    const switchTabs = (e,tab)=>{
        if (tab === "login") {
            switcherTab.current.classList.add("shiftToNeutral");
            switcherTab.current.classList.remove("shiftToRight");
      
            registerTab.current.classList.remove("shiftToNeutralForm");
            loginTab.current.classList.remove("shiftToLeft");
          }
          if (tab === "register") {
            switcherTab.current.classList.add("shiftToRight");
            switcherTab.current.classList.remove("shiftToNeutral");
      
            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");
          }
    }

  return (
    <>
    {loading ? <Loader/> : <>
    <div className="LoginSignUpContainer">
        <div className="LoginSignUpBox">
            <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
            </div>
            <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Link to="/password/forgot">Forget Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>

              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data" // not just string/text but also to upload image of the user
                onSubmit={registerSubmit}
              >
                <div className="signUpName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>

                
                <div >Image upload coming very soon:)</div>
                <input type="submit" value="Register" className="signUpBtn" />
              </form>
        </div>

    </div>
      
    </>}
    </>
  )
}

export default LoginSignUp
