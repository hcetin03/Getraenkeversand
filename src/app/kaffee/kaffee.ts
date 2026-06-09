import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-kaffee',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './kaffee.html',
  styleUrl: './kaffee.css',
})
export class Kaffee {}