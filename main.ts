import { ApolloServer } from "npm:@apollo/server@4.11.3";
import { startStandaloneServer } from "npm:@apollo/server@4.11.3/standalone";
import { graphql } from "npm:graphql@16.6";
// import cors from "npm:cors";
// import { typeDefs } from "./schema.ts";
// import { resolvers } from "./resolvers.ts";

export const typeDefs = `
  type Dinosaur {
    name: String
    description: String
  }

  type Query {
    dinosaurs: [Dinosaur]
		dinosaur(name: String): Dinosaur
  }
`;

const dinosaurs = [
  {
    name: "Aardonyx",
    description: "An early stage in the evolution of sauropods.",
  },
  {
    name: "Abelisaurus",
    description: '"Abel\'s lizard" has been reconstructed from a single skull.',
  },
];

export const resolvers = {
  Query: {
    dinosaurs: () => dinosaurs,
    dinosaur: (_: any, args: any) => {
      return dinosaurs.find((dinosaur) => dinosaur.name === args.name);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 8000 },
});

console.log(`Server running on: ${url}`);
