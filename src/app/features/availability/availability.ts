import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type Unit = {
  id: string;
  bedrooms: string | number;
  bathrooms: string | number;
  interiorSF: number | string;
  exteriorSF?: number | string;
  price: string;
  // highlight box on the image in % of the image container
  bbox?: { left: number; top: number; width: number; height: number };
};

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './availability.html',
  styleUrls: ['./availability.css'],
})
export class AvailabilityComponent {
  // sample rows + rough bbox placeholders (tweak later to match your overlay image)
  units: Unit[] = [
    { id: '2I7E',   bedrooms: 0,       bathrooms: 1,   interiorSF: 480,    price: '$825,000',   bbox: { left:  8, top: 58, width: 5, height: 10 } },
    { id: '108W',   bedrooms: 1,       bathrooms: 1,   interiorSF: 700,    price: '$1,200,000', bbox: { left: 18, top: 62, width: 5, height: 10 } },
    { id: '120E',   bedrooms: 1,       bathrooms: 1,   interiorSF: 695,    price: '$1,200,000', bbox: { left: 28, top: 56, width: 5, height: 10 } },
    { id: '220E',   bedrooms: 1,       bathrooms: 1,   interiorSF: 666,    price: '$1,275,000', bbox: { left: 38, top: 60, width: 5, height: 10 } },
    { id: '221E',   bedrooms: '1 + HO',bathrooms: 1,   interiorSF: 760,    price: '$1,375,000', bbox: { left: 48, top: 58, width: 5, height: 10 } },
    { id: 'TH115E', bedrooms: 2,       bathrooms: 2.5, interiorSF: '1,471',price: '$2,975,000', bbox: { left: 58, top: 72, width: 6, height: 12 } },
    { id: '219E',   bedrooms: 3,       bathrooms: 2.5, interiorSF: '1,602',price: '$3,050,000', bbox: { left: 68, top: 54, width: 6, height: 10 } },
    { id: '305W',   bedrooms: 3,       bathrooms: 2.5, interiorSF: '1,766',price: '$3,500,000', bbox: { left: 78, top: 52, width: 6, height: 10 } },
    { id: 'PH702W', bedrooms: 3,       bathrooms: 2.5, interiorSF: '2,483',price: '$4,950,000', bbox: { left: 26, top: 18, width: 8, height: 10 } },
    { id: 'PH707E', bedrooms: 4,       bathrooms: 3.5, interiorSF: '2,872',price: '$5,490,000', bbox: { left: 64, top: 16, width: 8, height: 10 } },
  ];

  selectedId: string | null = null;
  select(u: Unit) { this.selectedId = u.id; }
  clearSelection() { this.selectedId = null; }
  get selected() { return this.units.find(u => u.id === this.selectedId) ?? null; }
}
