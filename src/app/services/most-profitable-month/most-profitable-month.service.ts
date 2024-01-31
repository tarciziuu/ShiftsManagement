import { Injectable } from '@angular/core';
import { ShiftsService } from '../shifts/shifts.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class MostProfitableMonthService {
  constructor(
    private shiftsService: ShiftsService,
    private authService: AuthService
  ) {}

  async getMostProfitableMonth(): Promise<{ month: number; earnings: number }> {
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear}-01-01`;
    const endDate = `${currentYear}-12-31`;

    try {
      const userUID = this.authService.currentUser?.uid;

      if (userUID) {
        const shifts = await this.shiftsService.getShiftsByUser(
          userUID,
          '-',
          startDate,
          endDate
        );

        const earningsByMonth: Record<number, number> = {};

        shifts.forEach((shiftData) => {
          const earnings = shiftData['profit'] || 0;
          const shiftDate = new Date(shiftData['date']);
          const month = shiftDate.getMonth() + 1;

          if (earningsByMonth[month]) {
            earningsByMonth[month] += earnings;
          } else {
            earningsByMonth[month] = earnings;
          }
        });

        // Find the month with the highest total earnings
        let mostProfitableMonth: number = 1;
        let highestTotalEarnings: number = 0;

        Object.entries(earningsByMonth).forEach(([month, totalEarnings]) => {
          if (totalEarnings > highestTotalEarnings) {
            highestTotalEarnings = totalEarnings;
            mostProfitableMonth = Number(month);
          }
        });

        return { month: mostProfitableMonth, earnings: highestTotalEarnings };
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      console.error('Error getting most profitable month:', error);
      return { month: 1, earnings: 0 };
    }
  }
}
