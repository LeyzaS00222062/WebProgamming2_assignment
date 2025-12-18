import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule], 
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent {
  @Input() movieId!: string;
  @Output() reviewSubmitted = new EventEmitter<void>();

  reviewForm: FormGroup;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  selectedRating: number = 0;
  hoveredRating: number = 0;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      reviewText: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ rating });
  }

  setHoveredRating(rating: number): void {
    this.hoveredRating = rating;
  }

  clearHoveredRating(): void {
    this.hoveredRating = 0;
  }

  getStarClass(index: number): string {
    const rating = this.hoveredRating || this.selectedRating;
    return index <= rating ? 'star-filled' : 'star-empty';
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const reviewData = {
        movieId: this.movieId,
        rating: this.reviewForm.value.rating,
        reviewText: this.reviewForm.value.reviewText
      };

      this.reviewService.createReview(reviewData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.reviewForm.reset();
          this.selectedRating = 0;
          this.reviewSubmitted.emit();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.message || 'Failed to submit review';
        }
      });
    }
  }

  get reviewText() {
    return this.reviewForm.get('reviewText');
  }

  get rating() {
    return this.reviewForm.get('rating');
  }
}
