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

export interface UpdateReviewRequest {
  rating?: number;
  reviewText?: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface PaginatedReviews {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}