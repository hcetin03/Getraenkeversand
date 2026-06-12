import { Routes } from '@angular/router';
import { Home } from './home/home'; 
import { Wasser } from './wasser/wasser';
import { Bier } from './bier/bier';
import { Milch } from './milch/milch';
import { Wein } from './wein/wein';
import { Kaffee } from './kaffee/kaffee';
import { LimoUndSaft } from './limo-und-saft/limo-und-saft';
import { WarenkorbComponent } from './warenkorb/warenkorb'; 
import { Login } from './login/login'; // <-- Geändert zu LoginComponent!

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home }, 
  { path: 'bier', component: Bier },
  { path: 'milch', component: Milch },
  { path: 'wein', component: Wein },
  { path: 'wasser', component: Wasser },
  { path: 'kaffee', component: Kaffee },
  { path: 'limo-und-saft', component: LimoUndSaft },
  { path: 'warenkorb', component: WarenkorbComponent }, // <-- Hier ist jetzt das Komma!
  { path: 'login', component: Login } // <-- Geändert zu LoginComponent!
];
