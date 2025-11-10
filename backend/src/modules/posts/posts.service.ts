import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async findAll(shaadiId: string, page = 1, limit = 10) {
    // Validate shaadiId is a valid ObjectId
    if (!shaadiId || !Types.ObjectId.isValid(shaadiId)) {
      throw new Error('Invalid shaadiId provided');
    }
    
    const posts = await this.postModel
      .find({ shaadiId: new Types.ObjectId(shaadiId) })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    // For each post, get commentCount and user data
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await this.commentsService.countByPost(String(post._id), String(post.shaadiId));
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

  async findOne(id: string, shaadiId: string) {
    // Validate ObjectIds
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new Error('Invalid post id provided');
    }
    if (!shaadiId || !Types.ObjectId.isValid(shaadiId)) {
      throw new Error('Invalid shaadiId provided');
    }
    
    const post = await this.postModel.findOne({ 
      _id: new Types.ObjectId(id), 
      shaadiId: new Types.ObjectId(shaadiId) 
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(data: { userId: string; shaadiId: string; mediaUrls: string[]; mediaTypes: string[]; caption?: string; tags?: string[] }) {
    // Validate ObjectIds
    if (!data.userId || !Types.ObjectId.isValid(data.userId)) {
      throw new Error('Invalid userId provided');
    }
    if (!data.shaadiId || !Types.ObjectId.isValid(data.shaadiId)) {
      throw new Error('Invalid shaadiId provided');
    }
    
    const post = await this.postModel.create({
      ...data,
      userId: new Types.ObjectId(data.userId),
      shaadiId: new Types.ObjectId(data.shaadiId)
    });
    return post;
  }

  async update(id: string, userId: string, shaadiId: string, data: { caption?: string }) {
    // Validate ObjectIds
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new Error('Invalid post id provided');
    }
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid userId provided');
    }
    if (!shaadiId || !Types.ObjectId.isValid(shaadiId)) {
      throw new Error('Invalid shaadiId provided');
    }
    
    const post = await this.postModel.findOne({ 
      _id: new Types.ObjectId(id), 
      shaadiId: new Types.ObjectId(shaadiId) 
    });
    if (!post) throw new NotFoundException('Post not found');
    if (!post.userId.equals(new Types.ObjectId(userId))) throw new ForbiddenException('Not your post');
    if (data.caption !== undefined) post.caption = data.caption;
    await post.save();
    return post;
  }

  async remove(id: string, userId: string, shaadiId: string) {
    // Validate ObjectIds
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new Error('Invalid post id provided');
    }
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid userId provided');
    }
    if (!shaadiId || !Types.ObjectId.isValid(shaadiId)) {
      throw new Error('Invalid shaadiId provided');
    }
    
    const post = await this.postModel.findOne({ 
      _id: new Types.ObjectId(id), 
      shaadiId: new Types.ObjectId(shaadiId) 
    });
    if (!post) throw new NotFoundException('Post not found');
    if (!post.userId.equals(new Types.ObjectId(userId))) throw new ForbiddenException('Not your post');
    await post.deleteOne();
    return { deleted: true };
  }

  async like(id: string, userId: string, shaadiId: string) {
    // Validate ObjectIds
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new Error('Invalid post id provided');
    }
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid userId provided');
    }
    if (!shaadiId || !Types.ObjectId.isValid(shaadiId)) {
      throw new Error('Invalid shaadiId provided');
    }
    
    const post = await this.postModel.findOne({ 
      _id: new Types.ObjectId(id), 
      shaadiId: new Types.ObjectId(shaadiId) 
    });
    if (!post) throw new NotFoundException('Post not found');
    const userIdObjectId = new Types.ObjectId(userId);
    const index = post.likes.findIndex(likeId => likeId.equals(userIdObjectId));
    if (index === -1) {
      post.likes.push(userIdObjectId);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();
    return post;
  }
} 