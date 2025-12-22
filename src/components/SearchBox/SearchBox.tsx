import css from "./SearchBox.module.css";

interface SearchBoxProps {
  search: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBox = ({ search, onChange }: SearchBoxProps) => {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      defaultValue={search}
      onChange={onChange}
    />
  );
};

export default SearchBox;
