export function Spinner() {
  return <div className="ui-spinner" aria-label="Загрузка" />;
}

export function PageLoader({ label = 'Загрузка…' }: { label?: string }) {
  return (
    <div className="ui-page-loader">
      <Spinner />
      <div>{label}</div>
    </div>
  );
}
