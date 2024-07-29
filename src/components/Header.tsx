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
        <Link to="/">Game View</Link>
        <Link to="/builder/lineage">Character Builder</Link>
      </div>
    </div>
  );
}
