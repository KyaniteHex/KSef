const SelectField = ({ name, options = [], required }) => {
  return (
    <div>
      <select id={name} name={name} required={required}>
        <option value="">-- Wybierz --</option>
        {options.map(({ value, documentation }) => (
          <option key={value} value={value}>
            {value} - {documentation}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
