import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersbyrolComponent } from './usersbyrol.component';

describe('UsersbyrolComponent', () => {
  let component: UsersbyrolComponent;
  let fixture: ComponentFixture<UsersbyrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersbyrolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersbyrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
