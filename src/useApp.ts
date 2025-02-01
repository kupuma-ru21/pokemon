import { Input } from "antd";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type Pokemon = {
  name: string;
  sprites: { front_default: string };
};

const schema = z.object({
  pokemonName: z
    .string()
    .min(1, { message: "Required" })
    // NOTE: Crabominable is the longest Pokemon name
    .max(12, { message: "PokemonName has to be less than 15 characters" }),
});

type Input = z.infer<typeof schema>;

export const useApp = () => {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonImage, setPokemonImage] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchPokemon = async ({ pokemonName }: Input) => {
    setIsSearching(true);
    if (pokemonName === null) {
      console.error("pokemonName not found");
      window.alert("Oops! Something went wrong");
    }
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      if (!response.ok) {
        console.error(`Response status: ${response.status}`);
        window.alert("Oops! Something went wrong");
      }
      const json: Pokemon = await response.json();
      setPokemonName(json.name);
      setPokemonImage(json.sprites.front_default);
    } catch (error) {
      console.error(error);
      window.alert("Oops! Something went wrong");
    } finally {
      setIsSearching(false);
    }
  };

  const { control, handleSubmit } = useForm<Input>({
    defaultValues: { pokemonName: "" },
    resolver: zodResolver(schema),
  });

  return {
    pokemonName,
    pokemonImage,
    isSearching,
    searchPokemon: handleSubmit(searchPokemon),
    control,
  };
};
