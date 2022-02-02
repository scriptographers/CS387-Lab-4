import { ViewChild, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  match_id: number = 0;
  first: any;
  second: any;
  match_info: any;
  displayedColumnsBat: any;
  displayedColumnsBowl: any;
  displayedColumnsTop3Bat: any;
  displayedColumnsTop3Bowl: any;
  show_summary: boolean;
  show_sc: boolean;

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
  pieChartData: ChartData<'pie'>  = {labels: [], datasets: [ { data: [] } ] };

  // Line

  lineChartType: ChartType = 'line';

  lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Innings 1',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      {
        data: [],
        label: 'Innings 2',
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
        fill: 'origin',
      }
    ],
    labels: []
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {line: {tension: 0.2}}, // smoother fit
    scales: {}
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private server: ServerService
  ) {
    this.route.paramMap.subscribe(params => {
      this.match_id = params.get('match_id') ? parseInt(params.get('match_id') as string) : 0;
    });

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

    this.match_info = {
      basic: [],
      players1: [],
      players2: [],
      umpires: [],
    }

    this.displayedColumnsBat = ['batsman', 'runs', 'fours', 'sixes', 'balls_faced'];
    this.displayedColumnsBowl = ['bowler', 'balls', 'runs', 'wickets'];
    this.displayedColumnsTop3Bat = ['batsman', 'runs', 'balls'];
    this.displayedColumnsTop3Bowl = ['bowler', 'wickets', 'runs_given'];

    this.show_summary = false;
    this.show_sc = false;    

  }

  showSummary(){
    this.show_summary = !this.show_summary;
  }

  showSC(){
    this.show_sc = !this.show_sc;
  }

  ngOnInit(): void {
    this.server.get('/match/match_info', { 'match_id': this.match_id }).subscribe(
      res => {
        this.match_info.basic = res[0];
        this.fill_team_info();
      }
    );

    this.server.get('/match/match_umpires', { 'match_id': this.match_id }).subscribe(
      res => {
        this.match_info.umpires = res;
      }
    );

    this.load_innings(1, this.first);
    this.load_innings(2, this.second); 

  }

  load_innings(inn_no: number, data: any): void {
    this.server.get('/innings/batting', { 'match_id': this.match_id, 'innings_id': inn_no }).subscribe(
      res => {
        data.batting = res;
      }
    );

    this.server.get('/innings/bowling', { 'match_id': this.match_id, 'innings_id': inn_no }).subscribe(
      res => {
        data.bowling = res;
      }
    );

    this.server.get('/innings/extras', { 'match_id': this.match_id, 'innings_id': inn_no }).subscribe(
      res => {
        data.extras = res[0];
      }
    );

    this.server.get('/innings/overs_breakup', { 'match_id': this.match_id, 'innings_id': inn_no }).subscribe(
      res => {
        data.overs_breakup = res;
        var llabels = Object.keys(data.overs_breakup);
        var lruns = llabels.map(key => data.overs_breakup[key].runs);
        llabels = llabels.map(key => (Number(key) + 1).toString());
        this.lineChartData.datasets[inn_no-1].data = lruns;
        if (!this.lineChartData.labels){
          var ltemp = 0;
        }
        else{
          var ltemp = this.lineChartData.labels.length;
        }
        if (ltemp < llabels.length){
          this.lineChartData.labels = llabels;
        }
      }
    );

    this.server.get('/innings/top3_bat', { 'match_id': this.match_id, 'innings_id': inn_no }).subscribe(
      res => {
        data.top3_bat = res;
      }
    );

    this.server.get('/innings/top3_bowl', { 'match_id': this.match_id, 'innings_id': inn_no }).subscribe(
      res => {
        data.top3_bowl = res;
      }
    );

    this.server.get('/innings/runs_breakup', { 'match_id': this.match_id, 'innings_id': inn_no }).subscribe(
      res => {
        data.runs_breakup = res[0];
        var plabels = Object.keys(data.runs_breakup);
        var pvalues = plabels.map(key => data.runs_breakup[key]);
        this.pieChartData = {
          labels: plabels,
          datasets: [ {
            data: pvalues
          } ]
        };
      }
    );
  }

  fill_team_info(): void {
    this.server.get('/match/match_players', { 'match_id': this.match_id, 'team_id': this.match_info.basic.team1_id }).subscribe(
      res => {
        this.match_info.players1 = res;
      }
    );

    this.server.get('/match/match_players', { 'match_id': this.match_id, 'team_id': this.match_info.basic.team2_id }).subscribe(
      res => {
        this.match_info.players2 = res;
      }
    );

    if (this.match_info.basic.toss_winner_id == this.match_info.basic.team1_id) {
      this.match_info.basic.toss_winner_name = this.match_info.basic.team1_name;
      if (this.match_info.basic.toss_name === 'bat') {
        this.match_info.basic.bat_first = this.match_info.basic.team1_name;
        this.match_info.basic.bowl_first = this.match_info.basic.team2_name;
      } else {
        this.match_info.basic.bat_first = this.match_info.basic.team2_name;
        this.match_info.basic.bowl_first = this.match_info.basic.team1_name;
      }
    } else {
      this.match_info.basic.toss_winner_name = this.match_info.basic.team2_name;
      if (this.match_info.basic.toss_name === 'bat') {
        this.match_info.basic.bat_first = this.match_info.basic.team2_name;
        this.match_info.basic.bowl_first = this.match_info.basic.team1_name;
      } else {
        this.match_info.basic.bat_first = this.match_info.basic.team1_name;
        this.match_info.basic.bowl_first = this.match_info.basic.team2_name;
      }
    }

    if (this.match_info.basic.winner_id == this.match_info.basic.team1_id) {
      this.match_info.basic.winner_name = this.match_info.basic.team1_name;
    } else {
      this.match_info.basic.winner_name = this.match_info.basic.team2_name;
    }

    console.log(this.match_info);
    console.log(this.first);
    console.log(this.second);
  }

}
