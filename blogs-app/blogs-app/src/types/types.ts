export interface Comment {
  postedBy: string;
  text: string;
  id: number;
}

export interface Article {
  name?: string;
  upvotes: number;
  canUpvote?: boolean;
  comments: Comment[];
}
