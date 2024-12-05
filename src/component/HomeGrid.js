import { Link } from "react-router-dom";
import "./HomeGrid.css";
import imgPlaceholder from "../Assest/img_placeholder.png";

export const HomeGrid = ({ id, title, poster_path }) => {
  return (
    <div className="Poster_item">
      <div className="Movie_Poster">
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w200/${poster_path}`
              : imgPlaceholder
          }
          alt={`${title || "Movie"} Poster`}
        />
      </div>
      <Link to={`/movie/${id}`}>
        <div className="Movie_Name">{title}</div>
      </Link>
    </div>
  );
};

export default HomeGrid;
