import { ComponentFixture, TestBed } from '@angular/core/testing';
// 1. Importiere die korrekte Klasse (meistens WarenkorbComponent)
import { WarenkorbComponent } from './warenkorb'; 

describe('WarenkorbComponent', () => {
  let component: WarenkorbComponent;
  let fixture: ComponentFixture<WarenkorbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 2. Hier ebenfalls die korrekte Komponente eintragen
      imports: [WarenkorbComponent], 
    }).compileComponents();

    fixture = TestBed.createComponent(WarenkorbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Aktualisiert das Stylesheet/HTML für den Test
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});