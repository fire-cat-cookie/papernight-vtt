import React from "react";
import { ReactNode, useState } from "react";

type Props = {
  heading: string;
  className: string;
  content: ReactNode;
  defaultOpen?: boolean;
};

export default function Collapsible(props: Props) {
  const [isOpen, setIsOpen] = useState(props.defaultOpen ?? false);

  return (
    <React.Fragment>
      <div className={props.className}>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? props.heading + " ▲" : props.heading + " ▼"}
        </button>
      </div>
      {isOpen && props.content}
    </React.Fragment>
  );
}
