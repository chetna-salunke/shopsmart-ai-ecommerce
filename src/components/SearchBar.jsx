import Icon from "./Icons";

export default function SearchBar({ value, onChange, onSubmit, placeholder = "Search products, brands and more..." }) {
  return (
    <form className="search" role="search" onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }}>
      <input type="search" aria-label="Search" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      <button type="submit" className="search-btn" aria-label="Search"><Icon name="search" size={18} /></button>
    </form>
  );
}
