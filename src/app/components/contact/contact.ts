import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';


interface ContactSubmission {
  id: number;
  timestamp: Date;
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButton,
    MatIcon,
    MatLabel,
    MatFormField,
    MatInput,
    MatError,
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  contactForm: FormGroup;
  submittedForms: ContactSubmission[] = [];
  isSubmitting = false;
  submitSuccess = false;
  submitMessage = '';
  private formBuilder = inject(FormBuilder);

  constructor() {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      setTimeout(() => {
        const submission: ContactSubmission = {
          ...this.contactForm.value,
          id: Date.now(),
          timestamp: new Date(),
        };

        this.submittedForms.push(submission);
        this.contactForm.reset();
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.submitMessage =
          'Thank you! Your message has been submitted successfully.';

        // setTimeout(() => {
        //   this.submitSuccess = false;
        //   this.submitMessage = '';
        // }, 5000);
      }, 1000);
    }
  }

  clearSubmissions() {
    this.submittedForms = [];
  }

  trackBySubmissionId(index: number, submission: ContactSubmission): number {
    return submission.id;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string | null {
    const field = this.contactForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
    }
    return null;
  }
}
