import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Movie {
  _id: string;
  title: string;
  genre: string;
  releaseYear: number;
  director: string;
  posterUrl?: string;
  rating?: number;
}

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  loading = true;
  error = '';
  searchTerm = '';

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load movies';
        this.loading = false;
        console.error(err);
      }
    });
  }

  viewDetails(movieId: string): void {
    this.router.navigate(['/movies', movieId]);
  }

 get filteredMovies(): Movie[] {
    if (!this.searchTerm) return this.movies;
    return this.movies.filter(m => 
      m.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      m.genre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}