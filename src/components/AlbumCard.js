import "./styles.css";

const AlbumCard = ({
  albumDetails = {},
  handleAlbumCardClicked,
  index = 0,
}) => {
  const { label = "" } =
    albumDetails["im:image"] &&
    albumDetails["im:image"].length > 2 &&
    albumDetails["im:image"][2];
  const title = albumDetails?.title?.label;
  const name = albumDetails["im:name"]?.label;
  return (
    <div
      className="cardContainer"
      onClick={() => {
        handleAlbumCardClicked(index);
      }}
    >
      <img className="img" alt="NA" src={label} />
      <div className="title">{title}</div>
      <div className="name">{name}</div>
    </div>
  );
};

export default AlbumCard;
