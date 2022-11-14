import { ReactNode } from "react";

import "./styles.scss";

interface Props {
  SearchBar: ReactNode;
  Button: ReactNode;
}

export function ActionBar60x40({ SearchBar, Button }: Props) {
  return (
    <div id="default-action-bar">
      {SearchBar}
      <div className="right-button">{Button}</div>
    </div>
  );
}
