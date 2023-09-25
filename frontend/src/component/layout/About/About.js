import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import InstagramIcon from "@material-ui/icons/Instagram";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import GitHubIcon from "@material-ui/icons/GitHub";
const About = () => {
  const visitLinkedIn = () => {
    window.location = "https://www.linkedin.com/in/rajnish-kumar-redoxrj/";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dxveabdbw/image/upload/v1695476052/avatars/v8olel3fqlao5wi1xpkc.jpg"
              alt="Founder"
            />
            <Typography>Rajnish Kumar</Typography>
            <Button onClick={visitLinkedIn} color="primary">
            Connect with Me on LinkedIn
            </Button>
            <span>
              <strong>'RedoxCart'</strong>   an ecommerce MERN webapp made by me using ReactJs,Redux,NodeJs,ExpressJs,MongoDb
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a
              href="https://www.linkedin.com/in/rajnish-kumar-redoxrj/"
              target="blank"
            >
              <LinkedInIcon className="youtubeSvgIcon" />
            </a>

            <a href="https://github.com/redoxrj" target="blank">
              <GitHubIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;