import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {

  matches: any;
  page: number = 1;
  page_size: number = 10;
  offset: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private server: ServerService
  ) {
    this.route.queryParamMap.subscribe(params => {
      this.page = params.get('page') ? parseInt(params.get('page') as string) : 1;
      this.page_size = params.get('size') ? parseInt(params.get('size') as string) : 10;
      this.offset = (this.page - 1) * this.page_size;
    });
    console.log(this.page, this.page_size);

    this.matches = [];
  }

  ngOnInit(): void {
    this.server.get('/match/match_list', { 'size': this.page_size, 'offset': this.offset }).subscribe(
      res => {
        this.matches = res;
        console.log(this.matches);
      }
    );
  }

}
