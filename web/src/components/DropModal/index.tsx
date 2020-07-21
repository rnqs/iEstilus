import React from "react";
import Lottie from "react-lottie";

import animationData from "../../assets/lf30_editor_aWKfgA.json";
import "./styles.css";

interface props {
  display: boolean;
}

export default function DropModal({ display }: props) {
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
        <div className="svg">
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
        <h1>Arraste e solte</h1>
        <h2>Solte a imagem para fazer upload</h2>
      </section>
    </div>
  );
}
