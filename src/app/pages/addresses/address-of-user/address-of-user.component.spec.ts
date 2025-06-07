import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressOfUserComponent } from './address-of-user.component';

describe('AddressOfUserComponent', () => {
  let component: AddressOfUserComponent;
  let fixture: ComponentFixture<AddressOfUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressOfUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressOfUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
