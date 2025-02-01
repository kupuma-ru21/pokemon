import {
  Button,
  Flex,
  Form,
  Image,
  Input,
  InputRef,
  Skeleton,
  Typography,
} from "antd";
import { error } from "console";
import { FormEvent, useRef, useState } from "react";

type Pokemon = {
  name: string;
  sprites: { front_default: string };
};

const App: React.FC = () => {
  const pokemonNameRef = useRef<InputRef>(null);
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonImage, setPokemonImage] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchPokemon = async () => {
    setIsSearching(true);
    const pokemonName = pokemonNameRef.current?.input?.value;
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

  return (
    <div style={{ textAlign: "center" }}>
      <Typography.Title>Pokemon</Typography.Title>
      <Form onFinish={searchPokemon} style={{ marginBottom: "20px" }}>
        <Flex gap="large">
          <Input
            ref={pokemonNameRef}
            type="text"
            placeholder="Search Pokemon"
            required
            disabled={isSearching}
          />
          <Button type="primary" htmlType="submit" loading={isSearching}>
            Search
          </Button>
        </Flex>
      </Form>
      <div>
        {isSearching ? (
          <>
            <Skeleton.Image style={{ width: "200px", height: "200px" }} />
            <Typography.Title level={2}>
              <Skeleton.Node style={{ height: "40px", width: "200px" }} />
            </Typography.Title>
          </>
        ) : (
          <>
            {pokemonImage ? (
              <Image
                width={200}
                height={200}
                src={pokemonImage || undefined}
                alt={pokemonName}
                hidden={!isSearching}
              />
            ) : null}
            <Typography.Title level={2}>{pokemonName}</Typography.Title>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
