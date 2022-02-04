import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-ptable',
  templateUrl: './ptable.component.html',
  styleUrls: ['./ptable.component.scss']
})
export class PtableComponent implements OnInit {

  season_year: number = 0;
  teams: any;
  ptable: any;
  displayedColumns: any;
  loading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private server: ServerService
  ) {
    this.route.paramMap.subscribe(params => {
      this.season_year = params.get('season_year') ? parseInt(params.get('season_year') as string) : 0;
    });

    this.teams = [];
    this.ptable = [[]];

    this.displayedColumns = ['team', 'mat', 'won', 'lost', 'tied', 'pts', 'nrr'];

  }

  ngOnInit(): void {
    this.server.get('/ptable/team_list').subscribe(
      res => {
        this.teams = res;
        this.load_table();
      }
    );
  }

  load_table(): void {
    this.teams.forEach(
      (team: any) => {
        this.ptable[team.team_id] = {
          'name': team.team_name,
          'matches': -1,
          'wins': -1,
          'losses': -1,
          'ties': -1,
          'points': -1,
          'nrr': -1
        };
        this.server.get('/ptable/points', { 'season_year': this.season_year, 'team_id': team.team_id }).subscribe(
          res => {
            this.ptable[team.team_id]['matches'] = res[0].matches;
            this.ptable[team.team_id]['wins'] = res[0].wins;
            this.ptable[team.team_id]['losses'] = res[0].losses;
            this.ptable[team.team_id]['ties'] = res[0].ties;
            this.ptable[team.team_id]['points'] = res[0].points;
          }
        );
        this.server.get('/ptable/nrr', { 'season_year': this.season_year, 'team_id': team.team_id }).subscribe(
          res => {
            this.ptable[team.team_id]['nrr'] = res[0].nrr;
          }
        );
      });
    // this.ptable.splice(0, 1);
    console.log(this.ptable);
    this.loading = false;
  }

}
