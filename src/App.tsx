import { Button, Flex, Form, Image, Input, Skeleton, Typography } from "antd";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";

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

const App: React.FC = () => {
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

  return (
    <div style={{ textAlign: "center" }}>
      <Typography.Title>Pokemon</Typography.Title>
      <Form
        onFinish={handleSubmit(searchPokemon)}
        style={{ marginBottom: "20px" }}
      >
        <FormItem control={control} name="pokemonName">
          <Input
            type="text"
            placeholder="Search Pokemon"
            disabled={isSearching}
          />
        </FormItem>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSearching}>
            Search
          </Button>
        </Form.Item>
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
