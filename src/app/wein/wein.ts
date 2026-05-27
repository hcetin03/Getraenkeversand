import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wein',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './wein.html',
  styleUrl: './wein.css',
})
export class Wein {}