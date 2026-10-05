export default function Loading({ text = "Loading..." }) {
  return <div className="state" role="status"><div className="spinner" /><p>{text}</p></div>;
}
