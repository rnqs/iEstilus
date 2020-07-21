import React from "react";

import "./styles.css";

interface Props {
  multiline?: boolean;
  numeric?: boolean;
  id: string;
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  removeInputError: (input: string) => void;
}

const Input: React.FC<Props> = ({
  multiline,
  numeric,
  id,
  placeholder,
  value,
  removeInputError,
  setValue,
}) => (
    <div id="input-component">
      {multiline ? (
        <textarea
          id={id}
          placeholder={placeholder}
          maxLength={120}
          value={value}
          onChange={(e) => {
            removeInputError(id);
            setValue(e.target.value);
          }}
        ></textarea>
      ) : (
          <input
            type={numeric ? "number" : "text"}
            className="input"
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              removeInputError(id);
              setValue(e.target.value);
            }}
          />
        )}
    </div>
  );

export default Input;
