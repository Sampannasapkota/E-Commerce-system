interface CustomButtonProps {
  label: string;
  onClick?: () => void;
  style?: object;
  type?: "button" | "submit" | "reset";
}
const customButton = ({
  label,
  onClick,
  style,
  type = "button",
}: CustomButtonProps) => {
  return (
    <button type={type} onClick={onClick} style={style}>
      {label}
    </button>
  );
};

export default customButton;
