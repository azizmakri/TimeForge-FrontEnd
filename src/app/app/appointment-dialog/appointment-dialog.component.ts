import { Component, Inject } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  ValidationErrors, ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import {Appointment} from './appointment-dialog.model';
import {AppointmentService} from './appointment.service'; // Move these here to import as components

@Component({
  selector: 'app-appointment-dialog',
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    ReactiveFormsModule, // You can remove FormsModule here as it's not being used
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
})
export class AppointmentDialogComponent {
  appointmentForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Appointment,
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService  // Inject the AppointmentService
  ) {
    this.appointmentForm = this.formBuilder.group(
      {
        title: [this.data.title || '', Validators.required],
        date: [this.data.date, Validators.required],
        startTime: [this.data.startTime || '', Validators.required],
        endTime: [this.data.endTime || '', Validators.required],
      },
      { validators: this.timeRangeValidator }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.appointmentForm.valid) {
      const appointmentData: Appointment = {
        ...this.appointmentForm.value,
        uuid: this.data.uuid,
      };

      if (this.data.uuid) {
        // If uuid exists, update the appointment
        this.appointmentService.updateAppointment(this.data.uuid, appointmentData).subscribe(
          (updatedAppointment) => {
            this.dialogRef.close(updatedAppointment);
          },
          (error) => {
            console.error('Error updating appointment', error);
          }
        );
      } else {
        // If uuid does not exist, create a new appointment
        this.appointmentService.createAppointment(appointmentData).subscribe(
          (newAppointment) => {
            this.dialogRef.close(newAppointment);
          },
          (error) => {
            console.error('Error creating appointment', error);
          }
        );
      }
    }
  }

  onDeleteClick(): void {
    if (this.data.uuid) {
      this.appointmentService.deleteAppointment(this.data.uuid).subscribe(
        () => {
          this.dialogRef.close({ remove: true, uuid: this.data.uuid });
        },
        (error) => {
          console.error('Error deleting appointment', error);
        }
      );
    }
  }

  timeRangeValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;
    if (startTime && endTime) {
      const [startHours, startMinutes] = startTime.split(':');
      const [endHours, endMinutes] = endTime.split(':');

      const startDate = new Date();
      startDate.setHours(startHours);
      startDate.setMinutes(startMinutes);

      const endDate = new Date();
      endDate.setHours(endHours);
      endDate.setMinutes(endMinutes);

      if (startDate > endDate) {
        return { timeRangeInvalid: true };
      }
    }
    return null;
  };
}
