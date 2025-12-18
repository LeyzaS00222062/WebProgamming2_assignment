import { Routes } from '@angular/router';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';


export const routes: Routes = [
    {path: '',redirectTo: '/movies',},
    {path: '/movies', component: MovieListComponent},
    {path: 'movies/:id', component: MovieDetailComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent}
];