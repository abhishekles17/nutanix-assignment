import "./App.css";
import { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import CheckBox from "./common/CheckBox";
import SearchBox from "./common/SearchBox";
import AlbumCard from "./components/AlbumCard";
import Modal from "react-modal";
import ModalContent from "./components/ModalContent";
function App() {
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [responseData, SetResponseData] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  const [checked, setChecked] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    searched: "",
    favorites: [],
    dates: [],
  });
  const [open, setOpen] = useState(false);
  const [albumDetails, setAlbumDetails] = useState({});

  const getUniqueArray = (duplicatedArray) => {
    return [...new Set(duplicatedArray.map((o) => JSON.stringify(o)))].map(
      (s) => JSON.parse(s)
    );
  };

  const getCategoryList = (entries = []) => {
    const duplicatedArray = entries.reduce((arr, entry) => {
      let obj = {
        value: entry?.category?.attributes["im:id"],
        label: entry?.category?.attributes["label"],
      };
      arr.push(obj);
      return arr;
    }, []);
    return getUniqueArray(duplicatedArray);
  };

  const filterBySearch = (list, searchedValue) => {
    if (searchedValue) {
      return list.filter((item) => {
        if (item["im:artist"].label.includes(searchedValue)) return true;
        if (item["im:name"].label.includes(searchedValue)) return true;

        return false;
      });
    }

    return responseData?.entry;
  };

  const filterByCategories = (list, _categories) => {
    if (_categories && _categories.length > 0) {
      return list.filter((item) => {
        return _categories.some(
          (category) => category.value === item?.category?.attributes["im:id"]
        );
      });
    }
    return list;
  };

  const filterByDates = (list, _dates) => {
    if (_dates && _dates.length > 0) {
      return list.filter((item) => {
        return _dates.some(
          (obj) =>
            `${obj?.month?.name} ${obj.day}, ${obj.year}` ===
            item["im:releaseDate"]?.attributes?.label
        );
      });
    }
    return list;
  };

  const filterByFavourite = (list) => {
    return list.filter((item) => {
      return filters?.favorites.includes(item?.id?.attributes["im:id"]);
    });
  };

  useEffect(() => {
    fetch("https://itunes.apple.com/us/rss/topalbums/limit=100/json")
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        SetResponseData(result.feed);
        setFilteredAlbums(result?.feed?.entry);
        const _categoryList = getCategoryList(result?.feed?.entry);
        setCategoryList(_categoryList);
      });
  }, []);

  useEffect(() => {
    if (responseData?.entry && responseData?.entry.length > 0) {
      let _filteredByList = filterBySearch(
        responseData?.entry,
        filters.searched
      );
      _filteredByList = filterByCategories(_filteredByList, filters.categories);
      _filteredByList = filterByDates(_filteredByList, filters.dates);

      if (checked) {
        _filteredByList = filterByFavourite(_filteredByList);
      }
      setFilteredAlbums(_filteredByList);
    }
  }, [filters, checked]);

  const handleCategoryChange = (_categories) => {
    const _filters = {
      ...filters,
      categories: [..._categories],
    };
    setFilters(_filters);
  };

  const handleDateSelection = (dates) => {
    const _filters = {
      ...filters,
      dates: [...dates],
    };
    setFilters(_filters);
  };

  const handleSearchChange = (e) => {
    setFilters({
      ...filters,
      searched: e.target.value,
    });
  };

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleCardClick = (index) => {
    setAlbumDetails(filteredAlbums[index]);
    setOpen(true);
  };

  const modifyFavorite = (e) => {
    if (e.target.id === "add") {
      const _favourites = [...filters.favorites];
      const id = albumDetails?.id?.attributes["im:id"];
      _favourites.push(id);

      setFilters({
        ...filters,
        favorites: [..._favourites],
      });
    } else if (e.target.id === "remove") {
      const _favourites = [...filters.favorites];
      const id = albumDetails?.id?.attributes["im:id"];
      const index = _favourites.findIndex((item) => {
        return item === id;
      });

      _favourites.splice(index, 1);

      setFilters({
        ...filters,
        favorites: [..._favourites],
      });
    }
  };

  return (
    <div className="App container">
      <div className="filterContainer">
        <Select
          value={filters.categories}
          onChange={handleCategoryChange}
          isMulti
          name="categories"
          options={categoryList}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Select Categories"
        />
        <DatePicker
          containerClassName="datePicker"
          name="dates"
          multiple
          value={filters.dates}
          onChange={handleDateSelection}
          format="MMMM DD, YYYY"
          placeholder="Select multiple release dates"
          inputClass="dateInput"
        />

        <CheckBox
          value={checked}
          handleChange={handleCheckboxChange}
          label="Show Favourite Albums"
        />
      </div>
      <div className="searchContainer">
        <SearchBox
          type="text"
          placeHolder="Search Album"
          handleSearchInputChange={handleSearchChange}
          searchValue={filters.searched}
          debouncing={true}
        />
      </div>

      <div className="cardsContainer">
        {filteredAlbums.map((album, index) => {
          return (
            <AlbumCard
              albumDetails={album}
              key={album?.id?.attributes["im:id"]}
              index={index}
              handleAlbumCardClicked={handleCardClick}
            />
          );
        })}
      </div>
      <div className="modalContainer">
        <Modal
          isOpen={open}
          onRequestClose={handleCloseModal}
          shouldCloseOnOverlayClick={true}
          ariaHideApp={false}
        >
          <ModalContent
            albumDetails={albumDetails}
            modifyFavorite={modifyFavorite}
            favorites={filters.favorites}
            handleCloseModal={handleCloseModal}
          />
        </Modal>
      </div>
    </div>
  );
}

export default App;
