import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: "",
    author: "",
    year: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8677/library/view-books/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBook({
            title: data.book.title,
            author: data.book.author,
            year: data.book.year,
          });
        } else {
          const errorData = await response.json();
          setMessage(errorData.message || "Failed to fetch book details");
        }
      } catch (error) {
        setMessage("Error: " + error.message);
        console.error("Error fetching book details:", error);
      }
    };

    fetchBook();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8677/library/update-book/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(book),
        }
      );

      if (response.ok) {
        setMessage("Book updated successfully");
        navigate("/view-allbooks");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to update book");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
      console.error("Error updating book:", error);
    }
  };

  return (
    <div>
      <h2>Edit Book</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            id="title"
            value={book.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            name="year"
            id="year"
            value={book.year}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            name="author"
            id="author"
            value={book.author}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Update Book</button>
      </form>
    </div>
  );
};

export default EditBook;
