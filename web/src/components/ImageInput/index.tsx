import React from "react";
import { FiImage } from "react-icons/fi";

import "./styles.css";

interface Props {
  photoUrl: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageInput: React.FC<Props> = ({ photoUrl, onChange }) => (
  <div id="image-container">
    <div
      className="image-preview"
      style={
        photoUrl === ""
          ? { background: "var(--below-bg-color)" }
          : { background: `url("${photoUrl}")` }
      }
    >
      <FiImage
        style={photoUrl === "" ? { display: "block" } : { display: "none" }}
        size="40px"
        color="var(--input-text-color)"
      />
    </div>
    <div className="side">
      <p>Selecione um arquivo abaixo</p>
      <label htmlFor="upload-photo" id="image">
        Selecione um arquivo
      </label>
      <input
        type="file"
        id="upload-photo"
        accept="image/png, image/jpeg"
        onChange={onChange}
      />
    </div>
  </div>
);

export default ImageInput;
