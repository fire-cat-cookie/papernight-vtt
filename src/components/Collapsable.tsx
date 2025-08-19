import { ReactNode, useState } from "react";

type Props = {
  heading: string;
  className: string;
  content: ReactNode;
};

export default function Collapsable(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={props.className}>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? props.heading + " ▲" : props.heading + " ▼"}
      </button>
      {isOpen && props.content}
    </div>
  );
}
