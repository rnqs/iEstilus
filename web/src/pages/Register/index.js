import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import "./styles.css";

import firebaseAuth from "../../utils/firebaseAuth.js";

import superGSvg from "../../assets/super-g.svg";
import registerSvg from "../../assets/login-register.svg";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vPass, setVPass] = useState(null);

  useEffect(() => {
    document.title = "iEstilus | Cadastro";
  });

  const provider = new firebase.auth.GoogleAuthProvider();

  let history = useHistory();

  function redirect() {
    history.push("/gerenciar");
  }

  const firebaseCreateUserWithEmailAndPassword = (email, password) => {
    firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then(
        function (authData) {
          authData.user.sendEmailVerification();
          redirect();
        },
        function (error) {
          alert("Erro no envio do email de confirmação.");
        }
      )
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === "auth/weak-password") {
          alert("The password is too weak.");
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  };

  const firebaseLoginWithGoogle = () => {
    firebaseAuth
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        console.log(token);
        console.log(user);
        redirect();
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

  return (
    <section className="register">
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
        </div>
        <div className="submit-container">
          <button
            onClick={() =>
              firebaseCreateUserWithEmailAndPassword(email, password)
            }
          >
            Enviar
          </button>
        </div>
      </div>
    </section>
  );
}
