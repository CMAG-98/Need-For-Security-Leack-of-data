import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsbyroleComponent } from './permissionsbyrole.component';

describe('PermissionsbyroleComponent', () => {
  let component: PermissionsbyroleComponent;
  let fixture: ComponentFixture<PermissionsbyroleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionsbyroleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionsbyroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
