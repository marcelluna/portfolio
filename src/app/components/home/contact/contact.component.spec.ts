import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { commonTestProviders } from '../../../../testing/test-providers';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [commonTestProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build an invalid form by default', () => {
    expect(component.sendEmailForm.valid).toBe(false);
  });

  it('should be valid once all fields are filled', () => {
    component.sendEmailForm.setValue({
      name: 'Jane',
      email: 'jane@example.com',
      message: 'Hello',
    });
    expect(component.sendEmailForm.valid).toBe(true);
  });
});
