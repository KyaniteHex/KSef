import React from 'react';
import InputField from './InputField';
import SelectField from './SelectField';

const FormBuilder = ({ structure }) => {
  if (!structure || !structure.children) {
    return <div>Brak danych do wyświetlenia.</div>;
  }

  const renderElement = (element) => {
    const { name, type, required, values, children, documentation } = element;

    return (
      <div key={name} style={{ marginLeft: '20px' }}>
        <label>
          {name} {required && <span>*</span>}
          {documentation && <span title={documentation}> ℹ </span>}
        </label>
        {values ? (
          <SelectField name={name} options={values} required={required} />
        ) : (
          <InputField name={name} type={type} required={required} />
        )}
        {children &&
          children.map((child) => (
            <div key={child.name}>{renderElement(child)}</div>
          ))}
      </div>
    );
  };

  return <form>{renderElement(structure)}</form>;
};

export default FormBuilder;
