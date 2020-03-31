import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import "./styles.css";

import firebaseAuth from "../../utils/firebaseAuth.js";

import superGSvg from "../../assets/super-g.svg";
import loginSvg from "../../assets/login-register.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = "iEstilus | Login";
  });

  let history = useHistory();

  function redirect() {
    history.push("/gerenciar");
  }

  const provider = new firebase.auth.GoogleAuthProvider();

  const firebasesignInWithEmailAndPassword = (email, password) => {
    firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(`Erro ${errorCode}:\n${errorMessage}`);
      });
  };

  const firebaseLoginWhithGoogle = () => {
    firebaseAuth
      .signInWithPopup(provider)
      .then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        alert(user.displayName);

        console.log(token);
        console.log(user);
        redirect();
      })
      .catch(function(error) {
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

  return (
    <section className="login">
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
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <h3>ou</h3>
          <button
            className="google-login"
            onClick={() => firebaseLoginWhithGoogle()}
          >
            <img src={superGSvg} alt="Google Logo" />
            Continuar com o Google
          </button>
        </div>
        <div className="submit-container">
          <button
            onClick={() => {
              firebasesignInWithEmailAndPassword(email, password);
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    </section>
  );
}
