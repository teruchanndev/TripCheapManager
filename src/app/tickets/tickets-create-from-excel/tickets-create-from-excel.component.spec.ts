import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsCreateFromExcelComponent } from './tickets-create-from-excel.component';

describe('TicketsCreateFromExcelComponent', () => {
  let component: TicketsCreateFromExcelComponent;
  let fixture: ComponentFixture<TicketsCreateFromExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsCreateFromExcelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsCreateFromExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
