import { Button, Form, Image, Input, Skeleton, Typography } from "antd";
import { FormItem } from "react-hook-form-antd";
import { useApp } from "./useApp";

const App: React.FC = () => {
  const { pokemonName, pokemonImage, isSearching, searchPokemon, control } =
    useApp();

  return (
    <div style={{ textAlign: "center" }}>
      <Typography.Title>Pokemon</Typography.Title>
      <Form onFinish={searchPokemon} style={{ marginBottom: "20px" }}>
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
