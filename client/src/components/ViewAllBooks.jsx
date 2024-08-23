import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ViewAllBooks = () => {
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("You need to log in first.");
          return;
        }

        const response = await fetch(
          "http://localhost:8677/library/view-allBooks",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBooks(data.books);
          setFilteredBooks(data.books);
        } else {
          const errorData = await response.json();
          setMessage(errorData.message || "Failed to fetch books");
        }
      } catch (error) {
        setMessage("Error: " + error.message);
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase().split(" ");

    const res = books.filter((book) =>
      [book.title, book.author, book.year.toString()].some((field) =>
        field.toLowerCase().includes(query)
      )
    );

    setFilteredBooks(res);
  }, [searchQuery, books]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8677/library/delete-book/${bookId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setBooks(books.filter((book) => book._id !== bookId));
        setMessage("Book delete successfully");
      } else {
        const errorData = await res.json();
        setMessage(errorData.message || "Failed to delete book");
      }
    } catch (error) {
      setMessage("Error: ", error.message);
      console.log("Error deleting book: ", error);
    }
  };

  return (
    <div>
      <h2>All Books</h2>
      {message && <p>{message}</p>}
      <input
        type="text"
        name="search"
        id="search"
        placeholder="Search by author,title or year..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <ul>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <li key={book._id}>
              <strong>{book.title}</strong> by {book.author} (Published:{" "}
              {book.year})
              {book.isOwner && (
                <>
                  <button>
                    <Link to={`/update-book/${book._id}`}>Edit</Link>
                  </button>
                  <button onClick={() => handleDelete(book._id)}>Delete</button>
                </>
              )}
            </li>
          ))
        ) : (
          <p>No books available.</p>
        )}
      </ul>
    </div>
  );
};

export default ViewAllBooks;
