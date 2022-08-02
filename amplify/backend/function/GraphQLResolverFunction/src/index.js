const POSTS = [
  {
    id: 1,
    name: 'AWS Lambda: How To Guide.',
    description: 'String',
    city: 'String',
    createdAt: '2022-08-02T08:13:08.181Z"',
    updatedAt: '2022-08-02T08:13:08.181Z"',
  },
  {
    id: 2,
    name: 'AWS Amplify Launches @function and @key directives.',
    description: '2022-08-02T08:13:08.181Z"',
    city: '2022-08-02T08:13:08.181Z"',
    createdAt: '2022-08-02T08:13:08.181Z"',
    updatedAt: '2022-08-02T08:13:08.181Z"',
  },
  {
    id: 3,
    name: 'Serverless 101',
    description: 'String',
    city: 'String',
    createdAt: '2022-08-02T08:13:08.181Z"',
    updatedAt: '2022-08-02T08:13:08.181Z"',
  },
];
const COMMENTS = [
  { postId: 1, content: 'Great guide!' },
  { postId: 1, content: 'Thanks for sharing!' },
  { postId: 2, content: "Can't wait to try them out!" },
];

// Get all posts. Write your own logic that reads from any data source.
function getPosts() {
  return POSTS;
}

// Get the comments for a single post.
function getCommentsForPost(postId) {
  return COMMENTS.filter((comment) => comment.postId === postId);
}

/**
 * Using this as the entry point, you can use a single function to handle many resolvers.
 */
const resolvers = {
  Query: {
    posts: (ctx) => {
      return getPosts();
    },
  },
  Post: {
    comments: (ctx) => {
      return getCommentsForPost(ctx.source.id);
    },
  },
};

// event
// {
//   "typeName": "Query", /* Filled dynamically based on @function usage location */
//   "fieldName": "me", /* Filled dynamically based on @function usage location */
//   "arguments": { /* GraphQL field arguments via $ctx.arguments */ },
//   "identity": { /* AppSync identity object via $ctx.identity */ },
//   "source": { /* The object returned by the parent resolver. E.G. if resolving field 'Post.comments', the source is the Post object. */ },
//   "request": { /* AppSync request object. Contains things like headers. */ },
//   "prev": { /* If using the built-in pipeline resolver support, this contains the object returned by the previous function. */ },
// }
exports.handler = async (event) => {
  const typeHandler = resolvers[event.typeName];
  if (typeHandler) {
    const resolver = typeHandler[event.fieldName];
    if (resolver) {
      return await resolver(event);
    }
  }
  throw new Error('Resolver not found.');
};
