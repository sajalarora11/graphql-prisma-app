const verifyToken = require("../auth/verifyToken");

const Query = {
  users(parent, args, { prisma, request }, info) {
    return prisma.query.users({}, info);
  },
  userposts(parent, args, { prisma, request }, info) {
    const userid = verifyToken(request, true);
    const userFound = prisma.exists.User({ id: userid });
    if (!userFound) throw new Error("Bad request");
    return prisma.query.posts(
      {
        where: {
          author: {
            id: userid
          }
        }
      },
      info
    );
  },
  posts(parent, args, { prisma }, info) {
    return prisma.query.posts({}, info);
  },
  comments: (parent, args, { prisma }, info) => {
    return prisma.query.comments(null, info);
  },
  async post(parent, args, { prisma, request }, info) {
    const userId = verifyToken(request, false);

    const posts = await prisma.query.posts(
      {
        where: {
          OR: [{ id: args.id }, { author: { id: userId } }]
        }
      },
      info
    );
    return JSON.parse(JSON.stringify(posts))[0];
  },
  async me(parent, args, { prisma, request }, info) {
    const userid = verifyToken(request);
    const user = await prisma.exists.User({ id: userid });
    if (!user) throw new Error("Invalid request...");
    return prisma.query.user(
      {
        where: {
          id: userid
        }
      },
      info
    );
  }
};

module.exports = Query;
