import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import SignIn from "./components/SignIn";
import Signup from "./components/SignUp";
import Library from "./components/Library";
import CreateBook from "./components/CreateABook";
import Navbar from "./components/Navbar";
import ViewAllBooks from "./components/ViewAllBooks";
import EditBook from "./components/EditBook";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  const toggleForm = () => {
    setIsSigningUp(!isSigningUp);
  };

  return (
    <Router>
      <div>
        {isAuthenticated && <Navbar onSignOut={handleSignOut} />}
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Library />
              ) : isSigningUp ? (
                <Signup toggleForm={toggleForm} />
              ) : (
                <SignIn onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route path="/signup" element={<Signup toggleForm={toggleForm} />} />
          <Route
            path="/signin"
            element={<SignIn onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/create-book" element={<CreateBook />} />
          <Route path="/view-allbooks" element={<ViewAllBooks />} />
          <Route path="/update-book/:id" element={<EditBook />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
