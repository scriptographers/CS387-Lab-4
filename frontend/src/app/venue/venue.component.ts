import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss']
})
export class VenueComponent implements OnInit {

  venue_id: number = 0;
  basic_info: any;
  win_info: any;
  first_inns: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private server: ServerService
  ) {
    this.route.paramMap.subscribe(params => {
      this.venue_id = params.get('venue_id') ? parseInt(params.get('venue_id') as string) : 0;
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

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

    this.first_inns = [];
  }

  ngOnInit(): void {
    this.server.get('/venue/venue_basic', { 'venue_id': this.venue_id }).subscribe(
      res => {
        this.basic_info = res[0];
        console.log(this.basic_info);
      }
    );

    this.server.get('/venue/venue_win', { 'venue_id': this.venue_id }).subscribe(
      res => {
        this.win_info = res[0];
        console.log(this.win_info);
      }
    );

    this.server.get('/venue/first_inn', { 'venue_id': this.venue_id }).subscribe(
      res => {
        this.first_inns = res;
        console.log(this.first_inns);
      }
    );
  }

}
