import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <section>
      <h1>Page not found</h1>
      <Link to="/">Go to home page</Link>
    </section>
  );
};

export default NotFoundPage;
