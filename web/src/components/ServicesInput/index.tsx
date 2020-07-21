import React from "react";
import InputMask from "react-input-mask";
import { FiImage, FiPlus, FiX, FiCheckSquare } from "react-icons/fi";

import getIndexOfUnfilledFields from "../../utils/getIndexOfUnfilledFields";

import "./styles.css";

interface Props {
  services: Service[];
  uploadToFirebase: Function;
  setServices: (services: Service[]) => void;
  setInputError: (inputError: boolean) => void;
}

interface Service {
  _id?: number;
  name: string;
  price: string;
  photoUrl?: string;
}

const ServicesInput: React.FC<Props> = ({ services, setServices, setInputError, uploadToFirebase }) => (
  <div id="services-input">
    <span>Serviços</span>
    <div className="services-container">
      {services.map((service, serviceIndex) => (
        <div className="service" key={String(service)}>
          <input
            type="text"
            className="name"
            placeholder="Nome do serviço"
            value={services[serviceIndex].name}
            onChange={(e) => {
              if (e.target.value && services[serviceIndex].price) {
                setInputError(false);
                document
                  .querySelectorAll("div.service")
                [serviceIndex].classList.remove("error");
              }
              setServices(
                services.map((service, index) =>
                  index === serviceIndex
                    ? { ...service, name: e.target.value }
                    : service
                )
              );
            }}
          />
          <InputMask
            className="price"
            placeholder="Preço"
            mask={
              String(services[serviceIndex].price).length >= 8
                ? String(services[serviceIndex].price).length >= 9
                  ? "R$ 999,99"
                  : "R$ 99,999"
                : "R$ 9,999"
            }
            maskChar={null}
            value={services[serviceIndex].price}
            onChange={(e) => {
              if (
                e.target.value !== "R$ " &&
                services[serviceIndex].name
              ) {
                setInputError(false);
                document
                  .querySelectorAll("div.service")
                [serviceIndex].classList.remove("error");
              }
              setServices(
                services.map((service, index) =>
                  index === serviceIndex
                    ? { ...service, price: e.target.value }
                    : service
                )
              );
            }}
          />
          <label htmlFor={`upload-service-photo-${serviceIndex}`}>
            {services[serviceIndex].photoUrl ? (
              <FiCheckSquare
                size="20px"
                style={{
                  marginTop: 6.5,
                  marginLeft: 10,
                  cursor: "pointer",
                }}
                color="var(--bg-color)"
              />
            ) : (
                <FiImage
                  size="20px"
                  style={{
                    marginTop: 6.5,
                    marginLeft: 10,
                    cursor: "pointer",
                  }}
                  color="var(--bg-color)"
                />
              )}
          </label>
          <input
            type="file"
            className="upload-photo"
            id={`upload-service-photo-${serviceIndex}`}
            accept="image/png, image/jpeg"
            onChange={(e) => {
              if (e.target.files) {
                uploadToFirebase(
                  e.target.files[0],
                  "services/",
                  (photoUrl: string) =>
                    setServices(
                      services.map((service, index) =>
                        index === serviceIndex
                          ? {
                            ...service,
                            photoUrl,
                          }
                          : service
                      )
                    )
                );
              }
            }}
          />
          {services.length > 1 && (
            <FiX
              size="20px"
              style={{
                marginLeft: 10,
                cursor: "pointer",
              }}
              color="var(--bg-color)"
              onClick={() => {
                setInputError(false);
                document
                  .querySelectorAll("div.service")
                [serviceIndex].classList.remove("error");
                setServices(
                  services.filter(
                    (item, index) => item && index !== serviceIndex
                  )
                );
              }}
            />
          )}
        </div>
      ))}
      <div className="add-button">
        <FiPlus
          size="45px"
          color="var(--below-bg-color)"
          onClick={() => {
            let indexOfUnfilledFields = getIndexOfUnfilledFields(
              services
            );
            if (indexOfUnfilledFields.length === 0) {
              setServices([...services, { name: "", price: "" }]);
            } else {
              let serviceDivs = document.querySelectorAll(
                "div.service"
              );
              setInputError(true);
              // eslint-disable-next-line array-callback-return
              indexOfUnfilledFields.map((index) => {
                // eslint-disable-next-line array-callback-return
                if (index === null) return;
                serviceDivs[index].classList.add("error");
              });
            }
          }}
        />
      </div>
    </div>
  </div>
);

export default ServicesInput;
