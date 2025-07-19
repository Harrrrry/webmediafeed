import mongoose from 'mongoose';
import { UserSchema } from './src/modules/users/user.schema';
import { PostSchema } from './src/modules/posts/post.schema';
import { CommentSchema } from './src/modules/comments/comment.schema';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/webmediafeed';

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);
const Comment = mongoose.model('Comment', CommentSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});

  const users = await User.insertMany([
    { username: 'alice', email: 'alice@example.com', passwordHash: 'test', profilePicUrl: '' },
    { username: 'bob', email: 'bob@example.com', passwordHash: 'test', profilePicUrl: '' },
  ]);

  const posts = await Post.insertMany([
    {
      userId: users[0]._id,
      mediaUrl: 'https://placekitten.com/400/300',
      mediaType: 'image',
      caption: 'Cute kitten!',
      likes: [users[1]._id],
    },
    {
      userId: users[1]._id,
      mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      mediaType: 'video',
      caption: 'Sample video',
      likes: [],
    },
  ]);

  await Comment.insertMany([
    { postId: posts[0]._id, userId: users[1]._id, text: 'So cute!' },
    { postId: posts[1]._id, userId: users[0]._id, text: 'Nice video!' },
  ]);

  console.log('Mock data inserted!');
  await mongoose.disconnect();
}

seed(); 