import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import "./styles.css";

import api from "../../services/api";
import firebaseAuth from "../../utils/firebaseAuth";

import superGSvg from "../../assets/super-g.svg";
import loginSvg from "../../assets/login-register.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = "iEstilus | Login";
  });

  let history = useHistory();

  const redirect = () => history.push("/gerenciar");

  const provider = new firebase.auth.GoogleAuthProvider();

  const firebaseSignInWithEmailAndPassword = (email, password) => {
    firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(function (result) {
        redirect();
      })
      .catch(function (error) {
        const errorCode = error.code;

        document.querySelector("input.password").classList.add("error");

        if (errorCode !== "auth/wrong-password") {
          document.querySelector("input.email").classList.add("error");
        }
      });
  };

  const firebaseLoginWithGoogle = () => {
    firebaseAuth
      .signInWithPopup(provider)
      .then(async (result) => {
        const idToken = await result.user.getIdToken();

        createUserOnApi(idToken);
      })
      .catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        console.error(errorCode, errorMessage, email, credential);
      });
  };

  const createUserOnApi = async (jwt) => {
    try {
      await api.post("/managers", {}, { headers: { authentication: jwt } });

      redirect();
    } catch (error) {
      alert("Erro ao comunicar com o servidor.");
    }
  };

  const firebaseForgetPassword = () => {
    if (!email) {
      setEmail(prompt("Qual o email da sua conta?", "Email"));
      if (!email) {
        alert("Algo deu errado\nTente novamente");
        return;
      }
    }
    firebaseAuth
      .sendPasswordResetEmail(email)
      .then(function () {
        alert(
          "Email de recuperação enviado com sucesso\nVerifeque tambem na caixa de spans"
        );
      })
      .catch(function (error) {
        alert("Algo deu errado\nTente novamente");
      });
  };

  return (
    <section id="login">
      <div className="content">
        <div className="title-container">
          <h1>Login</h1>
        </div>
        <div className="svg-container">
          <img src={loginSvg} alt="Login" />
        </div>
        <div className="input-container">
          <input
            type="email"
            className="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              e.target.classList.remove("error");
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            className="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => {
              e.target.classList.remove("error");
              setPassword(e.target.value);
            }}
          />
          <h3>ou</h3>
          <button
            className="google-login"
            onClick={() => firebaseLoginWithGoogle()}
          >
            <img src={superGSvg} alt="Google Logo" />
            Continuar com o Google
          </button>
          <span onClick={() => firebaseForgetPassword()}>
            Esqueci minha senha
          </span>
        </div>
        <div className="submit-container">
          <button
            onClick={() => {
              firebaseSignInWithEmailAndPassword(email, password);
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    </section>
  );
}
