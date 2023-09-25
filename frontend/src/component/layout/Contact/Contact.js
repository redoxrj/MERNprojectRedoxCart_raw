import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:rjrajnish1729@gmail.com" target='_blank'>
        <Button>Contact: rjrajnish1729@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;