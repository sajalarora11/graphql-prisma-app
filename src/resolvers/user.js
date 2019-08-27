const verifyUser = require("../auth/verifyToken");

const FRAGMENT = `fragment userID on User {id}`;

const User = {
  email: {
    fragment: FRAGMENT,
    resolve(parent, args, { request }, info) {
      const userid = verifyUser(request, false);
      console.log(userid);
      let pparent = JSON.parse(JSON.stringify(parent));
      console.log("PARENT", pparent);

      if (userid && userid === parent.id) return pparent.email;
      else return null;
    }
  }
};

module.exports = User;
