export interface Post {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  likes: string[];
  user: string;
  timestamp: string;
  commentCount: number;
}

export interface CreatePostRequest {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
}

export interface CreatePostResponse extends Post {} 