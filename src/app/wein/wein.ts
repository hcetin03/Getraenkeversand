import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-wein',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './wein.html',
  styleUrl: './wein.css',
})
export class Wein {}