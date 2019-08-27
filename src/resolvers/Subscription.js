const verifyToken = require("../auth/verifyToken");

const Subscription = {
  comment: {
    subscribe(parent, { postId }, { pubsub }, info) {
      console.log(` in subscription C-${postId}`);
      return pubsub.asyncIterator(`C-${postId}`);
    }
  },
  post: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.post(null, info);
    }
  },
  mypost: {
    subscribe(parent, args, { prisma, request }, info) {
      const userId = verifyToken(request);

      return prisma.subscription.post({
        where: {
          node: {
            id: userId
          }
        }
      });
    }
  }
};

module.exports = Subscription;
