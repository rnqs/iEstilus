import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import "./styles.css";

import firebaseAuth from "../../utils/firebaseAuth.js";

import Header from "../../components/Header";

export default function Home() {
  const [navigating, setNavigating] = useState(true);
  const [greetings, setGreetings] = useState("");

  useEffect(() => {
    document.title = "iEstilus | Gerenciar";

    const date = new Date();
    const hours = date.getHours();

    if (hours >= 5 && hours < 12) {
      setGreetings("Bom dia");
    } else {
      if (hours >= 12 && hours < 21) {
        setGreetings("Boa tarde");
      } else {
        setGreetings("Boa noite");
      }
    }

    setTimeout(() => {
      setNavigating(false);
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigating, greetings]);

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

  function logOut() {
    firebaseAuth
      .signOut()
      .then(
        history.push({
          pathname: "/login",
          state: { transition: "slide-left", duration: 2000 }
        })
      )
      .catch(function(error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(`Erro ${errorCode}:\n${errorMessage}`);
      });
  }

  return (
    <section className="dashboard">
      <div className="content">
        <Header
          links={[{ text: "Fazer logout", onClick: () => logOut() }]}
          button={{
            text: "Baixar o app",
            onClick: () => navigateTo("/cadastro")
          }}
        />

        <h1>{greetings}, seus salões estão listados abaixo</h1>

        <div className="new-establishment">
          <button
            onClick={() => {
              navigateTo("/novo");
            }}
          >
            <p>Adicionar salão</p>
            <FiPlus size="45px" color="var(--main-color)" />
          </button>
        </div>
      </div>
    </section>
  );
}
