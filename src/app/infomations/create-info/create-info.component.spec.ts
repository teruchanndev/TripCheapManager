import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInfoComponent } from './create-info.component';

describe('CreateInfoComponent', () => {
  let component: CreateInfoComponent;
  let fixture: ComponentFixture<CreateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
