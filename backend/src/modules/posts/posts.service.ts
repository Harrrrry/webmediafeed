import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { CommentsService } from '../comments/comments.service';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => CommentsService)) private commentsService: CommentsService,
  ) {}

  async findAll(page = 1, limit = 10) {
    const posts = await this.postModel
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    // For each post, get commentCount and user data
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await this.commentsService.countByPost(String(post._id));
        const user = await this.userModel.findById(post.userId);
        return { 
          ...post.toObject(), 
          commentCount,
          user: user?.username || 'Unknown User'
        };
      })
    );
    return postsWithCounts;
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(data: { userId: string; mediaUrl: string; mediaType: string; caption?: string }) {
    const post = await this.postModel.create(data);
    return post;
  }

  async update(id: string, userId: string, data: { caption?: string }) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) throw new ForbiddenException('Not your post');
    if (data.caption !== undefined) post.caption = data.caption;
    await post.save();
    return post;
  }

  async remove(id: string, userId: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId) throw new ForbiddenException('Not your post');
    await post.deleteOne();
    return { deleted: true };
  }

  async like(id: string, userId: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();
    return post;
  }
} 