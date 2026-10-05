export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state error" role="alert">
      <p>{message}</p>
      {onRetry && <button className="btn" onClick={onRetry}>Try Again</button>}
    </div>
  );
}
