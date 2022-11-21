import "./styles.css";

const SearchBox = ({
  handleSearchInputChange,
  searchValue = "",
  debouncing = false,
  placeHolder = "type here",
  type = "text",
}) => {
  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };

  return (
    <div className="inputContainer">
      <input
        className="input"
        placeholder={placeHolder}
        type={type}
        onChange={handleSearchInputChange}
        value={!isEmpty(searchValue) ? searchValue : ""}
      />
    </div>
  );
};

export default SearchBox;
