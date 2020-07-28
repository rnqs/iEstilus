import React, { useState, useEffect } from 'react';

import { bingMapsApi, apiKey } from "../../services/bingMapsApi";
import firebaseStorage from "../../utils/firebaseStorage";
import getIndexOfUnfilledFields from "../../utils/getIndexOfUnfilledFields";

import Input from "../Input";
import ImageInput from "../ImageInput";
import PhoneInput from "../PhoneInput";
import AddressInput from "../AddressInput";
import ServicesInput from "../ServicesInput";

import './styles.css';

interface Props {
  formData: Establishment;
  deleteEstablishment?: Function;
  setInputError: (inputError: boolean) => void;
  setFormData: (formData: Establishment) => void;
  setConfirmationModalVisibility: (confirmationModalVisibility: boolean) => void;
}

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

const EstablishmentForm: React.FC<Props> = ({
  deleteEstablishment,
  formData,
  setFormData,
  setInputError,
  setConfirmationModalVisibility
}) => {
  const [name, setName] = useState(formData.name);
  const [description, setDescription] = useState(formData.description);
  const [photoUrl, setPhotoUrl] = useState(formData.photoUrl);
  const [phone, setPhone] = useState(formData.phone);
  const [whatsAppAvailable, setWhatsAppAvailable] = useState(formData.whatsAppAvailable);
  const [address, setAddress] = useState(formData.address);
  const [latitude, setLatitude] = useState(formData.latitude);
  const [longitude, setLongitude] = useState(formData.longitude);
  const [services, setServices] = useState(formData.services);
  const [isDeleteEstablishment, setIsDeleteEstablishment] = useState(false);

  useEffect(() => {
    setFormData({
      name, description, photoUrl, phone, whatsAppAvailable, address, latitude, longitude, services
    })
  }, [name, description, photoUrl, phone, whatsAppAvailable, address, latitude, longitude, services, setFormData])

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        setLatitude(String(latitude));
        setLongitude(String(longitude));

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

  const uploadToFirebase = (file: File, path: string, callback: (photoUrl: string) => void) => {
    const fileName = `${new Date().getTime()}-${file.name}`;

    const storageRef = firebaseStorage.ref();

    const uploadTask = storageRef.child(path + fileName).put(file);

    uploadTask.on("state_changed", () => {
      uploadTask.snapshot.ref.getDownloadURL().then(callback);
    });
  };

  const addInputError = (id: string) => {
    setInputError(true);
    document.querySelector("#" + id)?.classList.add("error");

    if (id === "address")
      document
        .querySelector(".address-input-error-message")
        ?.classList.add("active");
  };

  const removeInputError = (id: string) => {
    setInputError(false);
    document.querySelector("#" + id)?.classList.remove("error");
  };

  const validateData = () => {
    if (!name) addInputError("name");
    if (!description) addInputError("description");
    if ((phone.length < 18 && phone.substr(0, 1) === '+') || phone === "") addInputError("phone");
    if (!photoUrl) addInputError("image");
    let indexOfUnfilledFields = getIndexOfUnfilledFields(services);
    if (indexOfUnfilledFields.length > 0) {
      let serviceDivs = document.querySelectorAll("div.service");
      setInputError(true);
      // eslint-disable-next-line array-callback-return
      indexOfUnfilledFields.map((index) => {
        // eslint-disable-next-line array-callback-return
        if (index === null) return;
        serviceDivs[index].classList.add("error")
      });
    }
  };

  return (
    <form
      id="establishment-form"
      onSubmit={async (e) => {
        e.preventDefault();

        if (isDeleteEstablishment) return;

        const success = await verifyAddressAndGetLatitudeAndLongitude();
        validateData();
        let indexOfUnfilledFields = getIndexOfUnfilledFields(services);
        if (
          success &&
          name &&
          description &&
          (phone.length >= 18 || (phone.substr(0, 1) !== '+' && phone !== "")) &&
          photoUrl &&
          indexOfUnfilledFields.length === 0
        ) {
          setConfirmationModalVisibility(true);
        }
      }}
    >
      <div className="input-container">
        <Input
          id="name"
          placeholder="Nome do salão"
          value={name}
          setValue={setName}
          removeInputError={removeInputError}
        />
        <Input
          id="description"
          placeholder="Breve descrição"
          multiline={true}
          value={description}
          setValue={setDescription}
          removeInputError={removeInputError}
        />
        <ImageInput
          photoUrl={photoUrl}
          onChange={(e) => {
            removeInputError("image");
            if (e.target.files) {
              uploadToFirebase(
                e.target.files[0],
                "establishments/",
                (photoUrl) => {
                  setPhotoUrl(photoUrl);
                }
              );
            }
          }}
        />
        <PhoneInput
          {...{
            phone,
            setPhone,
            whatsAppAvailable,
            setWhatsAppAvailable,
            setInputError,
          }}
        />
        <AddressInput
          address={address}
          setAddress={setAddress}
          removeInputError={removeInputError}
          iconOnClick={() => {
            getCurrentLocation();
          }}
        />
        <ServicesInput
          {...{ services, setServices, setInputError, uploadToFirebase }}
        />
      </div>
      <div className="submit-container">
        {deleteEstablishment && <button className="delete" onClick={async () => {
          setIsDeleteEstablishment(true);
          const canceled = await deleteEstablishment();
          if (canceled === true) setIsDeleteEstablishment(false);
        }}>Excluir Salão</button>}
        <button type="submit">Enviar</button>
      </div>
    </form>
  );
}

export default EstablishmentForm;