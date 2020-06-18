import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./styles.css";

import Header from "../../components/Header";

export default function Home() {
  const [navigating, setNavigating] = useState(true);

  useEffect(() => {
    document.title = "iEstilus | Busca e agendamento de serviços de estética";

    setTimeout(() => {
      setNavigating(false);
    }, 2000);
  }, [navigating]);

  let history = useHistory();

  function navigateTo(pathname) {
    if (!navigating) {
      history.push({
        pathname,
        state: { transition: "slide-left", duration: 2000 },
      });
    }

    setNavigating(true);
  }

  return (
    <section id="home">
      <div className="content">
        <Header
          links={[
            {
              text: "Usar o app",
              onClick: () => {
                window.location.assign("https://app.iestilus.com/");
              },
            },
            { text: "Faça Login", onClick: () => navigateTo("/login") },
          ]}
          button={{
            text: "Cadastre seu salão",
            onClick: () => navigateTo("/cadastro"),
          }}
        />

        <div className="image-background-container">
          <h1>Facilitamos a busca e agendamento de serviços de estética.</h1>
          <div className="buttons">
            <button onClick={() => navigateTo("/cadastro")}>
              Cadastre seu salão hoje mesmo
            </button>
            <button
              onClick={() => {
                window.location.assign("https://app.iestilus.com/");
              }}
            >
              Buscar um serviço
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
