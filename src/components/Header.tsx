import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { toggleSidebarMenu } from "../redux/sidebarSlice";
import { updateSearchQuery } from "../redux/searchSlice";
import { autoSuggestionsUrl } from "../constants";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [suggestionList, setSuggestionList] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number>(-1);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const toggleMenu = () => {
    dispatch(toggleSidebarMenu());
  };

  useEffect(() => {
    // Make an API call after every keypress
    // But if the difference between multiple keypresses is < 200ms, decline the API call
    // This is called debouncing
    const timer = setTimeout(() => showSearchSuggestions(), 200);

    return () => {
      clearInterval(timer);
    };
  }, [searchText]);

  const showSearchSuggestions = async () => {
    const data = await fetch(autoSuggestionsUrl + searchText);
    const json = await data.json();
    setSuggestionList(json[1]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      const currentSuggestion = selectedSuggestion + 1;
      if (currentSuggestion < suggestionList.length) {
        setSelectedSuggestion(currentSuggestion);
      }
    } else if (e.key === "ArrowUp") {
      const currentSuggestion = selectedSuggestion - 1;
      if (currentSuggestion >= 0) {
        setSelectedSuggestion(currentSuggestion);
      }
    } else if (e.key === "Enter") {
      if (selectedSuggestion < 0) {
        handleSearch(searchText);
      } else {
        handleSearch(suggestionList[selectedSuggestion]);
      }
    }
  };

  const handleSearch = (searchQuery: string) => {
    dispatch(updateSearchQuery(searchQuery));
    navigate("/results?search_query=" + searchQuery);
    setSearchText("");
    setSelectedSuggestion(-1);
  };

  return (
    <nav className="flex items-center justify-between px-4 md:px-7 py-4">
      <div className="flex items-center">
        <RxHamburgerMenu
          className="h-5 w-5 md:h-6 md:w-6"
          onClick={toggleMenu}
        />
        <Link to="/" className="flex items-center">
          <img
            src="./logo.png"
            alt="logo"
            className="h-5 w-5 md:h-7 md:w-7 ml-3 md:ml-6 mr-1"
          />
          <h1 className="font-bold text-lg md:text-2xl">YouVibe</h1>
        </Link>
      </div>
      <div className="relative focus-within:absolute focus-within:w-[93%] md:focus-within:relative md:focus-within:w-auto">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setShowSuggestions(false)}
            onKeyDown={(e) => handleKeyPress(e)}
            className="border-solid border-gray-300 border-2 px-3 py-2 h-7 md:h-[36px] w-32 focus:w-full md:w-80 md:focus:w-80 rounded-l-full text-xs md:text-sm"
          />
          <button
            className="px-2 md:px-5 h-7 md:h-[36px] z-10 bg-gray-200 hover:bg-blue-200 rounded-r-full"
            onClick={() => handleSearch(searchText)}
            aria-label="search"
          >
            <IoSearch />
          </button>
        </div>
        {showSuggestions && suggestionList.length > 0 && (
          <div className="py-2 mx-1 rounded-lg shadow-xl absolute w-full bg-white z-10 border border-solid border-gray-300">
            <ul>
              {suggestionList.map((suggestion, index) => (
                <li
                  key={index}
                  className={`p-2 ${selectedSuggestion === index ? "bg-gray-200" : ""}`}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="relative">
        <FaUserCircle id="profile-icon" className="text-2xl md:text-3xl" />
        <div
          id="profile-card"
          className="absolute -left-[150px] top-1 bg-white z-10 p-4 shadow-2xl rounded-lg border border-gray-200"
        >
          <div className="flex">
            <FaUserCircle className="text-2xl md:text-3xl mr-3" />
            <div className="flex flex-col">
              <p className="font-semibold">Subhrangshu Majumder</p>
              <p className="text-sm">@Subhrangshu9</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
