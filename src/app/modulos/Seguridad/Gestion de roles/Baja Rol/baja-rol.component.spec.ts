import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BajaRolComponent } from './baja-rol.component';

describe('BajaRolComponent', () => {
  let component: BajaRolComponent;
  let fixture: ComponentFixture<BajaRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BajaRolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BajaRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
