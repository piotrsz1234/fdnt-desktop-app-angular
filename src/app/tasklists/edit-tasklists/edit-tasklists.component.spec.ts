import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTasklistsComponent } from './edit-tasklists.component';

describe('EditTasklistsComponent', () => {
  let component: EditTasklistsComponent;
  let fixture: ComponentFixture<EditTasklistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTasklistsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTasklistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
