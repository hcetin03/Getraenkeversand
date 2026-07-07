import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-wasser',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './wasser.html',
  styleUrl: './wasser.css',
})
export class Wasser implements OnInit {
  produkte: any[] = [];
  private cartService = inject(CartService);

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/api/produkt?kategorie=Wasser')
      .subscribe({
        next: (data) => {
          this.produkte = data;
          this.cdr.detectChanges();
        },
        error: (error) => console.error(error)
      });
  }

  inDenWarenkorb(produkt: any) {
    this.cartService.addToCart(produkt);
  }
}