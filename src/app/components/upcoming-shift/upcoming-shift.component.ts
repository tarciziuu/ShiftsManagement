import { Component, OnInit } from '@angular/core';
import { ShiftInterface } from 'src/app/interfaces/shift-interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ShiftsService } from 'src/app/services/shifts/shifts.service';

@Component({
  selector: 'app-upcoming-shift',
  templateUrl: './upcoming-shift.component.html',
  styleUrls: ['./upcoming-shift.component.css'],
})
export class UpcomingShiftComponent implements OnInit {
  upcomingShift: ShiftInterface | null = null;

  constructor(
    private authService: AuthService,
    private shiftsService: ShiftsService
  ) {}

  ngOnInit(): void {
    const userUID = this.authService.currentUser?.uid;
    if (userUID) {
      this.shiftsService.getUpcomingShift(userUID).then((shift) => {
        this.upcomingShift = shift;
      });
    }
  }
}
