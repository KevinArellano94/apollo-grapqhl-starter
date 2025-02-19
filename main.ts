import { ApolloServer } from "npm:@apollo/server@4.11.3";
import { startStandaloneServer } from "npm:@apollo/server@4.11.3/standalone";
import { graphql } from "npm:graphql@16.6";
import { verify } from "https://deno.land/x/djwt@v3.0.1/mod.ts";
// import cors from "npm:cors";
// import { typeDefs } from "./schema.ts";
// import { resolvers } from "./resolvers.ts";


interface MyContext {
	authScope?: String;
}

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
		dinosaurs: (_: any, args: any, context: any, info: any) => {
			if (context.user.role === 'admin') {
				return dinosaurs;
			}

			return [];
		},
		dinosaur: (_: any, args: any, context: any, info: any) => {
			if (context.user.role === 'admin') {
				return dinosaurs.find((dinosaur) => dinosaur.name === args.name);
			}

			return [];
		},
	},
};

const server = new ApolloServer<MyContext>({
	typeDefs,
	resolvers,
});

const { url } = await startStandaloneServer(server, {
	listen: { port: 8000 },
	context: async ({ req, res }) => {
		const authScope = await getScope(req.headers.authorization as string);
		return { user: authScope };
	},
});

console.log(`Server running on: ${url}`);

async function getScope(authorization: string) {
	const token = authorization.split(' ');

	if (token[0] !== 'Bearer') {
		console.error(`INTERNAL SERVER ERROR`);
		throw new Error(`INTERNAL SERVER ERROR`);
	}

	const secretKey = new TextEncoder().encode(Deno.env.get('secret_key'));
	const key = await crypto.subtle.importKey(
		"raw",
		secretKey,
		{ name: "HMAC", hash: "SHA-512" },
		false,
		["sign", "verify"]
	);

	try {
		return await verify(token[1], key);
	} catch (error: any) {
		console.error(`INTERNAL SERVER ERROR`, error);
		throw new Error(`INTERNAL SERVER ERROR`, error);
	}
}
