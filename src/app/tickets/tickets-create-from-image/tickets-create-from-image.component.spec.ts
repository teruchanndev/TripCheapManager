import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsCreateFromImageComponent } from './tickets-create-from-image.component';

describe('TicketsCreateFromImageComponent', () => {
  let component: TicketsCreateFromImageComponent;
  let fixture: ComponentFixture<TicketsCreateFromImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsCreateFromImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsCreateFromImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
