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

  // Create a test shaadi first
  const Shaadi = mongoose.model('Shaadi', require('./src/modules/shaadi/shaadi.schema').ShaadiSchema);
  const testShaadi = await Shaadi.create({
    name: 'Test Wedding',
    brideName: 'Alice',
    groomName: 'Bob',
    date: new Date('2024-12-31'),
    location: 'Test Location',
    code: '123456',
    createdBy: users[0]._id
  });

  const posts = await Post.insertMany([
    {
      userId: users[0]._id,
      shaadiId: testShaadi._id,
      mediaUrls: ['https://placekitten.com/400/300'],
      mediaTypes: ['image'],
      caption: 'Cute kitten!',
      likes: [users[1]._id],
    },
    {
      userId: users[1]._id,
      shaadiId: testShaadi._id,
      mediaUrls: ['https://www.w3schools.com/html/mov_bbb.mp4'],
      mediaTypes: ['video'],
      caption: 'Sample video',
      likes: [],
    },
  ]);

  await Comment.insertMany([
    { postId: posts[0]._id, userId: users[1]._id, shaadiId: testShaadi._id, text: 'So cute!' },
    { postId: posts[1]._id, userId: users[0]._id, shaadiId: testShaadi._id, text: 'Nice video!' },
  ]);

  console.log('Mock data inserted!');
  await mongoose.disconnect();
}

seed(); 