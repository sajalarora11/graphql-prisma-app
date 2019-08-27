const { extractFragmentReplacements } = require("prisma-binding");

const Query = require("./Query");
const Mutation = require("./mutation");
const Subscription = require("./Subscription");
const User = require("./user");
const Post = require("./post");
const Comment = require("./comment");

const resolvers = {
  Query,
  Subscription,
  Mutation,
  User,
  Comment,
  Post
};

const fragmentReplacements = extractFragmentReplacements(resolvers);

module.exports = { resolvers, fragmentReplacements };
