import React, { useState } from "react";
import {
  useHistory
} from "react-router-dom";
import firebase from "firebase";
import "./styles.css";

import firebaseAuth from "../../utils/firebaseAuth.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    let history = useHistory();

    function redirect() {
      history.push("/gerenciar");
    }

  const provider = new firebase.auth.GoogleAuthProvider();

  const firebasesignInWithEmailAndPassword = (email, password) => {
    firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .catch(function (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(`Erro ${errorCode}:\n${errorMessage}`)
      });
  };

  const firebaseLoginWhithGoogle = () => {
    firebaseAuth.signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = result.credential.accessToken;
      // The signed-in user info.
      const user = result.user;
  
      alert(user.displayName);
      
      console.log(token);
      console.log(user);
      redirect();
    }).catch(function (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      console.error(errorCode, errorMessage, email, credential)
    });
  }

  return (
    <main>
      <section>
        <div className="title-container">
          <h1>Login</h1>
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
            className = "google-login"
            onClick = {() => firebaseLoginWhithGoogle()}
          >
            <svg
              className="google-svg"
              width="22"
              height="22"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.02767 3.40574C10.6216 3.40574 11.6968 4.09425 12.3099 4.66958L14.7055 2.33054C13.2342 0.96295 11.3196 0.123535 9.02767 0.123535C5.70774 0.123535 2.84052 2.02873 1.44464 4.80163L4.18925 6.93317C4.87776 4.88651 6.78295 3.40574 9.02767 3.40574Z"
                fill="#EA4335"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.1767 8.80061C17.1767 8.10267 17.1201 7.59336 16.9975 7.06519H9.02777V10.2154H13.7059C13.6115 10.9982 13.1022 12.1771 11.9704 12.9694L14.649 15.0443C16.2524 13.5636 17.1767 11.3849 17.1767 8.80061Z"
                fill="#4285F4"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.19878 10.2908C4.01958 9.76267 3.91583 9.19678 3.91583 8.61202C3.91583 8.02725 4.01958 7.46136 4.18935 6.93318L1.44474 4.80164C0.869414 5.95229 0.539307 7.24443 0.539307 8.61202C0.539307 9.9796 0.869414 11.2717 1.44474 12.4224L4.19878 10.2908Z"
                fill="#FBBC05"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.0277 17.1005C11.3196 17.1005 13.2436 16.346 14.649 15.0444L11.9704 12.9695C11.2536 13.4694 10.2915 13.8183 9.0277 13.8183C6.78297 13.8183 4.87778 12.3376 4.19871 10.2909L1.4541 12.4224C2.84998 15.1953 5.70777 17.1005 9.0277 17.1005Z"
                fill="#34A853"
              />
            </svg>
            Continuar com o Google
          </button>
        </div>
        <div className="submit-container">
          <button
            onClick={() => {
              firebasesignInWithEmailAndPassword(email, password)
            }}
          >
            Entrar
          </button>
        </div>
      </section>
    </main>
  );
}
