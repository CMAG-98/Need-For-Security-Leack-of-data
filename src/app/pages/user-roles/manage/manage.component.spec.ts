import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleManageComponent } from './manage.component';

describe('ManageComponent', () => {
  let component: UserRoleManageComponent;
  let fixture: ComponentFixture<UserRoleManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRoleManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRoleManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
