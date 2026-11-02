import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [ReactiveFormsModule, TranslatePipe],
})
export class ContactComponent {
  private readonly apiService = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);

  isMessageSent = false;
  isMessageFailed = false;

  readonly sendEmailForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
  });

  sendEmail(): void {
    this.isMessageSent = false;
    this.isMessageFailed = false;
    const { name, email, message } = this.sendEmailForm.value;
    this.apiService.sendMail(name, email, message).subscribe({
      next: () => (this.isMessageSent = true),
      error: () => (this.isMessageFailed = true),
    });
  }
}
