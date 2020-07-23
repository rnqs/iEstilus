import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./styles.css";

import Header from "../../components/Header";

export default function Home() {
  const [navigating, setNavigating] = useState(true);
  const [menuOpened, setMenuOpened] = useState(false);

  useEffect(() => {
    document.title = "iEstilus | Busca e agendamento de serviços de estética";

    setTimeout(() => {
      setNavigating(false);
    }, 2000);
  }, [navigating]);

  let history = useHistory();

  function navigateTo(pathname: string) {
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
          menuStatus={setMenuOpened}
        />
        <div className="container">
          <h1>A melhor forma de encontrar o serviço de estética ideal</h1>
          <p>O iEstilus aproxima clientes, salões de beleza e barbearias, facilitando a busca, comparação e agendamento de serviço de estética.</p>
          <span></span>
          <div className={`image ${menuOpened && 'invisible'}`} />
          <div className="buttons">
            <button
              className="main"
              onClick={() => {
                window.location.assign("https://app.iestilus.com/");
              }}
            >
              Busque um serviço
            </button>
            <button onClick={() => navigateTo("/cadastro")}>
              Cadastre seu salão hoje mesmo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
