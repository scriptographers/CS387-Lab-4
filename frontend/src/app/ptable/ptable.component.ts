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
  data: any;
  ptable: any;

  displayedColumns: any;
  loading: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private server: ServerService
  ) {
    this.route.paramMap.subscribe(params => {
      this.season_year = params.get('season_year') ? parseInt(params.get('season_year') as string) : 0;
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.teams = [];
    this.data = {};
    this.ptable = [];
    this.loading = true;

    this.displayedColumns = ['team', 'mat', 'won', 'lost', 'tied', 'pts', 'nrr'];
  }

  ngOnInit(): void {
    this.server.get('/ptable/list').subscribe(
      res => {
        this.teams = res;
        this.load_data();
      }
    );
  }

  load_data(): void {
    const apis: any = [];
    this.teams.forEach(
      (team: any) => {
        this.data[team.team_id] = {
          'name': team.team_name,
          'matches': 0,
          'wins': 0,
          'losses': 0,
          'ties': 0,
          'points': 0,
          'nrr': 0
        };
        apis.push(this.gen_points_promise(team.team_id));
        apis.push(this.gen_nrr_promise(team.team_id));
      });

    Promise.all(apis).then(() => {
      console.log(this.data);
      this.finalize()
      this.loading = false;
    });
  }

  gen_points_promise(team_id: number): Promise<unknown> {
    return new Promise((resolve: any) => {
      this.server.get('/ptable/points', { 'season_year': this.season_year, 'team_id': team_id }).subscribe(
        res => {
          this.data[team_id]['matches'] = res[0].matches;
          this.data[team_id]['wins'] = res[0].wins;
          this.data[team_id]['losses'] = res[0].losses;
          this.data[team_id]['ties'] = res[0].ties;
          this.data[team_id]['points'] = res[0].points;
          resolve();
        }
      );
    });
  }

  gen_nrr_promise(team_id: number): Promise<unknown> {
    return new Promise((resolve: any) => {
      this.server.get('/ptable/nrr', { 'season_year': this.season_year, 'team_id': team_id }).subscribe(
        res => {
          this.data[team_id]['nrr'] = res[0].nrr;
          resolve();
        }
      );
    });
  }

  finalize(): void {
    this.teams.forEach(
      (team: any) => {
        if (this.data[team.team_id]['matches'] != 0) {
          this.ptable.push(this.data[team.team_id]);
        }
      }
    );
    this.ptable.sort((a: any, b: any) => {
      if (a.points > b.points) {
        return -1;
      } else if (a.points < b.points) {
        return 1;
      } else {
        if (a.nrr > b.nrr) {
          return -1;
        } else if (a.nrr < b.nrr) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  }

}
