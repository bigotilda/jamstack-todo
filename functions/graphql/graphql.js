const { ApolloServer, gql } = require('apollo-server-lambda');
 
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    todos: [Todo]!
  }
  type Todo {
    id: ID!
    text: String!
    done: Boolean!
  }
  type Mutation {
    addTodo(text: String!): Todo
    updateTodoDone(id: ID!): Todo
  }
`;
 
const todos = {};
let todoIndex = 0;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    todos: (parent, args, { user }) => {
      console.log(`NDN: user: ${user}`)
      if (!user) {
        return [];
      } else {
        return Object.values(todos);
      }
    }
  },
  Mutation: {
    addTodo: (_, { text }) => {
        todoIndex++;
        const id = `key-${todoIndex}`;
        todos[id] = {id, text, done: false};
        return todos[id];
    },
    updateTodoDone: (_, { id }) => {
        todos[id].done = !todos[id].done;
        return todos[id];
    }
  }
};
 
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (integrationContext) => {
    console.log(`NDN: integrationContext.context.clientContext: ${integrationContext.context.clientContext}`);
    for (let p in integrationContext.context) {
      console.log(`NDN: p in integrationContext.context: ${p}`);
    }
    for (let p in integrationContext.context.clientContext) {
      console.log(`NDN: p in integrationContext.context.clientContext`);
    }
    if (integrationContext.context.clientContext.user) {
      return { user: integrationContext.context.clientContext.user.sub };
    } else {
      return {};
    }
  },
  // By default, the GraphQL Playground interface and GraphQL introspection
  // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
  //
  // If you'd like to have GraphQL Playground and introspection enabled in production,
  // the `playground` and `introspection` options must be set explicitly to `true`.
  playground: true,
  introspection: true,
});
 
exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true
  }
});
