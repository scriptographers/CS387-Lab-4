import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../server.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.scss']
})
export class VenuesComponent implements OnInit, AfterViewInit {

  displayedColumns: any;
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private server: ServerService
  ) {
    this.dataSource = new MatTableDataSource();
    this.displayedColumns = ['name'];
  }

  ngOnInit(): void {
    this.server.get('/venue/list').subscribe(
      res => {
        this.dataSource.data = res;
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openVenue(venue: any) {
    let route = '/venue/' + venue.venue_id;
    this.router.navigate([route]);
  }

}
