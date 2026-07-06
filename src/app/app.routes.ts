import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Wasser } from './wasser/wasser';
import { Bier } from './bier/bier';
import { Milch } from './milch/milch';
import { Wein } from './wein/wein';
import { Kaffee } from './kaffee/kaffee';
import { LimoUndSaft } from './limo-und-saft/limo-und-saft';
import { WarenkorbComponent } from './warenkorb/warenkorb';
import { Login } from './login/login';
import { MitarbeiterComponent } from './mitarbeiter/mitarbeiter';
import { Favoriten } from './favoriten/favoriten';
import { Jubilaeum } from './jubilaeum/jubilaeum';
import { Angebote } from './angebote/angebote';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'bier', component: Bier },
  { path: 'milch', component: Milch },
  { path: 'wein', component: Wein },
  { path: 'wasser', component: Wasser },
  { path: 'kaffee', component: Kaffee },
  { path: 'limo-und-saft', component: LimoUndSaft },
  { path: 'warenkorb', component: WarenkorbComponent },
  { path: 'login', component: Login },
  { path: 'mitarbeiter', component: MitarbeiterComponent },
  { path: 'favoriten', component: Favoriten },
  { path: 'jubilaeum', component: Jubilaeum },
  { path: 'angebote', component: Angebote },
];
