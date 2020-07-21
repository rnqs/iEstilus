import React from "react";
import { FiMapPin } from "react-icons/fi";

import Input from '../Input';

import "./styles.css";

interface Props {
  address: string;
  setAddress: (address: string) => void;
  removeInputError: (input: string) => void;
  iconOnClick: () => void;
}

const AddressInput: React.FC<Props> = ({ address, setAddress, removeInputError, iconOnClick }) => (
  <div id="address-input">
    <Input
      id="address"
      placeholder="Endereço"
      value={address}
      setValue={setAddress}
      removeInputError={removeInputError}
    />
    <FiMapPin
      size="24px"
      className="pinIcon"
      onClick={() => {
        removeInputError("address");
        iconOnClick()
      }}
    />
    <div className="address-input-error-message">
      Exemplo: <b>Nome da rua, numero, cidade</b>
    </div>
  </div>
);

export default AddressInput;
