// Svg icons https://reactsvgicons.com/
import "./App.css";
import { Home } from "./component/Home.js";
import { Header } from "./component/Header.js";
import About from "./component/About.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Movie from "./component/Movie.js";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Movie/:id" element={<Movie />} />
      </Routes>
    </Router>
  );
}

export default App;
