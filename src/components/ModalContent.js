const ModalContent = ({
  albumDetails = {},
  modifyFavorite,
  favorites = [],
  handleCloseModal,
}) => {
  const { label = "" } =
    albumDetails["im:image"] &&
    albumDetails["im:image"].length > 2 &&
    albumDetails["im:image"][2];
  const title = albumDetails?.title?.label;
  const name = albumDetails["im:name"]?.label;
  const artistName = albumDetails["im:artist"]?.label;
  const releaseDate = albumDetails["im:releaseDate"]?.attributes?.label;
  const category = albumDetails["category"]?.attributes?.label;
  const price = albumDetails["im:price"]?.label;
  const id = albumDetails?.id?.attributes["im:id"];

  const isActive = favorites.find((item) => {
    return item === id;
  });

  return (
    <>
      <div className="closeIcon" onClick={handleCloseModal}>
        X
      </div>
      <div className="albumDetails">
        <img src={label} alt="NA" className="img" />
        <div className="albumTexts">
          <div>
            <span className="colorRed">Title:</span> {title}
          </div>
          <div className="marginTop">
            <span className="colorRed">Name:</span> {name}
          </div>
          <div className="marginTop">
            <span className="colorRed">Artist:</span> {artistName}
          </div>
          <div className="marginTop">
            <span className="colorRed">Category:</span> {category}
          </div>
          <div className="marginTop">
            <span className="colorRed">Release Date:</span> {releaseDate}
          </div>
          <div className="marginTop">
            <span className="colorRed">Price:</span> {price}
          </div>
        </div>
      </div>

      <div className="button-container" onClick={modifyFavorite}>
        <div
          id="add"
          className={
            isActive ? "disabled add-to-favourite" : "add-to-favourite"
          }
        >
          Add Favourite
        </div>
        <div
          id="remove"
          className={
            isActive
              ? "remove-from-favourite"
              : "disabled remove-from-favourite"
          }
        >
          Remove Favourite
        </div>
      </div>
    </>
  );
};

export default ModalContent;
