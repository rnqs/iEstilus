import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Switch from "react-switch";
import InputMask from "react-input-mask";
import { FiImage, FiPlus, FiX, FiCheckSquare, FiMapPin } from "react-icons/fi";

import api from "../../services/api";
import { bingMapsApi, apiKey } from "../../services/bingMapsApi";
import getFirebaseIdToken from "../../utils/getFirebaseIdToken";
import firebaseStorage from "../../utils/firebaseStorage";

import ConfirmationModal from "../../components/ConfirmationModal";
import "./styles.css";

export default function New() {
  const [navigating, setNavigating] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsAppAvailable, setWhatsAppAvailable] = useState(true);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [services, setServices] = useState([{ name: "", price: "" }]);
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

  function navigateTo(pathname) {
    if (!navigating) {
      history.push({
        pathname,
        state: { transition: "slide-right", duration: 2000 },
      });
    }

    setNavigating(true);
  }

  const uploadToFirebase = (file, path, callback) => {
    const fileName = `${new Date().getTime()}-${file.name}`;

    const storageRef = firebaseStorage.ref();

    const uploadTask = storageRef.child(path + fileName).put(file);

    uploadTask.on("state_changed", () => {
      uploadTask.snapshot.ref.getDownloadURL().then(callback);
    });
  };

  const getIndexOfUnfilledFields = (arrayOfObjects) => {
    return arrayOfObjects
      .map(
        (object, objectIndex) =>
          Object.values(object)
            .map((value) => (value === "" ? objectIndex : null))
            .filter((item) => item !== null)[0]
      )
      .filter((index) => index !== undefined);
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        setLatitude(latitude);
        setLongitude(longitude);

        const response = await bingMapsApi.get(`/${latitude},${longitude}`, {
          params: {
            includeEntityTypes: "Address",
            key: apiKey,
          },
        });

        setAddress(
          response.data.resourceSets[0].resources[0].address.formattedAddress
        );
      },
      (err) => {
        console.log(err);
      },
      {
        timeout: 30000,
      }
    );
  };

  const addInputError = (id) => {
    setInputError(true);
    document.querySelector("#" + id).classList.add("error");
  };

  const removeInputError = (id) => {
    setInputError(false);
    document.querySelector("#" + id).classList.remove("error");
  };

  const validateData = () => {
    if (!name) addInputError("name");
    if (!description) addInputError("description");
    if (phone.length < 18) addInputError("phone");
    if (!photoUrl) addInputError("image");
    let indexOfUnfilledFields = getIndexOfUnfilledFields(services);
    if (indexOfUnfilledFields.length > 0) {
      let serviceDivs = document.querySelectorAll("div.service");
      setInputError(true);
      indexOfUnfilledFields.map((index) =>
        serviceDivs[index].classList.add("error")
      );
    }
  };

  const verifyAddressAndGetLatitudeAndLongitude = async () => {
    try {
      if (address) {
        const response = await bingMapsApi.get(`/${address}`, {
          params: {
            maxResults: 1,
            key: apiKey,
          },
        });

        const results = response.data.resourceSets[0].resources;

        if (results.length === 0) {
          addInputError("address");
          return false;
        } else {
          setAddress(results[0].address.formattedAddress);
          setLatitude(results[0].point.coordinates[0]);
          setLongitude(results[0].point.coordinates[1]);
          setInputError(false);
          return true;
        }
      } else {
        addInputError("address");
        return false;
      }
    } catch (error) {
      addInputError("address");
      return false;
    }
  };

  const handleSubmit = async () => {
    const idToken = await getFirebaseIdToken();
    if (!inputError && idToken) {
      try {
        const response = await api.post(
          "/establishments",
          {
            name,
            description,
            photo_url: photoUrl,
            phone_number: phone.replace(/\D/gim, ""),
            whatsapp_available: whatsAppAvailable,
            address,
            coordinate: {
              latitude,
              longitude,
            },
          },
          {
            headers: {
              authentication: idToken,
            },
          }
        );

        const establishmentId = response.data.id;

        services.forEach(async (service) => {
          await api.post(
            `/establishments/${establishmentId}/services`,
            {
              name: service.name,
              photo_url: service.photoUrl,
              price:
                service.price.length >= 8
                  ? Number(
                      service.price
                        .substr(3)
                        .replace(",", "")
                        .substr(
                          0,
                          service.price.substr(3).replace(",", "").length - 2
                        ) +
                        "." +
                        service.price.substr(3).replace(",", "").substr(-2)
                    )
                  : Number(service.price.substr(3).replace(",", ".")),
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
          <div className="input-container">
            <input
              type="text"
              className="input"
              id="name"
              placeholder="Nome do salão"
              value={name}
              onChange={(e) => {
                removeInputError("name");
                setName(e.target.value);
              }}
            />
            <textarea
              placeholder="Breve descrição"
              id="description"
              maxLength={120}
              value={description}
              onChange={(e) => {
                removeInputError("description");
                setDescription(e.target.value);
              }}
            ></textarea>
            <div className="image-container">
              <div
                className="image-preview"
                style={
                  photoUrl === ""
                    ? { background: "var(--below-bg-color)" }
                    : { background: `url("${photoUrl}")` }
                }
              >
                <FiImage
                  style={
                    photoUrl === "" ? { display: "block" } : { display: "none" }
                  }
                  size="40px"
                  color="var(--input-text-color)"
                />
              </div>
              <div className="side">
                <p>Selecione um arquivo abaixo</p>
                <label for="upload-photo" id="image">
                  Selecione um arquivo
                </label>
                <input
                  type="file"
                  className="upload-photo"
                  id="upload-photo"
                  accept="image/png, image/jpeg"
                  onChange={(e) => {
                    removeInputError("image");
                    uploadToFirebase(
                      e.target.files[0],
                      "establishments/",
                      (photoUrl) => {
                        setPhotoUrl(photoUrl);
                      }
                    );
                  }}
                />
              </div>
            </div>
            <div className="phone-input">
              <InputMask
                className="input"
                id="phone"
                placeholder="Telefone de atendimento"
                mask={
                  phone.length >= 19
                    ? "+99 (99) 99999-9999"
                    : "+99 (99) 9999-99999"
                }
                maskChar={null}
                value={phone}
                onFocus={() => phone || setPhone("55")}
                onBlur={() => phone === "55" && setPhone("")}
                onChange={(e) => {
                  if (phone.length > 16) {
                    setInputError(false);
                    e.target.classList.remove("error");
                  }
                  setPhone(e.target.value);
                }}
              />
              <label for="material-switch">
                <span>WhatsApp</span>
              </label>
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
            <div className="address-input">
              <input
                type="text"
                className="input"
                id="address"
                placeholder="Endereço"
                value={address}
                onChange={(e) => {
                  removeInputError("address");
                  setAddress(e.target.value);
                }}
              />
              <FiMapPin
                size="24px"
                className="pinIcon"
                onClick={() => {
                  removeInputError("address");
                  getCurrentLocation();
                }}
              />
            </div>
            <div className="services-input">
              <span>Serviços</span>
              <div className="services-container">
                {services.map((service, serviceIndex) => (
                  <div className="service" key={service}>
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
                        services[serviceIndex].price.length >= 8
                          ? services[serviceIndex].price.length >= 9
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
                    <label for={`upload-service-photo-${serviceIndex}`}>
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
                        if (e.target.files[0]) {
                          uploadToFirebase(
                            e.target.files[0],
                            "services/",
                            (photoUrl) =>
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
                          serviceDivs[index].classList.add("error");
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="submit-container">
            <button
              onClick={async () => {
                const success = await verifyAddressAndGetLatitudeAndLongitude();
                validateData();
                let indexOfUnfilledFields = getIndexOfUnfilledFields(services);
                if (
                  success &&
                  name &&
                  description &&
                  phone.length >= 18 &&
                  photoUrl &&
                  indexOfUnfilledFields.length === 0
                ) {
                  setConfirmationModalVisibility(true);
                }
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      </section>
      <ConfirmationModal
        display={confirmationModalVisibility}
        setDisplayed={setConfirmationModalVisibility}
        submit={() => handleSubmit()}
        values={[
          { key: "Nome", value: name },
          {
            key: "Descrição",
            value: description,
          },
          {
            key: "Imagem",
            value: photoUrl,
          },
          {
            key: "Telefone de atendimento",
            value: phone,
          },
          { key: "Atende por WhatsApp", value: whatsAppAvailable },
          {
            key: "Endereço",
            value: address,
          },
          {
            key: "Serviços",
            value: services,
          },
        ]}
      />
    </div>
  );
}
