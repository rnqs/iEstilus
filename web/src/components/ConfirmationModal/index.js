import React from "react";

import "./styles.css";

export default function ConfirmationModal({
  display,
  setDisplayed,
  submit,
  values,
  edit,
}) {
  const validURL = (str) => {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(str);
  };

  return (
    <div className={display ? "confirmation-modal" : "confirmation-modal-hide"}>
      <section>
        <div className="header">
          <h1>{edit ? "Confirme suas edições" : "Confirme os dados"}</h1>
          <h2>
            {edit
              ? "Depois de enviar seu salão já será atualizado"
              : "Depois de enviar seu salão já será publicado"}
          </h2>
        </div>
        <div className="info-container">
          {values.map((value) => {
            if (typeof value.value === "object") {
              return null;
            } else {
              return (
                <>
                  <div className="list-item" key={value.key}>
                    <span>{value.key + ":"}</span>
                    <span>
                      {typeof value.value === "boolean" ? (
                        value.value ? (
                          "Sim"
                        ) : (
                          "Não"
                        )
                      ) : validURL(value.value) ? (
                        <img
                          src={value.value}
                          alt={`Imagem do estabelecimento "${values[0].value}"`}
                        />
                      ) : (
                        value.value
                      )}
                    </span>
                  </div>
                  {values.length !== value.index && (
                    <div className="separator" />
                  )}
                </>
              );
            }
          })}
        </div>
        <div className="buttons">
          <button
            onClick={() => {
              setDisplayed(!display);
            }}
          >
            {edit ? "Voltar" : "Editar"}
          </button>
          <button
            onClick={() => {
              setDisplayed(!display);
              submit();
            }}
          >
            {edit ? "Confirmar" : "Publicar"}
          </button>
        </div>
      </section>
    </div>
  );
}
