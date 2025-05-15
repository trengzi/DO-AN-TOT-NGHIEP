import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatboxEmployeeComponent } from './chatbox-employee.component';

describe('ChatboxEmployeeComponent', () => {
  let component: ChatboxEmployeeComponent;
  let fixture: ComponentFixture<ChatboxEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatboxEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatboxEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
