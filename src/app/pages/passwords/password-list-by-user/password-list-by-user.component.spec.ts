import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordListByUserComponent } from './password-list-by-user.component';

describe('PasswordListByUserComponent', () => {
  let component: PasswordListByUserComponent;
  let fixture: ComponentFixture<PasswordListByUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordListByUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordListByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
