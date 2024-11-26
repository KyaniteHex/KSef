const SelectField = ({ name, options = [], required }) => {
  return (
    <div>
      <select id={name} name={name} required={required}>
        <option value="">-- Wybierz --</option>
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
