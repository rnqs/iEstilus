import React from "react";
import "./styles.css";

import iEstilusLogo from "../../assets/logo.svg";

export default function Header({ links, button }) {
  return (
    <nav className="header">
      <img src={iEstilusLogo} alt="iEstilus Logo" />

      <div className="links-container">
        {links.map((link, index) => (
          <span onClick={link.onClick} className="link" key={index}>
            {link.text}
          </span>
        ))}

        <button onClick={button.onClick}>{button.text}</button>
      </div>
    </nav>
  );
}
