export function Spinner({ size = 28 }: { size?: number }) {
  return (
    <span
      className="spinner"
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="full-center">
      <Spinner size={36} />
    </div>
  );
}
