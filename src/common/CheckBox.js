import "./styles.css";
const CheckBox = ({ value = false, handleChange, label = "" }) => {
  return (
    <div className="checkBoxContainer">
      <input
        className="checkBox"
        type="checkbox"
        checked={value}
        onChange={() => {
          handleChange(!value);
        }}
      />
      <label className="checkBoxLabel"> {label}</label>
    </div>
  );
};

export default CheckBox;
