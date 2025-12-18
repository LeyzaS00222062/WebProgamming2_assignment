import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Review, CreateReviewRequest } from '../models/review.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}


  getMovieReviews(movieId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/movie/${movieId}`).pipe(
      map(reviews => reviews.map(review => ({
        ...review,
        createdAt: new Date(review.createdAt)
      }))),
      catchError(this.handleError)
    );
  }

  
  getUserReviews(userId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/user/${userId}`).pipe(
      map(reviews => reviews.map(review => ({
        ...review,
        createdAt: new Date(review.createdAt)
      }))),
      catchError(this.handleError)
    );
  }

 
  createReview(review: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review).pipe(
      map(createdReview => ({
        ...createdReview,
        createdAt: new Date(createdReview.createdAt)
      })),
      catchError(this.handleError)
    );
  }

 
  getReview(reviewId: string): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${reviewId}`).pipe(
      map(review => ({
        ...review,
        createdAt: new Date(review.createdAt)
      })),
      catchError(this.handleError)
    );
  }

 
  updateReview(reviewId: string, reviewData: Partial<CreateReviewRequest>): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${reviewId}`, reviewData).pipe(
      map(updatedReview => ({
        ...updatedReview,
        createdAt: new Date(updatedReview.createdAt)
      })),
      catchError(this.handleError)
    );
  }

 
  deleteReview(reviewId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}`).pipe(
      catchError(this.handleError)
    );
  }

  
  calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) {
      return 0;
    }
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  hasUserReviewedMovie(movieId: string, userId: string): Observable<boolean> {
    return this.getUserReviews(userId).pipe(
      map(reviews => reviews.some(review => review.movieId === movieId)),
      catchError(() => {
        return [false];
      })
    );
  }

  
  getReviewsCount(movieId: string): Observable<number> {
    return this.getMovieReviews(movieId).pipe(
      map(reviews => reviews.length),
      catchError(() => {
        return [0];
      })
    );
  }

 
  getRatingDistribution(movieId: string): Observable<{ [key: number]: number }> {
    return this.getMovieReviews(movieId).pipe(
      map(reviews => {
        const distribution: { [key: number]: number } = {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0
        };
        
        reviews.forEach(review => {
          distribution[review.rating]++;
        });
        
        return distribution;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   * @param error - The error object
   * @returns Observable error
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('ReviewService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
