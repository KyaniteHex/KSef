const InputField = ({ name, type, required }) => {
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
