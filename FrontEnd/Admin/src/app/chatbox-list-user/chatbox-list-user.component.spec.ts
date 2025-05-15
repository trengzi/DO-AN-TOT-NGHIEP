import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatboxListUserComponent } from './chatbox-list-user.component';

describe('ChatboxListUserComponent', () => {
  let component: ChatboxListUserComponent;
  let fixture: ComponentFixture<ChatboxListUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatboxListUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatboxListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
