const LANGUAGES = [
  { name: "French", flag: "assets/fr-flag.png" },
  { name: "Spanish", flag: "assets/sp-flag.png" },
  { name: "Japanese", flag: "assets/jpn-flag.png" },
];

export default function LanguageSelector({ language, onLanguageChange }) {
  return (
    <>
      <h2>Select language</h2>
      {LANGUAGES.map(({ name, flag }) => (
        <label key={name}>
          <input
            type="radio"
            name="language"
            value={name}
            checked={language === name}
            onChange={(e) => onLanguageChange(e.target.value)}
          />
          {name}
          <img src={flag} alt={`${name} flag`} />
        </label>
      ))}
    </>
  );
}
