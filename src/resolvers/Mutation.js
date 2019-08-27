const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const verifyToken = require("../auth/verifyToken");

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const user = await prisma.exists.User({ name: args.data.name });
    if (user) throw new Error("User already exists!!");
    if (args.data.password.length < 1 || args.data.password.length > 20)
      throw new Error("Invalid Password!");
    const password = await bcrypt.hash(args.data.password, 10);
    const saveduser = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });
    console.log(saveduser);

    return {
      user: saveduser,
      token: jwt.sign({ userId: saveduser.id }, "mysecret", { expiresIn: "2d" })
    };
  },
  async loginUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ email: args.data.email });
    if (!userExists) throw new Error("Invalid username or password");
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    });
    const passwordMatch = await bcrypt.compare(
      args.data.password,
      user.password
    );
    console.log("Match", passwordMatch);
    if (!passwordMatch) throw new Error("Invalid username or password...");
    return {
      user: user,
      token: jwt.sign({ userId: user.id }, "mysecret", { expiresIn: "2d" })
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const argsObj = {};
    const userId = verifyToken(request);
    const user = await prisma.exists.User({ id: userId });
    if (!user) throw new Error("No such user found1");
    argsObj.where = {
      id: userId
    };
    return prisma.mutation.deleteUser(argsObj, info);
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const argsObj = {};
    const userId = verifyToken(request);
    console.log("USERID", userId);
    const user = await prisma.exists.User({ id: userId });
    if (!user) throw new Error("No such user found1");
    argsObj.where = {
      id: userId
    };
    argsObj.update = {
      name: args.data.name,
      email: args.data.email
    };
    return prisma.mutation.updateUser(argsObj, info);
  },
  async updateUserPassword(parent, args, { prisma, request }, info) {
    const userId = verifyToken(request);
    const hashedpassword = await bcrypt.hash(args.data.password, 10);
    const userExists = prisma.exists.User({
      id: userId,
      password: hashedpassword
    });
    if (!userExists) throw new Error("Invalid Password!");
    const newPassword = await bcrypt.hash(args.data.newPassword, 10);
    return prisma.mutation.updateUser(
      {
        data: {
          password: newPassword
        },
        where: {
          id: userId
        }
      },
      info
    );
  },
  async createPost(parent, args, { prisma, request }, info) {
    const argsObj = {};
    const userId = verifyToken(request);
    if (!userId) throw new Error("Invalid request");
    argsObj.data = {
      title: args.data.title,
      desc: args.data.desc,
      author: {
        connect: {
          id: userId
        }
      }
    };
    return prisma.mutation.createPost(argsObj, info);
  },
  async updatePost(parent, args, { prisma }, info) {
    const argsObj = {};
    const post = await prisma.exists.Post({ id: args.id });
    if (!post) throw new Error("No such post found!");
    argsObj.where = {
      id: args.id
    };
    argsObj.update = {
      title: args.data.title,
      desc: args.data.desc
    };
    return prisma.mutation.updatePost(argsObj, info);
  },
  async deletePost(parent, args, { prisma }, info) {
    const post = await prisma.exists.Post({ id: args.id });
    if (!post) throw new Error("No such post found");
    argsObj.where = {
      id: args.id
    };
    return prisma.mutation.deleteUser(argsObj, info);
  },
  async createComment(parent, args, { prisma, request }, info) {
    const userId = verifyToken(request);
    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId
            }
          },
          post: {
            connect: {
              id: args.data.post
            }
          }
        }
      },
      info
    );
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = verifyToken(request);
    if (!userId) throw new Error("Invalid request...");

    return prisma.mutation.updateComment(
      {
        where: {
          id: args.id
        },
        data: {
          text: args.data.text
        }
      },
      info
    );
  },
  deleteComment(parent, args, { prisma, request }, info) {
    const userId = verifyToken(request);
    if (!userId) throw new Error("Invalid request");

    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  }
};

module.exports = Mutation;
