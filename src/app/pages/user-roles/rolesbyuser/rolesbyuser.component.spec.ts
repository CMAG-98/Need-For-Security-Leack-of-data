import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesbyuserComponent } from './rolesbyuser.component';

describe('RolesbyuserComponent', () => {
  let component: RolesbyuserComponent;
  let fixture: ComponentFixture<RolesbyuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesbyuserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesbyuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
