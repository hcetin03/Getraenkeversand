import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable ({ providedIn: 'root'})
export class AuthSErvic {

  constructor(private router: Router) {}

  login: 