
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img
        src="/placeholder.svg"
        alt="Logo"
        className="h-8 w-8 mr-2"
      />
      <span className="font-bold text-xl text-[#3B751E]">
        Affiliate Portal
      </span>
    </Link>
  );
};
