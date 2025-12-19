import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { Movie } from '../../models/movie.model';
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewFormComponent } from '../review-form/review-form.component';


@Component({
  selector: 'app-movie-detail',
  imports: [CommonModule, FormsModule, ReviewFormComponent],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  reviews: Review[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  showReviewForm: boolean = false;
  averageRating: number = 0;
  currentUserId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUserId = user?.id || '';
    });

    // Get movie ID from route params
    this.route.params.subscribe(params => {
      const movieId = params['id'];
      if (movieId) {
        this.loadMovieDetails(movieId);
        this.loadReviews(movieId);
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
    this.movieService.getMovieById(id).subscribe({
      next: (data) => {
        console.log('Movie data received:', data); 
        this.movie = data;
      },
      error: (error) => {
        console.error('Error fetching movie:', error); 
      }
    });
  }
  }

  loadMovieDetails(movieId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    
    this.movieService.getMovie(movieId).subscribe({
      next: (movie: any) => {
        this.movie = movie;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load movie details. Please try again.';
        this.isLoading = false;
        console.error('Error loading movie:', error);
      }
    });
  }

  loadReviews(movieId: string): void {
    this.reviewService.getMovieReviews(movieId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.calculateAverageRating();
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }

  calculateAverageRating(): void {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
  }

  toggleReviewForm(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }
    this.showReviewForm = !this.showReviewForm;
  }

  onReviewSubmitted(): void {
    this.showReviewForm = false;
    if (this.movie) {
      this.loadReviews(this.movie._id);
    }
  }

  getStarsArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.round(rating));
  }

  getFullStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.ceil(rating)).fill(0);
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5;
  }

  goBack(): void {
    this.router.navigate(['/movies']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getRatingColor(rating: number): string {
    if (rating >= 4) return '#27ae60';
    if (rating >= 3) return '#f39c12';
    return '#e74c3c';
  }

  
}

