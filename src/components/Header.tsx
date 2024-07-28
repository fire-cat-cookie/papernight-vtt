import { Link } from "react-router-dom";
import "./Header.scss";

type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  return (
    <div className="top-navbar">
      <h1>{title}</h1>
      <div className="top-navbar-nav">
        <Link to="/builder">Character Builder</Link>
        <Link to="/">Game View</Link>
      </div>
    </div>
  );
}
