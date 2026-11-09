export default function TextInput({ text, onTextChange }) {
  return (
    <>
      <h2>Text to translate</h2>
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
      ></textarea>
    </>
  );
}
