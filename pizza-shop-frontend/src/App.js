import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PizzaMainPage from "./components/PizzaMainPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PizzaMainPage />} />
      </Routes>
    </Router>
  );
};

export default App;
