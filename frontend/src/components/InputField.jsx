const InputField = ({ name, type, required }) => {
  const validateValue = (e) => {
    const value = e.target.value;

    if (minLength && value.length < minLength) {
      alert(`Wartość dla ${name} musi mieć co najmniej ${minLength} znaków.`);
    }
    if (maxLength && value.length > maxLength) {
      alert(`Wartość dla ${name} nie może przekraczać ${maxLength} znaków.`);
    }
    if (pattern && !new RegExp(pattern).test(value)) {
      alert(`Wartość dla ${name} nie pasuje do wzorca.`);
    }
    if (type === 'number') {
      const numValue = parseFloat(value);
      if (minInclusive && numValue < minInclusive) {
        alert(`Wartość dla ${name} musi być co najmniej ${minInclusive}.`);
      }
      if (maxInclusive && numValue > maxInclusive) {
        alert(`Wartość dla ${name} nie może być większa niż ${maxInclusive}.`);
      }
    }
  };

  return (
    <div>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={name}
      />
    </div>
  );
};

export default InputField;
