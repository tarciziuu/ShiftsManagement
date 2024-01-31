import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ShiftInterface } from 'src/app/interfaces/shift-interface';
import { ShiftsService } from 'src/app/services/shifts/shifts.service';

@Component({
  selector: 'app-edit-shift',
  templateUrl: './edit-shift.component.html',
  styleUrls: ['./edit-shift.component.css'],
})
export class EditShiftComponent implements OnInit {
  editShiftForm: FormGroup;
  shiftId: string = '';
  loading: boolean = false;
  successMessage: boolean = false;
  formHasErrors: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private shiftsService: ShiftsService
  ) {
    this.editShiftForm = this.fb.group({
      shiftId: [{ value: '', disabled: true }],
      date: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      wage: ['', [Validators.required]],
      workplace: ['', [Validators.required]],
      comments: [''],
    });
  }
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.shiftId = params.get('id') ?? '';
      this.populateFormWithShiftInfo();
    });
  }
  populateFormWithShiftInfo() {
    this.shiftsService.getShiftById(this.shiftId).then((shift) => {
      this.editShiftForm.patchValue({
        shiftId: this.shiftId,
        date: shift?.date,
        startTime: shift?.startTime,
        endTime: shift?.endTime,
        wage: shift?.wage,
        workplace: shift?.workplace,
        comments: shift?.comments,
      });
    });
  }
  onSubmit() {
    if (this.editShiftForm.valid) {
      this.loading = true;
      this.formHasErrors = false;

      const updatedShift = this.editShiftForm.value;

      this.shiftsService.updateShift(this.shiftId, updatedShift).then(() => {
        this.successMessage = true;

        setTimeout(() => {
          this.loading = false;
          this.successMessage = false;
        }, 2000);
      });
    } else {
      this.formHasErrors = true;
    }
  }
}
