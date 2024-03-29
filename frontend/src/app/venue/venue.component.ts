import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss']
})
export class VenueComponent implements OnInit {

  loading: boolean;

  venue_id: number = 0;
  basic_info: any;
  win_info: any;
  first_inns: any;

  // Pie
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
    }
  };
  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie'> = { labels: [], datasets: [{ data: [] }] };

  // Line
  lineChartType: ChartType = 'line';
  lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Runs',
        fill: 'origin'
      }
    ],
    labels: []
  };
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: { line: { tension: 0.0 } }, // smoother fit
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private server: ServerService
  ) {
    this.route.paramMap.subscribe(params => {
      this.venue_id = params.get('venue_id') ? parseInt(params.get('venue_id') as string) : 0;
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.loading = true;

    this.basic_info = {
      venue_id: this.venue_id,
      venue_name: '',
      city_name: '',
      country_name: '',
      capacity: 0,
      highest_chased: 0,
      total_high: 0,
      total_low: 0,
      total_matches: 0
    };

    this.win_info = {
      bat: 0,
      bowl: 0,
      matches: 0,
      ties: 0
    };

    this.first_inns = {};
  }

  ngOnInit(): void {
    const apis = [
      this.basic_promise(),
      this.win_stat_promise(),
      this.first_inn_promise()
    ];
    Promise.all(apis).then(() => {
      this.loading = false;
    });
  }

  basic_promise(): Promise<unknown> {
    return new Promise((resolve: any) => {
      this.server.get('/venue/basic', { 'venue_id': this.venue_id }).subscribe(
        res => {
          if (res.length == 0) {
            this.router.navigateByUrl('venues');
          }
          this.basic_info = res[0];
          resolve();
        }
      );
    });
  }

  win_stat_promise(): Promise<unknown> {
    return new Promise((resolve: any) => {
      this.server.get('/venue/win_stat', { 'venue_id': this.venue_id }).subscribe(
        res => {
          this.win_info = res[0];
          var plabels = ["Team batting first won", "Team batting second won", "Matches drawn"]; // Object.keys(this.win_info);
          var pvalues = [this.win_info["bat"], this.win_info["bowl"], this.win_info["ties"]];
          this.pieChartData = {
            labels: plabels,
            datasets: [{
              data: pvalues
            }]
          };
          resolve();
        }
      );
    });
  }

  first_inn_promise(): Promise<unknown> {
    return new Promise((resolve: any) => {
      this.server.get('/venue/first_inn', { 'venue_id': this.venue_id }).subscribe(
        res => {
          res.forEach((data: any) => {
            this.first_inns[data.season_year] = data.avg_1st;
          });
          var keys = [2011, 2013, 2015, 2017];
          var lruns = keys.map(key => Number(this.first_inns[key] | 0));
          this.lineChartData.labels = keys;
          this.lineChartData.datasets[0].data = lruns;
          this.loading = true;
          resolve();
        }
      );
    });
  }

}
