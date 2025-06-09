import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesbypermissionComponent } from './rolesbypermission.component';

describe('RolesbypermissionComponent', () => {
  let component: RolesbypermissionComponent;
  let fixture: ComponentFixture<RolesbypermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesbypermissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesbypermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
