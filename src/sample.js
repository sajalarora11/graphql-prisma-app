const { buildSchema } = require("graphql");
const _ = require("lodash");

var books = [
    { name: "book1", genre: "genre1", id: "1", authorId: "3" },
    { name: "book2", genre: "genre2", id: "2", authorId: "2" },
    { name: "book3", genre: "genre3", id: "3", authorId: "1" },
    { name: "book4", genre: "genre4", id: "4", authorId: "1" },
    { name: "book5", genre: "genre5", id: "5", authorId: "1" }
];

var authors = [
    { name: "author1", age: 22, id: "1" },
    { name: "author2", age: 23, id: "2" },
    { name: "author3", age: 24, id: "3" }
];

exports.DoctorSchema = buildSchema(`
    type Doctor {
        id: ID! @id
        createdAt: DateTime! @createdAt
        updatedAt: DateTime! @updatedAt

        name: String! @unique
        email: String! @unique
        phone: String!
        experience: Int!
        hospital: String!
        specialization: String!
        patients: [Patient!]!
    }
`)

const DoctorType = new GraphQLObjectType({
    name: "Doctor",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLNonNull(GraphQLString) },
        emai: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }

    author: {
            type: AuthorType,
            resolve(parent, args) {
                console.log("hello", parent);
                return _.find(authors, { id: parent.authorId });
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        id: { type: GraphQLID },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                console.log("in author", parent);
                return _.filter(books, { authorId: parent.id });
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // all the tasks here...
                console.log("I am here in the book field");
                return _.find(books, { id: args.id });
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                console.log("I ma in the author thing");
                return _.find(authors, { id: args.id });
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors;
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                //console.log("adding new author");
                authors.push(args);
                console.log(authors);
                return args;
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                console.log("added book");
                books.push(args);
                return args;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
