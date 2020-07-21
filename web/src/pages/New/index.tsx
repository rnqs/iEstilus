import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import api from "../../services/api";
import getFirebaseIdToken from "../../utils/getFirebaseIdToken";

import EstablishmentForm from "../../components/EstablishmentForm";
import ConfirmationModal from "../../components/ConfirmationModal";

import "./styles.css";

interface Establishment {
  _id?: number;
  name: string;
  description: string;
  photoUrl: string;
  phone: string;
  whatsAppAvailable: boolean;
  address: string;
  latitude: string;
  longitude: string;
  services: Service[];
}

interface Service {
  _id?: number;
  name: string;
  price: string;
  photoUrl?: string;
}

export default function New() {
  const [navigating, setNavigating] = useState(true);
  const [formData, setFormData] = useState<Establishment>({
    name: "",
    description: "",
    photoUrl: "",
    phone: "",
    whatsAppAvailable: true,
    address: "",
    latitude: "",
    longitude: "",
    services: [{
      name: "",
      price: ""
    }]
  });
  const [inputError, setInputError] = useState(false);
  const [
    confirmationModalVisibility,
    setConfirmationModalVisibility,
  ] = useState(false);

  useEffect(() => {
    document.title = "iEstilus | Novo Salão";

    setTimeout(() => {
      setNavigating(false);
    }, 2000);
  }, [navigating]);

  let history = useHistory();

  function navigateTo(pathname: string) {
    if (!navigating) {
      history.push({
        pathname,
        state: { transition: "slide-right", duration: 2000 },
      });
    }

    setNavigating(true);
  }

  const handleSubmit = async () => {
    const idToken = await getFirebaseIdToken();
    if (!inputError && idToken) {
      try {
        const response = await api.post(
          "/establishments",
          {
            name: formData.name,
            description: formData.description,
            photo_url: formData.photoUrl,
            phone_number: formData.phone.replace(/\D/gim, ""),
            whatsapp_available: formData.whatsAppAvailable,
            address: formData.address,
            coordinate: {
              latitude: formData.latitude,
              longitude: formData.longitude,
            },
          },
          {
            headers: {
              authentication: idToken,
            },
          }
        );

        const establishmentId = response.data.id;

        formData.services.forEach(async (service) => {
          await api.post(
            `/establishments/${establishmentId}/services`,
            {
              name: service.name,
              photo_url: service.photoUrl,
              price:
                String(service.price).length >= 8
                  ? Number(
                    String(service.price)
                      .substr(3)
                      .replace(",", "")
                      .substr(
                        0,
                        String(service.price).substr(3).replace(",", "").length - 2
                      ) +
                    "." +
                    String(service.price).substr(3).replace(",", "").substr(-2)
                  )
                  : Number(String(service.price).substr(3).replace(",", ".")),
            },
            {
              headers: {
                authentication: idToken,
              },
            }
          );
        });

        navigateTo("/gerenciar");
      } catch (error) {
        alert("Algo deu errado\nTente novamente");
        console.error(error);
      }
    }
  };

  return (
    <div>
      <section id="new">
        <div className="content">
          <div className="title-container">
            <h1>Novo salão</h1>
          </div>
          <EstablishmentForm
            {...{
              formData,
              setFormData,
              setInputError,
              setConfirmationModalVisibility,
            }}
          />
        </div>
      </section>
      <ConfirmationModal
        display={confirmationModalVisibility}
        setDisplayed={setConfirmationModalVisibility}
        submit={() => handleSubmit()}
        values={[
          { key: "Nome", value: formData.name },
          { key: "Descrição", value: formData.description },
          { key: "Imagem", value: formData.photoUrl },
          { key: "Telefone de atendimento", value: formData.phone },
          { key: "Atende por WhatsApp", value: formData.whatsAppAvailable },
          { key: "Endereço", value: formData.address },
          { key: "Serviços", value: formData.services },
        ]}
      />
    </div>
  );
}
