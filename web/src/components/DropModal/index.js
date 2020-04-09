import React from "react";
import Lottie from "react-lottie";

import animationData from "../../assets/lf30_editor_aWKfgA.json";
import "./styles.css";

export default function DropModal({ display }) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className={display ? "drop-modal" : "drop-modal-hide"}>
      <section>
        <Lottie
          className="svg"
          options={defaultOptions}
          height={400}
          width={400}
        />
        <h1>Arraste e solte</h1>
        <h2>Solte a imagem para fazer upload</h2>
      </section>
    </div>
  );
}
