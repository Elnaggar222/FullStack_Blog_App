import { useNavigate } from "react-router-dom";
import NotFoundImg from "../assets/images/not-found.png";
import { Button } from "react-bootstrap";

const NotFound = () => {
  const Navigate = useNavigate();
  return (
    <div className="not_found_items">
      <img src={NotFoundImg} alt="not Found Img" />
      <h1>Page not Found</h1>
      <Button
            variant="outline-secondary"
            size="lg"
            className="px-5"
            onClick={() => Navigate("/")}
          >
            Go Home
          </Button>
    </div>
  );
};

export default NotFound;
