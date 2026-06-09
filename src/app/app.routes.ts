import { Routes } from '@angular/router';
import { Home } from './home/home'; // Importiert deine Home-Klasse
import { Bier } from './bier/bier';
import { Wein } from './wein/wein';
import { Kaffee } from './kaffee/kaffee';
import { LimoUndSaft } from './limo-und-saft/limo-und-saft';
import { Milch } from './milch/milch';
import { Wasser  } from './wasser/wasser';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: Home }, // Wenn kein Pfad eingegeben ist (localhost:4200), zeigt er Home an
  { path: 'bier', component: Bier },
  { path: 'wein', component: Wein },
  { path: 'wasser', component: Wasser },
  { path: 'kaffee', component: Kaffee },
  { path: 'limo-und-saft', component: LimoUndSaft },
  { path: 'milch', component: Milch }
];