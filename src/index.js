const { GraphQLServer, PubSub } = require("graphql-yoga");

const prisma = require("./prisma");
const { resolvers, fragmentReplacements } = require("./resolvers/index");
const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "schema.graphql",
  context(request) {
    return { pubsub, prisma, request };
  },
  resolvers,
  fragmentReplacements
});

server.start(() => {
  console.log("graphql server running");
});
