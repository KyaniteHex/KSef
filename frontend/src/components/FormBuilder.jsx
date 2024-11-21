const FormBuilder = ({ structure }) => {
  const { elements = [], dictionaries = {} } = structure;

  const renderFields = () =>
    elements.map((el) => {
      const { name, type } = el;
      const cleanType = type.split(":")[1] || type;

      if (dictionaries[cleanType]) {
        return (
          <SelectField
            key={name}
            name={name}
            options={dictionaries[cleanType]}
          />
        );
      }

      return <InputField key={name} name={name} type="text" />;
    });

  return <form>{renderFields()}</form>;
};

export default FormBuilder;
