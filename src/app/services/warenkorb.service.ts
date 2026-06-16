import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Getraenk } from '../model/getraenk.model';

export interface WarenkorbItem {
    getraenk: Getraenk;
    menge: number;
}

@Injectable({
  providedIn: 'root',
})

export class Warenkorb {

}
