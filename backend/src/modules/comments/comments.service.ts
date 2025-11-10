import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './comment.schema';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async findByPost(postId: string, shaadiId: string) {
    return this.commentModel.find({ 
      postId: new Types.ObjectId(postId), 
      shaadiId: new Types.ObjectId(shaadiId) 
    }).sort({ createdAt: -1 });
  }

  async create(postId: string, userId: string, shaadiId: string, text: string) {
    const comment = await this.commentModel.create({ 
      postId: new Types.ObjectId(postId), 
      userId: new Types.ObjectId(userId), 
      shaadiId: new Types.ObjectId(shaadiId), 
      text 
    });
    return comment;
  }

  async remove(id: string, userId: string) {
    const comment = await this.commentModel.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');
    if (!comment.userId.equals(new Types.ObjectId(userId))) throw new ForbiddenException('Not your comment');
    await comment.deleteOne();
    return { deleted: true };
  }

  async countByPost(postId: string, shaadiId: string): Promise<number> {
    return this.commentModel.countDocuments({ 
      postId: new Types.ObjectId(postId), 
      shaadiId: new Types.ObjectId(shaadiId) 
    });
  }
} 