import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  loading: boolean;

  match_id: number = 0;
  first: any;
  second: any;
  info: any;

  displayedColumnsBat: any;
  displayedColumnsBowl: any;
  displayedColumnsTop3Bat: any;
  displayedColumnsTop3Bowl: any;

  // Pie
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    }
  };
  pieChartType: ChartType = 'pie';
  pieChartData1: ChartData<'pie'> = { labels: [], datasets: [{ data: [] }] };
  pieChartData2: ChartData<'pie'> = { labels: [], datasets: [{ data: [] }] };

  // Line
  lineChartType: ChartType = 'line';
  lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: { line: { tension: 0.2 } }, // smoother fit
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private server: ServerService
  ) {
    this.route.paramMap.subscribe(params => {
      this.match_id = params.get('match_id') ? parseInt(params.get('match_id') as string) : 0;
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.loading = true;

    this.first = {
      batting: [],
      bowling: [],
      extras: [],
      overs_breakup: [],
      top3_bat: [],
      top3_bowl: [],
      runs_breakup: []
    };
    this.second = {
      batting: [],
      bowling: [],
      extras: [],
      overs_breakup: [],
      top3_bat: [],
      top3_bowl: [],
      runs_breakup: []
    };
    this.info = {
      basic: [],
      players1: [],
      players2: [],
      umpires: [],
    }

    this.displayedColumnsBat = ['batsman', 'runs', 'fours', 'sixes', 'balls_faced'];
    this.displayedColumnsBowl = ['bowler', 'balls', 'runs', 'wickets'];
    this.displayedColumnsTop3Bat = ['batsman', 'runs', 'balls'];
    this.displayedColumnsTop3Bowl = ['bowler', 'wickets', 'runs_given'];
  }

  ngOnInit(): void {
    const apis = [
      this.match_info_promise(),
      this.match_umpires_promise(),
      this.innings_bat_promise(1, this.first),
      this.innings_bowl_promise(1, this.first),
      this.innings_extras_promise(1, this.first),
      this.innings_overs_breakup_promise(1, this.first),
      this.innings_top3_bat_promise(1, this.first),
      this.innings_top3_bowl_promise(1, this.first),
      this.innings_runs_breakup_promise(1, this.first),
      this.innings_bat_promise(2, this.second),
      this.innings_bowl_promise(2, this.second),
      this.innings_extras_promise(2, this.second),
      this.innings_overs_breakup_promise(2, this.second),
      this.innings_top3_bat_promise(2, this.second),
      this.innings_top3_bowl_promise(2, this.second),
      this.innings_runs_breakup_promise(2, this.second)
    ];
    Promise.all(apis).then(() => {
      this.other_info()

      const apis2 = [
        this.match_players_team1_promise(),
        this.match_players_team2_promise()
      ];
      Promise.all(apis2).then(() => {
        this.loading = false;
      });
    });
  }

  other_info(): void {
    if (this.info.basic.toss_winner_id == this.info.basic.team1_id) {
      this.info.basic.toss_winner_name = this.info.basic.team1_name;
      if (this.info.basic.toss_name === 'bat') {
        this.info.basic.bat_first = this.info.basic.team1_name;
        this.info.basic.bowl_first = this.info.basic.team2_name;
      } else {
        this.info.basic.bat_first = this.info.basic.team2_name;
        this.info.basic.bowl_first = this.info.basic.team1_name;
      }
    } else {
      this.info.basic.toss_winner_name = this.info.basic.team2_name;
      if (this.info.basic.toss_name === 'bat') {
        this.info.basic.bat_first = this.info.basic.team2_name;
        this.info.basic.bowl_first = this.info.basic.team1_name;
      } else {
        this.info.basic.bat_first = this.info.basic.team1_name;
        this.info.basic.bowl_first = this.info.basic.team2_name;
      }
    }

    if (this.info.basic.winner_id == this.info.basic.team1_id) {
      this.info.basic.winner_name = this.info.basic.team1_name;
    } else {
      this.info.basic.winner_name = this.info.basic.team2_name;
    }
  }

  match_info_promise(): Promise<unknown> {
    return new Promise((resolve: any) => {
      this.server.get('/match/info', { 'match_id': this.match_id }).subscribe(
        res => {
          this.info.basic = res[0];
          resolve();
        }
      );
    });
  }

  match_umpires_promise(): Promise<unknown> {
    return new Promise((resolve: any) => {
      this.server.get('/match/umpires', { 'match_id': this.match_id }).subscribe(
        res => {
          this.info.umpires = res;
          resolve();
        }
      );
    });
  }

  match_players_team1_promise(): Promise<unknown> {
    return new Promise((resolve: any) => {
      this.server.get('/match/players', { 'match_id': this.match_id, 'team_id': this.info.basic.team1_id }).subscribe(
        res => {
          this.info.players1 = res;
          resolve();
        }
      );
    });
  }

  match_players_team2_promise(): Promise<unknown> {
    return new Promise((resolve: any) => {
      this.server.get('/match/players', { 'match_id': this.match_id, 'team_id': this.info.basic.team2_id }).subscribe(
        res => {
          this.info.players2 = res;
          resolve();
        }
      );
    });
  }

  innings_bat_promise(inn_no: number, data: any): Promise<unknown> {
    return new Promise((resolve: any) => {
      this.server.get('/innings/bat', { 'match_id': this.match_id, 'innings_no': inn_no }).subscribe(
        res => {
          data.batting = res;
          resolve();
        }
      );
    });
  }

  innings_bowl_promise(inn_no: number, data: any): Promise<unknown> {
    return new Promise((resolve: any) => {
      this.server.get('/innings/bowl', { 'match_id': this.match_id, 'innings_no': inn_no }).subscribe(
        res => {
          data.bowling = res;
          resolve();
        }
      );
    });
  }

  innings_extras_promise(inn_no: number, data: any): Promise<unknown> {
    return new Promise((resolve: any) => {
      this.server.get('/innings/extras', { 'match_id': this.match_id, 'innings_no': inn_no }).subscribe(
        res => {
          data.extras = res[0];
          resolve();
        }
      );
    });
  }

  innings_overs_breakup_promise(inn_no: number, data: any): Promise<unknown> {
    return new Promise((resolve: any) => {
      this.server.get('/innings/overs_breakup', { 'match_id': this.match_id, 'innings_no': inn_no }).subscribe(
        res => {
          data.overs_breakup = res;
          var llabels = Object.keys(data.overs_breakup);
          var lruns = llabels.map(key => data.overs_breakup[key].runs);
          var lwickets = llabels.map(key => data.overs_breakup[key].wickets);
          lruns = lruns.map((sum => value => sum += Number(value))(0));
          lwickets = lwickets.map(val => Boolean(Number(val)));
          llabels = llabels.map(key => (Number(key) + 1).toString());
          this.lineChartData.datasets.push({
            data: lruns,
            label: `Innings ${inn_no}`,
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: lwickets.map(val => val ? 'rgba(100,0,0,1)' : 'rgba(0,0,0,0)'),
            pointBorderColor: lwickets.map(val => val ? 'rgba(100,0,0,1)' : 'rgba(0,0,0,0)'),
            pointHoverBackgroundColor: 'rgba(140,150,170,0.5)',
            pointHoverBorderColor: 'rgba(140,150,170,1)',
            fill: 'origin',
          });
          if (!this.lineChartData.labels) {
            var ltemp = 0;
          } else {
            var ltemp = this.lineChartData.labels.length;
          }
          if (ltemp < llabels.length) {
            this.lineChartData.labels = llabels;
          }
          resolve();
        }
      );
    });
  }

  innings_top3_bat_promise(inn_no: number, data: any): Promise<unknown> {
    return new Promise((resolve: any) => {
      this.server.get('/innings/top3_bat', { 'match_id': this.match_id, 'innings_no': inn_no }).subscribe(
        res => {
          data.top3_bat = res;
          resolve();
        }
      );
    });
  }

  innings_top3_bowl_promise(inn_no: number, data: any): Promise<unknown> {
    return new Promise((resolve: any) => {
      this.server.get('/innings/top3_bowl', { 'match_id': this.match_id, 'innings_no': inn_no }).subscribe(
        res => {
          data.top3_bowl = res;
          resolve();
        }
      );
    });
  }

  innings_runs_breakup_promise(inn_no: number, data: any): Promise<unknown> {
    return new Promise((resolve: any) => {
      this.server.get('/innings/runs_breakup', { 'match_id': this.match_id, 'innings_no': inn_no }).subscribe(
        res => {
          data.runs_breakup = res[0];
          var plabels = Object.keys(data.runs_breakup);
          var pvalues = plabels.map(key => data.runs_breakup[key]);
          if (inn_no == 1)
            this.pieChartData1 = {
              labels: plabels,
              datasets: [{
                data: pvalues
              }]
            };
          else
            this.pieChartData2 = {
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

}
