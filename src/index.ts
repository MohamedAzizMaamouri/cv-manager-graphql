import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs }  from "./schema";
import { resolvers } from "./resolvers";
import { context }   from "./context";

async function main() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    const { url } = await startStandaloneServer(server, {
        context,
        listen: { port: 4000 },
    });
    console.log(`🚀 Server ready at ${url}`);
}

main();