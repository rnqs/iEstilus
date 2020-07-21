import React from "react";
import Switch from "react-switch";
import InputMask from "react-input-mask";

import "./styles.css";

interface Props {
  phone: string;
  setPhone: (phone: string) => void;
  whatsAppAvailable: boolean;
  setWhatsAppAvailable: (whatsAppAvailable: boolean) => void;
  setInputError: (inputError: boolean) => void;
}

const PhoneInput: React.FC<Props> = ({
  phone,
  setPhone,
  whatsAppAvailable,
  setWhatsAppAvailable,
  setInputError,
}) => (
    <div id="phone-input">
      <InputMask
        className="input"
        id="phone"
        placeholder="Telefone de atendimento"
        mask={phone.length >= 19 ? "+99 (99) 99999-9999" : "+99 (99) 9999-99999"}
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
      <label htmlFor="material-switch">
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
  );

export default PhoneInput;
