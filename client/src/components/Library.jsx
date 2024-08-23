import { Link } from "react-router-dom";

const Library = () => {
  return (
    <>
      <h1>Library</h1>
      <Link to="/create-book">
        <button>Create a New Book</button>
      </Link>
      <Link to="/view-allBooks">
        <button>View All Books</button>
      </Link>
    </>
  );
};

export default Library;
