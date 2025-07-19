export interface Comment {
  id: string;
  postId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface AddCommentRequest {
  postId: string;
  text: string;
}

export interface AddCommentResponse extends Comment {} 