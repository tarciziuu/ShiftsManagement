import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShiftInterface } from 'src/app/interfaces/shift-interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ShiftsService } from 'src/app/services/shifts/shifts.service';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css'],
})
export class ShiftsComponent implements OnInit {
  shifts: ShiftInterface[] = [];
  selectedWorkplace: string = '-';
  selectedFromDate: string = '';
  selectedToDate: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private shiftsService: ShiftsService
  ) {}

  ngOnInit() {
    const userUID = this.authService.currentUser?.uid;

    if (userUID) {
      this.loadShifts(userUID);
    }
  }

  applyFilters() {
    const userUID = this.authService.currentUser?.uid;

    if (userUID) {
      const workplace =
        this.selectedWorkplace === 'All' ? '' : this.selectedWorkplace;
      const fromDate = this.selectedFromDate || '';
      const toDate = this.selectedToDate || '';

      console.log('fromDate: ', fromDate);
      console.log('toDate: ', toDate);

      this.loadShifts(userUID, workplace, fromDate, toDate);
    }
  }

  loadShifts(
    userUID: string,
    workplace: string = '',
    fromDate: string = '',
    toDate: string = ''
  ) {
    this.shiftsService
      .getShiftsByUser(userUID, workplace, fromDate, toDate)
      .then((shifts) => {
        this.shifts = shifts;
      });
  }

  edit(shift: ShiftInterface): void {
    if (shift && shift.id) {
      this.router.navigate(['/edit-shift', shift.id]);
      console.log('Editing shift with ID:', shift.id);
    } else {
      console.error('Invalid shift ID: ', shift.id);
    }
  }
}
