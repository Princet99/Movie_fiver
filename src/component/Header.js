import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import magnifying from "../Assest/magnifying-glass.svg";
import clear from "../Assest/clear.svg"
import logo from "../Assest/Movie_fiver_icon.png";
const API_TOKEN = process.env.REACT_APP_TOKEN;

export const Header = () => {
  const [query, SetQuery] = useState("");
  const [details, setDetails] = useState();

  const input = (e) => {
    SetQuery(e.target.value);
  };

  const clearInput = () => {
    SetQuery("");
    setDetails([]);
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/search/movie?query=${query}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: API_TOKEN,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          // console.log(query);
          setDetails(data.results);
          // console.log(data);
        } else {
          setDetails([]);
        }
      });
  }, [query]);

  return (
    <div>
      <div className="NavBar">
        <a href="/" className="logo">
          <img src={logo} alt="Movie Fiver Logo" />
          <span>Movie Fiver</span>
        </a>
        <div id="search_container">
          <select>
            <option>All</option>
          </select>
          <input
            className="text"
            type="text"
            value={query}
            onChange={input}
          ></input>
          {details?.length > 0 && (
            <ul className="drop">
              {details.map((movie) => (
                <li key={movie.id} onClick={clearInput}>
                  <Link to={`/movie/${movie.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                      alt={`${movie.title} Poster`}
                    />
                  </Link>
                  {movie.title}
                </li>
              ))}
            </ul>
          )}
          <button onClick={query ? clearInput : undefined}>
            <img
              src={query ? clear : magnifying}
              alt={query ? "Clear" : "Search"}
            />
          </button>
        </div>
        <a href="/About" className="About">
          <span>About</span>
        </a>
      </div>
    </div>
  );
};
