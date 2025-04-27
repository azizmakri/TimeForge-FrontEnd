import { Component, OnInit } from '@angular/core';
import { EmailService } from '../email.service';  // Import the email service
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';  // For form handling

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css'],
  imports: [
    ReactiveFormsModule,
    NgIf
  ]
})
export class SendEmailComponent implements OnInit {
  emailForm: FormGroup;
  message: string = '';

  constructor(private emailService: EmailService, private fb: FormBuilder) {
    // Initialize form with validation
    this.emailForm = this.fb.group({
      recipientEmail: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      messageBody: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.emailForm.valid) {
      const emailData = this.emailForm.value;

      // Disable form to prevent duplicate submissions
      this.emailForm.disable();

      this.emailService.sendEmail(emailData).subscribe({
        next: (response) => {
          this.message = 'Email sent successfully!';
          this.emailForm.reset();
          this.emailForm.enable();  // Re-enable the form after success
        },
        error: (error) => {
          console.error('Email sending error:', error);
          this.message = 'There was an error sending the email.';
          this.emailForm.enable();  // Ensure form is re-enabled after failure
        }
      });
    }
  }

}
