import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShiftInterface } from 'src/app/interfaces/shift-interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ShiftsService } from 'src/app/services/shifts/shifts.service';

@Component({
  selector: 'app-add-shift',
  templateUrl: './add-shift.component.html',
  styleUrls: ['./add-shift.component.css'],
})
export class AddShiftComponent {
  addShiftForm: FormGroup;
  formHasErrors: boolean = false;
  loading: boolean = false;
  successMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private shiftsService: ShiftsService,
    private authService: AuthService
  ) {
    this.addShiftForm = this.fb.group({
      shiftDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      wage: ['', [Validators.required]],
      workplace: ['-', [Validators.required]],
      comments: [''],
    });
  }

  onSubmit() {
    if (
      this.addShiftForm.invalid ||
      this.addShiftForm.get('workplace')?.value === '-'
    ) {
      this.formHasErrors = true;
      console.error('Form is invalid');
      return;
    } else {
      this.formHasErrors = false;
      this.loading = true;
    }

    const userUID = this.authService.currentUser!.uid;
    const shiftDate = this.addShiftForm.get('shiftDate')?.value;
    const startTime = this.addShiftForm.get('startTime')?.value;
    const endTime = this.addShiftForm.get('endTime')?.value;
    const wage = this.addShiftForm.get('wage')?.value;
    const workplace = this.addShiftForm.get('workplace')?.value;
    const comments = this.addShiftForm.get('comments')?.value;

    const startDateTime = new Date(`${shiftDate} ${startTime}`);
    const endDateTime = new Date(`${shiftDate} ${endTime}`);

    if (endDateTime < startDateTime) {
      endDateTime.setDate(endDateTime.getDate() + 1);
    }

    const durationInHours =
      (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
    const profit = 0.2 * wage * durationInHours;

    const shiftData: ShiftInterface = {
      userUID,
      date: shiftDate,
      startTime,
      endTime,
      wage,
      workplace,
      profit,
      comments,
    };

    this.shiftsService
      .addShift(shiftData)
      .then(() => {
        console.log('Shift added successfully');
        this.successMessage = true;
      })
      .catch((error) => {
        console.error('Erorr adding shift: ', error);
      })
      .finally(() => {
        setTimeout(() => {
          this.loading = false;
          this.addShiftForm.reset();
        }, 1000);
        setTimeout(() => {
          this.successMessage = false;
        }, 2000);
      });
  }
}
