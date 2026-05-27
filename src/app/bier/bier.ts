import { Component } from '@angular/core';
<<<<<<< HEAD

@Component({
  selector: 'app-bier',
  imports: [],
  templateUrl: './bier.html',
  styleUrl: './bier.css',
})
export class Bier {}
=======
import { RouterLink } from '@angular/router'; // Importieren!

@Component({
  selector: 'app-bier',
  standalone: true,
  imports: [RouterLink], // Hier eintragen!
  templateUrl: './bier.html',
  styleUrl: './bier.css',
})
export class Bier {}
>>>>>>> caa384637f35fc40decf2234f5875c663186d562
