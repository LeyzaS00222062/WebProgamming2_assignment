export interface Review {
  _id: string;
  movieId: string;
  userId: {
    _id: string;
    username: string;
  };
  rating: number;
  reviewText: string;
  createdAt: Date;
}

export interface CreateReviewRequest {
  movieId: string;
  rating: number;
  reviewText: string;
}