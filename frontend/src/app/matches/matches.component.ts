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

  displayedColumns: any;
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private server: ServerService
  ) {
    this.dataSource = new MatTableDataSource();

    this.displayedColumns = ['year', 'team1_name', 'team2_name', 'venue_name', 'city_name', 'result'];
  }

  ngOnInit(): void {
    this.server.get('/match/match_list').subscribe(
      res => {
        this.dataSource.data = res;
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
