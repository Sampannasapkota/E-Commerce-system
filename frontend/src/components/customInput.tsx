interface CustomInputProps {
  label: string;
  setValue: (value: string) => void;
  type?: string;
  placeholder: string;
}

const CustomInput = ({
  label,
  setValue,
  type = "text",

  placeholder,
}: CustomInputProps) => {
  return (
    <div>
      <label htmlFor="name">{label}</label>
      <input
        required
        name="name"
        type={type}
        placeholder={placeholder || label}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default CustomInput;
