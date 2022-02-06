import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  player_id: number = 0;
  basic_info: any;
  bat_stat: any;
  bowl_stat: any;
  bat_per_match: any;
  bowl_per_match: any;
  loading_bat = false;
  loading_bowl = false;

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    }
  };
  barChartType: ChartType = 'bar';
  barChartDataBat: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {data: [], label: 'Runs', backgroundColor: []},
    ]
  };
  barChartDataBowl: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {data: [], label: 'Runs Conceded'},
      {data: [], label: 'Wickets'},
    ]
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private server: ServerService
  ) {
    this.route.paramMap.subscribe(params => {
      this.player_id = params.get('player_id') ? parseInt(params.get('player_id') as string) : 0;
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.basic_info = {
      player_name: '',
      country_name: '',
      batting_hand: '',
      bowling_skill: ''
    };

    this.bat_stat = {
      total_matches: 0,
      total_runs: 0,
      total_balls: 0,
      fours: 0,
      sixes: 0,
      total_out: 0,
      fifties: 0,
      hundreds: 0,
      hs: 0,
      strike_rate: 0.0,
      average: 0.0
    };
    this.bowl_stat = {
      total_matches: 0,
      total_runs: 0,
      total_wickets: 0,
      total_overs: 0,
      total_balls: 0,
      five_wickets: 0,
      economy: 0.0
    };

    this.bat_per_match = [];
    this.bowl_per_match = [];
  }

  run2color(runs: any): string{
    runs = Number(runs);
    console.log(runs);
    if (runs <= 30)
      return 'rgba(255, 0, 0, 0.5)';
    else if (runs > 30 && runs <= 50)
      return 'rgba(255, 255, 0, 0.5)';
    else if (runs > 50)
      return 'rgba(0, 255, 0, 0.5)';
    else
      return "gray";
  }

  ngOnInit(): void {
    this.server.get('/player/info', { 'player_id': this.player_id }).subscribe(
      res => {
        this.basic_info = res[0];
        console.log(this.basic_info);
      }
    );

    this.server.get('/player/bat_stat', { 'player_id': this.player_id }).subscribe(
      res => {
        this.bat_stat = res[0];
        console.log(this.bat_stat);
      }
    );

    this.server.get('/player/bowl_stat', { 'player_id': this.player_id }).subscribe(
      res => {
        this.bowl_stat = res[0];
        console.log(this.bowl_stat);
      }
    );

    this.server.get('/player/bat_per_match', { 'player_id': this.player_id }).subscribe(
      res => {
        this.bat_per_match = res;
        var keys = Object.keys(res);
        var llabels = keys.map(key => res[key].match_id);
        var lruns = keys.map(key => res[key].runs_per_match);
        var lcols = lruns.map(key => this.run2color(key));
        this.barChartDataBat.datasets[0].data = lruns;
        this.barChartDataBat.datasets[0].backgroundColor = lcols;
        this.barChartDataBat.labels = llabels;
        this.loading_bat = true;
        console.log(this.bat_per_match);
      }
    );

    this.server.get('/player/bowl_per_match', { 'player_id': this.player_id }).subscribe(
      res => {
        this.bowl_per_match = res;
        var keys = Object.keys(res);
        var llabels = keys.map(key => res[key].match_id);
        var lruns = keys.map(key => res[key].runs_per_match);
        var lwkts = keys.map(key => res[key].wickets_per_match);
        this.barChartDataBowl.datasets[0].data = lruns;
        this.barChartDataBowl.datasets[1].data = lwkts;
        this.barChartDataBowl.labels = llabels;
        this.loading_bowl = true;
        console.log(this.bowl_per_match);
      }
    );
  }

}
