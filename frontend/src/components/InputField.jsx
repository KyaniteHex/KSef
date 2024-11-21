const InputField = ({ name, type }) => {
  return (
    <div>
      <label htmlFor={name}>{name}</label>
      <input id={name} name={name} type={type} />
    </div>
  );
};
export default InputField;
