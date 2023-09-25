import React from 'react'
import playStore from '../../../images/playstore.png'
import AppStore from '../../../images/Appstore.png'
import './Footer.css'

const Footer = () => {
  return (
   <footer id='footer'>
    <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playStore" />
        <img src={AppStore} alt="AppStore" />
        
    </div>
    <div className="midFooter">
        <h1>RedoxCart</h1>
        <p>High Quality is our first priority</p>
        <p>Copyrights 2023 &copy; Rajnish Kumar</p>

    </div>
    <div className="rightFooter">
    <h4>Follow Us</h4>
         <a href="https://www.linkedin.com/in/rajnish-kumar-redoxrj/" target='_blank'>Linkedin</a>
         <a href="https://github.com/redoxrj" target='_blank'>Github</a>
         
       

    </div>

   </footer>
  )
}

export default Footer
