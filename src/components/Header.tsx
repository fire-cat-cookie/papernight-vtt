import "./Header.scss";

type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  return (
    <div className="top-navbar">
      <h1>{title}</h1>
      <div className="top-navbar-nav">
        <a>Character Builder</a>
        <a>Game View</a>
      </div>
    </div>
  );
}
