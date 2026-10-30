import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
    standalone: false
})
export class ContactComponent {
  isMessageSent = false;
  isMessageFailed = false;

  readonly sendEmailForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
  ) {
    this.sendEmailForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

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
