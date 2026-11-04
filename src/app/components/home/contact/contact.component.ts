import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ContactStore } from '../../../store/contact/contact.store';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [ReactiveFormsModule, TranslatePipe],
})
export class ContactComponent implements OnInit {

  readonly contactStore = inject(ContactStore);
  private readonly formBuilder = inject(FormBuilder);

  readonly sendEmailForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
  });

  ngOnInit(): void {
    this.contactStore.reset();
  }

  sendEmail(): void {

    if (this.sendEmailForm.invalid || this.contactStore.isLoading()) {
      this.sendEmailForm.markAllAsTouched();
      return;
    }

    const { name, email, message } = this.sendEmailForm.value;

    this.contactStore.sendEmail({ name, email, message });
  }
}
