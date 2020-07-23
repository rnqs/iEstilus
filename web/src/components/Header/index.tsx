import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import barIcon from "@iconify/icons-fe/bar";
import closeIcon from "@iconify/icons-fe/close";
import "./styles.css";

import iEstilusLogo from "../../assets/logo.svg";

interface props {
  links: item[];
  button: item;
  menuStatus?: (menuOpened: boolean) => void
}

interface item {
  text: string;
  onClick: () => void;
}

export default function Header({ links, button, menuStatus }: props) {
  const [menuOpened, setMenuOpened] = useState(false);

  useEffect(() => {
    if (menuStatus) menuStatus(menuOpened)
  }, [menuOpened, menuStatus])

  return (
    <nav className={menuOpened ? "header header-opened" : "header"}>
      <div className="nav-container">
        <img src={iEstilusLogo} alt="iEstilus Logo" />
        <div className="icon" onClick={() => setMenuOpened(!menuOpened)}>
          <Icon
            icon={menuOpened ? closeIcon : barIcon}
            className="menu-open-close-icon"
          />
        </div>
      </div>

      <div
        className={
          menuOpened ? "links-container" : "links-container hide-on-mobile"
        }
      >
        {links.map((link, index) => (
          <span
            onClick={() => {
              setMenuOpened(false);
              link.onClick();
            }}
            className="link"
            key={index}
          >
            {link.text}
          </span>
        ))}

        <button
          onClick={() => {
            setMenuOpened(false);
            button.onClick();
          }}
        >
          {button.text}
        </button>
      </div>
    </nav>
  );
}
