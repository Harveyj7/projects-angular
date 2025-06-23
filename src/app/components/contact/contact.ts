import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface ContactSubmission extends ContactFormData {
  id: number;
  timestamp: Date;
}

@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  // Form model for ngModel binding
  formData: ContactFormData = {
    name: '',
    email: '',
    message: '',
  };

  // State to store submitted contact forms
  submittedForms: ContactSubmission[] = [];

  // Form submission state
  isSubmitting = false;
  submitSuccess = false;
  submitMessage = '';

  onSubmit() {
    if (this.isValidForm()) {
      this.isSubmitting = true;

      // Simulate API call delay
      setTimeout(() => {
        // Create submission object
        const submission: ContactSubmission = {
          ...this.formData,
          id: Date.now(),
          timestamp: new Date(),
        };

        // Add to state
        this.submittedForms.push(submission);

        // Reset form
        this.resetForm();

        // Update UI state
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.submitMessage =
          'Thank you! Your message has been submitted successfully.';

        // Clear success message after 5 seconds
        setTimeout(() => {
          this.submitSuccess = false;
          this.submitMessage = '';
        }, 5000);
      }, 1000);
    }
  }

  private isValidForm(): boolean {
    return !!(
      this.formData.name.trim() &&
      this.formData.email.trim() &&
      this.formData.message.trim() &&
      this.isValidEmail(this.formData.email)
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private resetForm() {
    this.formData = {
      name: '',
      email: '',
      message: '',
    };
  }

  // Method to clear all submissions (for demo purposes)
  clearSubmissions() {
    this.submittedForms = [];
  }

  // TrackBy function for ngFor performance optimization
  trackBySubmissionId(index: number, submission: ContactSubmission): number {
    return submission.id;
  }
}
