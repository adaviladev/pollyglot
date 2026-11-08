export default function TranslationResult({ translation, error }) {
  return (
    <>
      <h2>Your translation</h2>
      <p className="translation">{translation}</p>
      {error && <p className="error">{error}</p>}
    </>
  );
}
