import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-milch',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './milch.html',
  styleUrl: './milch.css',
})
export class Milch {}