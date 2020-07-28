import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import api, { Establishment as ApiEstablishment } from "../../services/api";
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

export default function Edit() {
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
  const [originalServicesIds, setOriginalServicesIds] = useState([""]);
  const [inputError, setInputError] = useState(false);
  const [
    confirmationModalVisibility,
    setConfirmationModalVisibility,
  ] = useState(false);
  const [establishmentId, setEstablishmentId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "iEstilus | Editar Salão";

    setTimeout(() => {
      setNavigating(false);
    }, 2000);

    setEstablishmentId(() => {
      const urlNumbers = document.URL.replace(/^\D+/g, "").split("editar/");
      return urlNumbers[urlNumbers.length - 1].replace("/", "");
    });

    if (establishmentId === "") {
      navigateTo("/gerenciar");
    } else {
      fetchEstablishmentData();
    }

    // eslint-disable-next-line
  }, [navigating]);

  let history = useHistory();

  const fetchEstablishmentData = async () => {
    const idToken = await getFirebaseIdToken();
    try {
      const response = await api.get<ApiEstablishment>("/managers/establishments", {
        headers: { authentication: idToken },
        params: { id: establishmentId },
      });

      setFormData({
        name: response.data.name,
        description: response.data.description,
        photoUrl: response.data.photo_url,
        phone: response.data.phone_number,
        whatsAppAvailable: response.data.whatsapp_available,
        address: response.data.address,
        latitude: String(response.data.coordinate.latitude),
        longitude: String(response.data.coordinate.longitude),
        services: response.data.services.map((service) => {
          return {
            _id: service._id,
            name: service.name,
            price: "R$ " + service.price,
            photoUrl: service.photo_url
          }
        }),
      })

      setOriginalServicesIds(
        response.data.services.map((service) => String(service._id))
      );

      setLoading(false);
    } catch (error) {
      navigateTo("/gerenciar");
    }
  };

  const deleteEstablishment = async () => {
    const idToken = await getFirebaseIdToken();
    if (
      window.confirm(
        `Você tem certeza que deseja excluir o salão "${formData.name}" permanentemente?`
      )
    ) {
      try {
        await api.delete("/establishments/" + establishmentId, {
          headers: { authentication: idToken },
        });

        navigateTo("/gerenciar");
      } catch (error) {
        navigateTo("/gerenciar");
      }
    } else {
      return true
    }
  };

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
        await api.put(
          `/establishments/${establishmentId}`,
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

        let toDeleteServicesIds = originalServicesIds;

        formData.services.forEach(async (service) => {
          if (service._id) {
            toDeleteServicesIds = toDeleteServicesIds.filter(
              (id) => id !== String(service._id)
            );
            await api.put(
              `/establishments/${establishmentId}/services/${service._id}`,
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
          } else {
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
          }
        });

        toDeleteServicesIds.forEach(async (serviceId) => {
          await api.delete(
            `/establishments/${establishmentId}/services/${serviceId}`,
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
      <section id="edit">
        <div className="content">
          {loading
            ? null
            : (
              <>
                <div className="title-container">
                  <h1>Editar salão</h1>
                </div>
                <EstablishmentForm
                  {...{
                    formData,
                    setFormData,
                    setInputError,
                    deleteEstablishment,
                    setConfirmationModalVisibility,
                  }}
                />
              </>
            )
          }
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
        edit
      />
    </div>
  );
}
