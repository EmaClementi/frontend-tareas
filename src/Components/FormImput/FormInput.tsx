import "./FormInput.css";
import React from "react";

interface FormInputProps {
  type: "text" | "email" | "password";
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

export function FormInput({
  type,
  placeholder,
  value,
  onChange,
  required = false,
  minLength,
  maxLength,
}: FormInputProps) {
  return (
    <input
      className="form-input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
    />
  );
}

