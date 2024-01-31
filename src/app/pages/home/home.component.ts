import { Component, OnInit } from '@angular/core';
import { MostProfitableMonthService } from 'src/app/services/most-profitable-month/most-profitable-month.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  mostProfitableMonthInfo: { month: number; earnings: number } = {
    month: 0,
    earnings: 0,
  };

  constructor(private mostProfitableMonthService: MostProfitableMonthService) {}

  ngOnInit(): void {
    this.mostProfitableMonthService.getMostProfitableMonth().then(
      (result) => {
        this.mostProfitableMonthInfo = result;
      },
      (error) => console.error('Error getting most profitable month: ', error)
    );
  }
}
