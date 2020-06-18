import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import SkeletonLoader from "tiny-skeleton-loader-react";
import { useHistory } from "react-router-dom";
import "./styles.css";

import getFirebaseIdToken from "../../utils/getFirebaseIdToken";
import firebaseAuth from "../../utils/firebaseAuth.js";
import api from "../../services/api";

import Header from "../../components/Header";

export default function Home() {
  const [navigating, setNavigating] = useState(true);
  const [greetings, setGreetings] = useState("");
  const [establishments, setEstablishments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

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

    fetchUserEstablishmentsData();

    setTimeout(() => {
      setNavigating(false);
    }, 2000);
  }, []);

  let history = useHistory();

  const fetchUserEstablishmentsData = async () => {
    const idToken = await getFirebaseIdToken();

    const response = await api.get("/managers/establishments", {
      headers: { authentication: idToken },
    });

    setLoadingData(false);

    setEstablishments(response.data);
  };

  const navigateTo = (pathname) => {
    if (!navigating) {
      history.push({
        pathname,
        state: { transition: "slide-left", duration: 2000 },
      });
    }

    setNavigating(true);
  };

  const logOut = () => {
    firebaseAuth
      .signOut()
      .then(
        history.push({
          pathname: "/login",
          state: { transition: "slide-left", duration: 2000 },
        })
      )
      .catch(function (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(`Erro ${errorCode}:\n${errorMessage}`);
      });
  };

  return (
    <section id="dashboard">
      <div className="content">
        <Header
          links={[{ text: "Fazer logout", onClick: () => logOut() }]}
          button={{
            text: "Baixar o app",
            onClick: () => navigateTo("/cadastro"),
          }}
        />

        <h1>{greetings}, seus salões estão listados abaixo</h1>

        <div className="list-establishments-container">
          {loadingData && (
            <SkeletonLoader
              width="calc(100% - 40px)"
              background="var(--input-bg-color)"
              height={150}
              style={{ margin: 20, maxWidth: 540, borderRadius: 10 }}
            />
          )}
          {establishments.map((establishment) => (
            <div
              className="establishment-container"
              key={establishment._id}
              onClick={() => navigateTo("/editar/" + establishment._id)}
            >
              <div className="image-container">
                <div
                  className="image"
                  style={{ background: `url("${establishment.photo_url}")` }}
                ></div>
              </div>
              <div className="info-container">
                <span className="title">{establishment.name}</span>
                <p className="description">{establishment.description}</p>
                <button>Alterar</button>
              </div>
            </div>
          ))}
        </div>

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
