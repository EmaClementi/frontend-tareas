import "./FormInput.css";
import React from "react";

interface BaseInputProps {
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  label?: string;
}

interface TextInputProps extends BaseInputProps {
  type: "text" | "email" | "password" | "number" | "date";
  value: string | number;
  min?: number;
  max?: number;
}

interface TextareaProps extends BaseInputProps {
  type: "textarea";
  value: string;
  rows?: number;
}

interface SelectProps extends BaseInputProps {
  type: "select";
  value: string;
  options: { value: string; label: string }[];
}

type FormInputProps = TextInputProps | TextareaProps | SelectProps;

export function FormInput(props: FormInputProps) {
  const { label, placeholder, value, onChange, required = false, minLength, maxLength } = props;

  const inputElement = () => {
    if (props.type === "textarea") {
      return (
        <textarea
          className="form-input"
          placeholder={placeholder}
          value={value as string}
          onChange={onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          rows={props.rows || 4}
        />
      );
    }

    if (props.type === "select") {
      return (
        <select
          className="form-input"
          value={value as string}
          onChange={onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
          required={required}
        >
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        className="form-input"
        type={props.type}
        placeholder={placeholder}
        value={value}
        onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        min={props.min}
        max={props.max}
      />
    );
  };

  if (label) {
    return (
      <div className="form-input-wrapper">
        <label className="form-input-label">{label}</label>
        {inputElement()}
      </div>
    );
  }

  return inputElement();
}