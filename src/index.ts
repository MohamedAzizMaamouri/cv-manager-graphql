import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createServer } from "node:http";
import { typeDefs }  from "./schema";
import { resolvers } from "./resolvers";
import { context }   from "./context";

const schema = makeExecutableSchema({ typeDefs, resolvers });

const yoga = createYoga({
    schema,
    context,
});

const server = createServer(yoga);

server.listen(4003, () => {
    console.log("🚀 Server ready at http://localhost:4003/graphql");
});