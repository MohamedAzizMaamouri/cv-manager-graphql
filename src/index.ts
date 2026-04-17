import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/use/ws";
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { context as createContext } from "./context";

async function main() {
    const app = express();
    const httpServer = http.createServer(app);

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const wsServer = new WebSocketServer({ server: httpServer, path: "/graphql" });
    const serverCleanup = useServer(
        {
            schema,
            context: async () => createContext(),
        },
        wsServer,
    );

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await server.start();

    app.use(
        "/graphql",
        cors(),
        bodyParser.json(),
        expressMiddleware(server, { context: createContext }),
    );

    httpServer.listen(4000, () => {
        console.log("Server ready at http://localhost:4000/graphql");
    });
}

main();
