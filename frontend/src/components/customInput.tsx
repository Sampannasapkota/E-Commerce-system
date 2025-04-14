import "./customInput.css"; // Make sure you import the CSS

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
    <div className="custom-input">
      <label className="input-label" htmlFor={label.toLowerCase()}>{label}</label>
      <input
        required
        name={label.toLowerCase()}
        type={type}
        className="input-field"
        placeholder={placeholder || label}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default CustomInput;
