export interface Post {
  id: string;
  mediaUrls: string[];
  mediaTypes: string[];
  caption: string;
  likes: string[];
  user: string;
  timestamp: string;
  commentCount: number;
  tags?: string[];
}

export interface CreatePostRequest {
  mediaUrls: string[];
  mediaTypes: string[];
  caption?: string;
  tags?: string[];
}

export interface CreatePostResponse extends Post {}

export interface PostCardProps {
  id: string;
  mediaUrls: string[];
  mediaTypes: string[];
  caption: string;
  likes: string[] | number;
  onLike: () => void;
  user: any;
  timestamp: string;
  userObj: any;
  commentCount: number;
  tags?: string[];
}

export interface UsePostCardProps {
  id: string;
  likes: string[] | number;
  userObj: any;
  commentCount: number;
  onLike: () => void;
} 