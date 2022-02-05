import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit, AfterViewInit {

  matches: any;
  displayedColumns: any;
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private server: ServerService
  ) {
    this.matches = [];
    this.dataSource = new MatTableDataSource();

    this.displayedColumns = ['team1_name', 'team2_name', 'venue_name', 'city_name', 'result'];
  }

  ngOnInit(): void {
    this.server.get('/match/match_list').subscribe(
      res => {
        this.matches = res;
        this.dataSource.data = this.matches;
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openMatch(match: any) {
    let route = '/matches/' + match.match_id;
    this.router.navigate([route]);
  }

}
