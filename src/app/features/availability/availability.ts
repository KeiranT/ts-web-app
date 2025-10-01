import { Component, ElementRef, ViewChild } from '@angular/core';
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
  units: Unit[] = [
    { id: '2I7E',   bedrooms: 0,       bathrooms: 1,   interiorSF: 480,                       price: '$825,000',   bbox: { left:  8, top: 58, width: 5, height: 6 } },
    { id: '108W',   bedrooms: 1,       bathrooms: 1,   interiorSF: 700,                       price: '$1,200,000', bbox: { left: 18, top: 64, width: 13, height: 6 } },
    { id: '120E',   bedrooms: 1,       bathrooms: 1,   interiorSF: 695,                       price: '$1,200,000', bbox: { left: 28, top: 58, width: 5, height: 6 } },
    { id: '220E',   bedrooms: 1,       bathrooms: 1,   interiorSF: 666,                       price: '$1,275,000', bbox: { left: 38, top: 57, width: 7, height: 6 } },
    { id: '221E',   bedrooms: '1 + HO',bathrooms: 1,   interiorSF: 760,                       price: '$1,375,000', bbox: { left: 46, top: 59, width: 7, height: 10 } },
    { id: 'TH115E', bedrooms: 2,       bathrooms: 2.5, interiorSF: '1,471', exteriorSF: 563,  price: '$2,975,000', bbox: { left: 58, top: 72, width: 6, height: 6 } },
    { id: '219E',   bedrooms: 3,       bathrooms: 2.5, interiorSF: '1,602',                   price: '$3,050,000', bbox: { left: 68, top: 50, width: 6, height: 6 } },
    { id: '305W',   bedrooms: 3,       bathrooms: 2.5, interiorSF: '1,766', exteriorSF: 286,  price: '$3,500,000', bbox: { left: 78, top: 50, width: 9, height: 6 } },
    { id: 'PH702W', bedrooms: 3,       bathrooms: 2.5, interiorSF: '2,483', exteriorSF: 1189, price: '$4,950,000', bbox: { left: 26, top: 80, width: 8, height: 6 } },
    { id: 'PH707E', bedrooms: 4,       bathrooms: 3.5, interiorSF: '2,872', exteriorSF: 1130, price: '$5,490,000', bbox: { left: 64, top: 71, width: 10, height: 6 } },
  ];

  selectedId: string | null = null;
  select(u: Unit) { this.selectedId = u.id; }
  clearSelection() { this.selectedId = null; }
  get selected() { return this.units.find(u => u.id === this.selectedId) ?? null; }

  // ---- 360 viewer  ----

  private PANO_BY_UNIT: Record<string, string> = {
    '108W': 'bergen_601w.jpg',
    '219E': 'bergen_601w.jpg',
  };

  // Modal + viewer state
  isPanoOpen = false;
  currentPanoSrc: string | null = null;
  private viewer: any = null;
  private rafId: number | null = null;

  @ViewChild('panoContainer') panoContainer!: ElementRef<HTMLDivElement>;

  hasPano(id: string): boolean {
    return !!this.PANO_BY_UNIT[id];
  }

  async open360(id: string) {
  const src = this.PANO_BY_UNIT[id];
  if (!src) return;

  this.currentPanoSrc = src;  
  this.isPanoOpen = true;

  await Promise.resolve();                  
  await new Promise(r => setTimeout(r, 0)); 

  const el = this.panoContainer?.nativeElement;
  if (!el) {
    console.error('360: container missing');
    return;
  }

  const ensureSized = () =>
    new Promise<void>(resolve => {
      let tries = 0;
      const tick = () => {
        const w = el.clientWidth, h = el.clientHeight;
        if ((w > 0 && h > 0) || tries > 10) resolve();
        else { tries++; setTimeout(tick, 16); }
      };
      tick();
    });
  await ensureSized();

  if (this.viewer?.destroy) this.viewer.destroy();

  try {
    const { Viewer } = await import('@photo-sphere-viewer/core');

    this.viewer = new Viewer({
      container: el,
      panorama: this.currentPanoSrc!,
      navbar: ['zoom', 'fullscreen'], 
    });

    // Log success/fail 
    this.viewer.addEventListener('ready', () => {
      console.log('PSV ready:', this.currentPanoSrc);
    });
    this.viewer.addEventListener('error', (e: any) => {
      console.error('PSV error:', e);
    });
  } catch (e) {
    console.error('PSV init error:', e);
  }
}

  close360() {
    if (this.rafId !== null) { cancelAnimationFrame(this.rafId); this.rafId = null; }
    if (this.viewer?.destroy) { try { this.viewer.destroy(); } catch {} this.viewer = null; }
    this.isPanoOpen = false;
    this.currentPanoSrc = null;
  }
}
