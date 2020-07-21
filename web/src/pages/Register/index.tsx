import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import "./styles.css";

import api from "../../services/api";

import firebaseAuth from "../../utils/firebaseAuth";

import superGSvg from "../../assets/super-g.svg";
import registerSvg from "../../assets/login-register.svg";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vPass, setVPass] = useState<boolean>();

  useEffect(() => {
    document.title = "iEstilus | Cadastro";
  });

  const provider = new firebase.auth.GoogleAuthProvider();

  let history = useHistory();

  const createUserOnApi = async (jwt: string) => {
    try {
      await api.post("/managers", {}, { headers: { authentication: jwt } });

      redirect();
    } catch (error) {
      alert("Erro ao comunicar com o servidor.");
    }
  };

  const redirect = () => history.push("/gerenciar");

  const firebaseCreateUserWithEmailAndPassword = (
    email: string,
    password: string
  ) => {
    firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(
        async (authData) => {
          authData.user?.sendEmailVerification();

          if (authData.user === null) return;

          const idToken = await authData.user.getIdToken();

          createUserOnApi(idToken);
        },
        function (error) {
          alert("Erro no envio do email de confirmação.");
        }
      )
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === "auth/weak-password") {
          alert("A senha é muito fácil.");
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  };

  const firebaseLoginWithGoogle = () => {
    firebaseAuth
      .signInWithPopup(provider)
      .then(async (result) => {
        if (result.user === null) return;

        const idToken = await result.user.getIdToken();

        createUserOnApi(idToken);
      })
      .catch(function (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
        console.error(errorCode, errorMessage, email, credential);
      });
  };

  return (
    <section id="register">
      <div className="content">
        <div className="title-container">
          <h1>Cadastre-se</h1>
        </div>
        <div className="svg-container">
          <img src={registerSvg} alt="Cadastrar" />
        </div>
        <div className="input-container">
          <input
            type="email"
            className="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            className={vPass === false ? "password pass-err" : "password"}
            placeholder="Confirme a Senha"
            onChange={(e) =>
              e.target.value === password ? setVPass(true) : setVPass(false)
            }
          />
          <h3>ou</h3>
          <button
            className="google-register"
            onClick={() => firebaseLoginWithGoogle()}
          >
            <img src={superGSvg} alt="Google Logo" />
            Continuar com o Google
          </button>
          <span onClick={() => history.push("/")}>Já tenho conta</span>
        </div>
        <div className="submit-container">
          <button
            onClick={() =>
              vPass && firebaseCreateUserWithEmailAndPassword(email, password)
            }
          >
            Enviar
          </button>
        </div>
      </div>
    </section>
  );
}
