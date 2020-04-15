import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Switch from "react-switch";
import InputMask from "react-input-mask";
import { FiImage, FiPlus } from "react-icons/fi";
import { useDropzone } from "react-dropzone";

import DropModal from "../../components/DropModal";

import "./styles.css";

export default function New() {
  const [navigating, setNavigating] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsAppAvailable, setWhatsAppAvailable] = useState(true);
  const [address, setAddress] = useState("");
  const [services, setServices] = useState([{ name: "", price: "" }]);

  useEffect(() => {
    document.title = "iEstilus | Novo Salão";

    setTimeout(() => {
      setNavigating(false);
    }, 2000);
  }, [navigating]);

  let history = useHistory();

  function navigateTo(pathname) {
    if (!navigating) {
      history.push({
        pathname,
        state: { transition: "slide-right", duration: 2000 },
      });
    }

    setNavigating(true);
  }

  function previewImageAndSetPhoto(file) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = function (e) {
      setPhoto(e.target.result);
    };
  }

  const onDrop = useCallback((acceptedFiles) => {
    previewImageAndSetPhoto(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <section className="new" {...getInputProps()}>
        <div className="content">
          <div className="title-container">
            <h1>Novo salão</h1>
          </div>
          <div className="input-container">
            <input
              type="text"
              className="input"
              placeholder="Nome do salão"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder="Breve descrição"
              maxLength={120}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <div className="image-container">
              <div
                className="image-preview"
                style={
                  photo === ""
                    ? { background: "var(--below-bg-color)" }
                    : { background: `url("${photo}")` }
                }
              >
                <FiImage
                  style={
                    photo === "" ? { display: "block" } : { display: "none" }
                  }
                  size="40px"
                  color="var(--input-text-color)"
                />
              </div>
              <div className="side">
                <p>
                  Araste aqui uma foto do salão ou selecione um arquivo abaixo
                </p>
                <label for="upload-photo">Selecione um arquivo</label>
                <input
                  type="file"
                  className="upload-photo"
                  id="upload-photo"
                  accept="image/png, image/jpeg"
                  onChange={(e) => previewImageAndSetPhoto(e.target.files[0])}
                />
              </div>
            </div>
            <div className="phone-input">
              <InputMask
                className="input"
                placeholder="Telefone de atendimento"
                mask={
                  phone.length >= 19
                    ? "+55 (99) 99999-9999"
                    : "+55 (99) 9999-99999"
                }
                maskChar={null}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <span>WhatsApp</span>
              <Switch
                checked={whatsAppAvailable}
                onChange={() => setWhatsAppAvailable(!whatsAppAvailable)}
                onColor="#9E783A"
                onHandleColor="#F6A821"
                handleDiameter={18}
                uncheckedIcon={false}
                checkedIcon={false}
                activeBoxShadow="0px 0px 0px 10px rgba(35, 38, 45, 0.5)"
                height={10}
                width={25}
                className="switch"
                id="material-switch"
              />
            </div>
            <input
              type="text"
              className="input"
              placeholder="Endereço"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="services-input">
              <span>Serviços</span>
              <div className="services-container">
                {services.map((service, serviceIndex) => (
                  <div className="service" key={serviceIndex}>
                    <input
                      type="text"
                      className="name"
                      placeholder="Nome do serviço"
                      value={services[serviceIndex].name}
                      onChange={(e) =>
                        setServices(
                          services.map((service, index) =>
                            index === serviceIndex
                              ? { ...service, name: e.target.value }
                              : service
                          )
                        )
                      }
                    />
                    <InputMask
                      className="price"
                      placeholder="Preço"
                      mask={
                        services[serviceIndex].price.length >= 8
                          ? services[serviceIndex].price.length >= 9
                            ? "R$ 999,99"
                            : "R$ 99,999"
                          : "R$ 9,999"
                      }
                      maskChar={null}
                      value={services[serviceIndex].price}
                      onChange={(e) =>
                        setServices(
                          services.map((service, index) =>
                            index === serviceIndex
                              ? { ...service, price: e.target.value }
                              : service
                          )
                        )
                      }
                    />
                  </div>
                ))}
                <div className="add-button">
                  <FiPlus
                    size="45px"
                    color="var(--below-bg-color)"
                    onClick={() =>
                      setServices([...services, { name: "", price: "" }])
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="submit-container">
            <button
              onClick={() => {
                navigateTo("/gerenciar");
              }}
            >
              Cadastrar
            </button>
          </div>
        </div>
        <DropModal display={isDragActive} />
      </section>
    </div>
  );
}
