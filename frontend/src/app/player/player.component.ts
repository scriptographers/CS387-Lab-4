import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';

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

  ngOnInit(): void {
    this.server.get('/player/player_info', { 'player_id': this.player_id }).subscribe(
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
        console.log(this.bat_per_match);
      }
    );

    this.server.get('/player/bowl_per_match', { 'player_id': this.player_id }).subscribe(
      res => {
        this.bowl_per_match = res;
        console.log(this.bowl_per_match);
      }
    );
  }

}
