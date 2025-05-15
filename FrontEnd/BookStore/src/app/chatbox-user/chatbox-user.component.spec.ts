import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatboxUserComponent } from './chatbox-user.component';

describe('ChatboxUserComponent', () => {
  let component: ChatboxUserComponent;
  let fixture: ComponentFixture<ChatboxUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatboxUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatboxUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
