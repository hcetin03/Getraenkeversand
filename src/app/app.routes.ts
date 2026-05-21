import { Routes } from '@angular/router';
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
];