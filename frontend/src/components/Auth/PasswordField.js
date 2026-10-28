import React, { useState } from 'react';

export default function PasswordField({
  id,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  autoComplete,
  placeholder,
  required = true,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <div className="password-input-wrap">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
        />
        <button
          className="password-toggle"
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
    </>
  );
}

