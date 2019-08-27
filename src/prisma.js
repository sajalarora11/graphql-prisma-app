const { Prisma } = require("prisma-binding");
const { fragmentReplacements } = require("./resolvers/index");
const prisma = new Prisma({
  typeDefs: "generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: "sample",
  fragmentReplacements
});

module.exports = prisma;
