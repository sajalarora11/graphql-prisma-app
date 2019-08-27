const users = [
  { id: "1212", name: "sajal", age: 21, email: "sajalarora@gmail.com" },
  { id: "1111", name: "sazz", age: 22, email: "sazz@gmail.com" },
  { id: "1122", name: "starboy", age: 24, email: "sazzy@gmail.com" }
];

const posts = [
  {
    id: "1",
    title: "a road to heaven.",
    desc: "The description of the post",
    author: "1212"
  },
  {
    id: "2",
    title: "title to the second post",
    desc: "the desc for the sample post 2",
    author: "1111"
  },
  {
    id: "3",
    title: "title for the second post",
    desc: "this is the sample post 3 talking some bulshit",
    author: "1122"
  }
];

const comments = [
  { id: "1", text: "his is the sample comment 1", onPost: "1" },
  { id: "2", text: "his is the sample comment 2", onPost: "1" },
  { id: "3", text: "his is the sample comment 3", onPost: "1" },
  { id: "4", text: "his is the sample comment 4", onPost: "2" },
  { id: "5", text: "his is the sample comment 5", onPost: "3" },
  { id: "6", text: "his is the sample comment 6", onPost: "3" },
  { id: "7", text: "his is the sample comment 7", onPost: "2" },
  { id: "8", text: "his is the sample comment 8", onPost: "2" }
];

exports.db = { users, posts, comments };
