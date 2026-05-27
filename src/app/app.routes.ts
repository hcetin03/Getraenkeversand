import { Routes } from '@angular/router';
<<<<<<< HEAD
import { Home } from './home/home';
import { Milch } from './milch/milch';
import { Wasser } from './wasser/wasser';
import { Bier } from './bier/bier';
import { Kaffee } from './kaffee/kaffee';



export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'milch', component: Milch },
  { path: 'wasser', component: Wasser },
  { path: 'bier', component: Bier },
  { path: 'kaffee', component: Kaffee },
=======
import { Home } from './home/home'; // Importiert deine Home-Klasse
import { Bier } from './bier/bier';
import { Wein } from './wein/wein';
import { Kaffee } from './kaffee/kaffee';
import { LimoUndSaft } from './limo-und-saft/limo-und-saft';

export const routes: Routes = [
  { path: '', component: Home }, // Wenn kein Pfad eingegeben ist (localhost:4200), zeigt er Home an
  { path: 'bier', component: Bier },
  { path: 'wein', component: Wein },
  { path: 'kaffee', component: Kaffee },
  { path: 'limo-und-saft', component: LimoUndSaft }
>>>>>>> caa384637f35fc40decf2234f5875c663186d562
];