import { FormEvent, useRef, useState } from "react";

const App: React.FC = () => {
  const pokemonNameRef = useRef<HTMLInputElement>(null);
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonImage, setPokemonImage] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchPokemon = async (e: FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    const pokemonName = pokemonNameRef.current?.value;
    if (pokemonName === null) {
      console.error("pokemonName not found");
      window.alert("Oops! Something went wrong");
    }
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setPokemonName(json.name);
      setPokemonImage(json.sprites.front_default);
    } catch (error) {
      console.error(error);
      window.alert("Oops! Something went wrong");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Pokemon</h1>
      <form onSubmit={searchPokemon}>
        <fieldset disabled={isSearching}>
          <input
            ref={pokemonNameRef}
            type="text"
            placeholder="Search Pokemon"
          />
          <button type="submit">Search</button>
        </fieldset>
      </form>
      <div>
        <img src={pokemonImage || undefined} alt={pokemonName} />
        <h2>{pokemonName}</h2>
      </div>
    </div>
  );
};

export default App;
