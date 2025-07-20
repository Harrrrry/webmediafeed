import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './comment.schema';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async findByPost(postId: string) {
    return this.commentModel.find({ postId }).sort({ createdAt: -1 });
  }

  async create(postId: string, userId: string, text: string) {
    const comment = await this.commentModel.create({ postId, userId, text });
    return comment;
  }

  async remove(id: string, userId: string) {
    const comment = await this.commentModel.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('Not your comment');
    await comment.deleteOne();
    return { deleted: true };
  }

  async countByPost(postId: string): Promise<number> {
    return this.commentModel.countDocuments({ postId });
  }
} 