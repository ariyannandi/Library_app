import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    author: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You need to log in first.");
        return;
      }
      console.log("Token:", token);
      console.log("Form Data:", formData);

      const response = await fetch(
        "http://localhost:8677/library/create-book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage("Book created successfully!");
        console.log("Book created:", data.book);
        navigate("/");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to create book");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
      console.error("Error during book creation:", error);
    }
  };

  return (
    <div>
      <h2>Create a New Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Year:</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Book</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateBook;
