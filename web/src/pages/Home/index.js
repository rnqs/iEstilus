import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./styles.css";

import iEstilusLogo from "../../assets/logo.svg";

export default function Home() {
  const [navigating, setNavigating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setNavigating(false);
    }, 2000);
  }, [navigating]);

  let history = useHistory();

  function navigateTo(pathname) {
    if (!navigating) {
      history.push({
        pathname,
        state: { transition: "slide-left", duration: 2000 }
      });
    }

    setNavigating(true);
  }

  return (
    <section className="home">
      <div className="content">
        <nav>
          <img src={iEstilusLogo} alt="iEstilus Logo" />

          <div className="links-container">
            <span className="link">Baixe o app</span>
            <span onClick={() => navigateTo("/login")} className="link">
              Faça Login
            </span>

            <button onClick={() => navigateTo("/cadastro")}>
              Cadastre seu salão
            </button>
          </div>
        </nav>
      </div>
    </section>
  );
}
