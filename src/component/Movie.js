import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Movie.css";
const API_TOKEN = process.env.REACT_APP_TOKEN;

export const Movie = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(0);
  const [trailer, setTrailer] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [credits, setCredits] = useState({ cast: [], crew: [] });
  const [showMoreCast, setShowMoreCast] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  // Movie Details via url
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: API_TOKEN,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setDetails(data);
          console.log(data);
        } else setDetails([]);
      });
  }, [id]);
  // Trailer Call
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: API_TOKEN,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setTrailer(data.results);
          // console.log(data.results);
        } else setDetails([]);
      });
  }, [id]);
  // credits call
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: API_TOKEN,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setCredits(data);
          console.log(data);
        } else setCredits([]);
      });
  }, [id]);
  // Review call
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}/reviews`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: API_TOKEN,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.errors) {
          setReviews(data); // Set reviews in state
          console.log("Reviews data: ", data); // Check the data
        } else {
          setReviews([]); // If there are errors, set empty array
        }
      });
  }, [id]);
  // Movie credits
  const getFormattedCrew = () => {
    // Defined hierarchical roles with priority
    const importantRoles = [
      "Director",
      "Producer",
      "Screenplay",
      "Writer",
      "Story",
      "Editor",
      "Composer",
      "Characters",
    ];

    // Role priority mapping
    const rolePriority = importantRoles.reduce((acc, role, index) => {
      acc[role] = index + 1;
      return acc;
    }, {});

    // Aggregate crew information
    const personRoles = {};
    const usedRoles = new Set();

    credits?.crew?.forEach((person) => {
      if (importantRoles.includes(person.job)) {
        if (!personRoles[person.name]) {
          personRoles[person.name] = new Set();
        }
        personRoles[person.name].add(person.job);
      }
    });

    // Sort and format the crew
    const formattedCrew = Object.entries(personRoles)
      .map(([name, rolesSet]) => {
        // Convert roles to array and sort by priority
        const availableRoles = Array.from(rolesSet)
          .filter((role) => !usedRoles.has(role))
          .sort((a, b) => rolePriority[a] - rolePriority[b]);

        // Select roles and mark them as used
        const selectedRoles = availableRoles.slice(0, 3);
        selectedRoles.forEach((role) => usedRoles.add(role));

        return {
          name,
          roles: selectedRoles,
        };
      })
      // Remove entries with no roles
      .filter((entry) => entry.roles.length > 0)
      // Sort by the most important role
      .sort((a, b) => {
        const priorityA = rolePriority[a.roles[0]] || Infinity;
        const priorityB = rolePriority[b.roles[0]] || Infinity;
        return priorityA - priorityB;
      })
      // Limit to top 5 people
      .slice(0, 5);

    // Format the output
    return formattedCrew.map(({ name, roles }) => ({
      name: `${name}`,
      rolesString: roles.join(", "),
    }));
  };
  const truncatedOverview = details?.overview?.slice(0, 200);
  const toggleOverview = () => {
    setIsExpanded(!isExpanded); // Toggle between expanded/collapsed
  };
  const toggleShowMoreCast = () => setShowMoreCast(!showMoreCast);

  const handleNextReview = () => {
    if (reviews?.results?.length > 0) {
      setCurrentReviewIndex(
        (prevIndex) => (prevIndex + 1) % reviews.results.length
      );
    }
  };

  const handlePrevReview = () => {
    if (reviews?.results?.length > 0) {
      setCurrentReviewIndex(
        (prevIndex) =>
          (prevIndex - 1 + reviews.results.length) % reviews.results.length
      );
    }
  };

  return (
      <div id="root">
        <div className="Movie_Heading">
          <div className="Movie_title">{details.title} </div>
          <div className="Movie_details">
            <span>{details.release_date}</span>&nbsp;&nbsp;
            <span>
              {Math.floor(details.runtime / 60)}h
              {Math.floor(details.runtime % 60)}M Duration
            </span>
          </div>
        </div>
        <div className="Movie_body">
          <div className="Movie_Content">
            <img
              src={`https://image.tmdb.org/t/p/w200${details.poster_path}`}
              alt="poster"
            />

            {/* Trailer Details */}
            <div className="Movie_Trailer">
              {trailer && trailer.length > 0 && trailer[0].key ? (
                <iframe
                  id="video"
                  title="Trailer"
                  src={`https://www.youtube.com/embed/${trailer[0].key}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <p>No trailer available</p>
              )}
            </div>
            {/* Credits */}
            <div className="Movie_credits">
              <div className="Movie_Crew">
                <h3>Crew</h3>
                {getFormattedCrew().map((crewMember, index) => (
                  <div key={index}>
                    {crewMember.name}
                    <div>{crewMember.rolesString}</div>
                    <br />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generes */}
          <div className="Movie_genres">
            {details.genres?.map((genre) => (
              <div className="items" key={genre.id}>
                {genre.name}
              </div>
            ))}
          </div>
          {/* Overview */}
          <div className="Movie_Overview">
            {isExpanded ? details.overview : `${truncatedOverview}...`}
            <button className="toggle-button" onClick={toggleOverview}>
              {isExpanded ? "Show less" : "Read more"}
            </button>
          </div>
          {/* Casting */}
          <div className="Movie_cast">
            <h3>Top Billed Cast</h3>
            <div className="cast-list">
              {credits?.cast
                ?.slice(0, showMoreCast ? credits.cast.length : 10)
                .map((cast, index) => (
                  <div className="cast-card" key={index}>
                    <img
                      src={
                        cast.profile_path
                          ? `https://image.tmdb.org/t/p/w200/${cast.profile_path}`
                          : "https://via.placeholder.com/150x225?text=No+Image"
                      }
                      alt={cast.name}
                    />
                    <div className="cast-name">{cast.name}</div>
                    <div className="cast-character">{cast.character}</div>
                  </div>
                ))}

              {/* View More Tile */}
              {credits.cast.length > 10 && (
                <div className="view-more-tile" onClick={toggleShowMoreCast}>
                  <div className="view-more-text">
                    {showMoreCast ? "View Less" : "View More"} →
                  </div>
                </div>
              )}
            </div>
            {/* Review */}
            <div className="review">
              <button
                className="arrow left-arrow"
                onClick={handlePrevReview}
                disabled={reviews?.results?.length <= 1} // Ensure the reviews have results
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              {/* Review Card */}
              <div className="review-card">
                {reviews?.results?.length > 0 ? ( // Ensure reviews are available
                  <>
                    <div className="review-info">
                      <div className="review-avatar">
                        <img
                          src={
                            reviews.results[currentReviewIndex].author_details
                              .avatar_path
                              ? reviews.results[
                                  currentReviewIndex
                                ].author_details.avatar_path.startsWith("/http")
                                ? reviews.results[
                                    currentReviewIndex
                                  ].author_details.avatar_path.slice(1)
                                : `https://image.tmdb.org/t/p/w200${reviews.results[currentReviewIndex].author_details.avatar_path}`
                              : "https://via.placeholder.com/80?text=No+Avatar"
                          }
                          alt={reviews.results[currentReviewIndex].author}
                        />
                      </div>
                      <div className="review-meta">
                        <h4>{reviews.results[currentReviewIndex].author}</h4>
                        <p className="review-rating">
                          {reviews.results[currentReviewIndex].author_details
                            .rating
                            ? `${
                                reviews.results[currentReviewIndex]
                                  .author_details.rating * 10
                              }%`
                            : "No rating provided"}
                        </p>
                        <p className="review-date">
                          {new Date(
                            reviews.results[currentReviewIndex].created_at
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="review-text">
                      {reviews.results[currentReviewIndex].content}
                    </div>
                  </>
                ) : (
                  <p>No reviews available</p>
                )}
              </div>

              {/* Right Arrow Button */}
              <button
                className="arrow right-arrow"
                onClick={handleNextReview}
                disabled={reviews?.results?.length <= 1} // Disable if only one review exists
              >
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default Movie;
