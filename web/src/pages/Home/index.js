import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./styles.css";

import Header from "../../components/Header";

export default function Home() {
  const [navigating, setNavigating] = useState(true);

  useEffect(() => {
    document.title = "iEstilus";

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
        <Header
          links={[
            { text: "Baixe o app", onClick: () => {} },
            { text: "Faça Login", onClick: () => navigateTo("/login") }
          ]}
          button={{
            text: "Cadastre seu salão",
            onClick: () => navigateTo("/cadastro")
          }}
        />
      </div>
    </section>
  );
}
