import { Close, Search } from "@material-ui/icons";
import { FormEvent } from "react";

import "./styles.scss";

interface Props {
  doSearch: (event: FormEvent<HTMLFormElement>) => void;
  setSearch: (search: string) => void;
  clearSearch: () => void;
  search: string;
}

export function SearchBar({ doSearch, search, setSearch, clearSearch }: Props) {
  return (
    <div id="search-bar">
      <form onSubmit={doSearch} className="search">
        <input
          type="text"
          autoFocus
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="clear-btn" type="button" onClick={clearSearch}>
          <Close />
        </button>
        <button className="search-btn" type="submit">
          <Search />
        </button>
      </form>
      <div className="select-filter"></div>
    </div>
  );
}
