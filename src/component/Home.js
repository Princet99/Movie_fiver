import { useEffect, useState } from "react";
import HomeGrid from "./HomeGrid";
import "./Home.css";

export const Home = () => {
  const [result, setResult] = useState([]);
  const [toggle, setToggle] = useState(false);
  const API_TOKEN = process.env.REACT_APP_TOKEN;

  const handle_Toggle = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    const endpoint = toggle ? "trending/movie/week" : "movie/now_playing";
    fetch(`https://api.themoviedb.org/3/${endpoint}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: API_TOKEN,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setResult(data.results);
          // console.log(data.results);
        } else setResult([]);
      });
  }, [toggle, API_TOKEN]);

  return (
    <div id="root">
      {/* Toggle in between trends and Popular */}
      <div className="toggle-wrapper">
        <div className="toggle-container" onClick={handle_Toggle}>
          <div className={`toggle-option ${!toggle ? "active" : "inactive"}`}>
            Popular
          </div>
          <div className={`toggle-option ${toggle ? "active" : "inactive"}`}>
            Trending
          </div>  
        </div>
      </div>

      <div className="Grid">
        {result?.length > 0 &&
          result.map((movie) => <HomeGrid key={movie.id} {...movie} />)}
      </div>
    </div>
  );
};
