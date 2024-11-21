const SelectField = ({ name, options }) => {
  return (
    <div>
      <label htmlFor={name}>{name}</label>
      <select id={name} name={name}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
