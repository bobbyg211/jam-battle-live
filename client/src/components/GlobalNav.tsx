import { Link, useLocation } from "react-router-dom";

export default function GlobalNav() {
  const location = useLocation();
  const homeLink = location.pathname === "/donate" ? "/home" : "/donate";

  return (
    <>
      <div className="hover-area left"></div>
      <div className="hover-area right"></div>
      <div className="global-nav">
        <Link to={homeLink} className="glow-btn top-left-link">
          Home
        </Link>
        <Link to="/bracket" className="glow-btn top-right-link">
          Bracket
        </Link>
      </div>
    </>
  );
}
