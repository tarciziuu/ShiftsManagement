import { Component, OnInit } from '@angular/core';
import { ShiftInterface } from 'src/app/interfaces/shift-interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ShiftsService } from 'src/app/services/shifts/shifts.service';

@Component({
  selector: 'app-past-shifts',
  templateUrl: './past-shifts.component.html',
  styleUrls: ['./past-shifts.component.css'],
})
export class PastShiftsComponent implements OnInit {
  pastShifts: ShiftInterface[] = [];
  last7Days: Date[] = [];

  constructor(
    private shiftsService: ShiftsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.last7Days = this.generateLast7Days();

    const userUID = this.authService.currentUser?.uid;
    if (userUID) {
      this.shiftsService
        .getPastShifts(userUID, this.last7Days)
        .then((shifts) => {
          this.pastShifts = shifts;
        });
    }
  }

  hasShiftOnDay(day: Date): boolean {
    return this.pastShifts.some((shift) =>
      this.isSameDay(new Date(shift.date), day)
    );
  }
  getWorkplaceForDay(day: Date): string {
    const shift = this.pastShifts.find((s) =>
      this.isSameDay(new Date(s.date), day)
    );
    return shift ? shift.workplace : '';
  }

  getStartTimeForDay(day: Date): string {
    const shift = this.pastShifts.find((s) =>
      this.isSameDay(new Date(s.date), day)
    );
    return shift ? shift.startTime : '';
  }

  getEndTimeForDay(day: Date): string {
    const shift = this.pastShifts.find((s) =>
      this.isSameDay(new Date(s.date), day)
    );
    return shift ? shift.endTime : '';
  }

  private generateLast7Days(): Date[] {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      return day;
    });
    return last7Days;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
