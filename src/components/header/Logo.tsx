
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img
        src="/lovable-uploads/b62c65de-473f-4784-af56-938c81068d3d.png"
        alt="Total Home Grown Logo"
        className="h-12 w-auto mr-2"
      />
    </Link>
  );
};
