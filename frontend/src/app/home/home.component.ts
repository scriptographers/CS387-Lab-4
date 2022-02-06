import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dataSource: any;
  displayedColumns: any;

  constructor() {
    this.dataSource = new MatTableDataSource();
    this.displayedColumns = ['route', 'desc', 'section'];
  }

  ngOnInit(): void {
    this.dataSource.data = [
      {
        'route': '/',
        'desc': 'Brings to the Home page',
        'section': 'NA'
      },
      {
        'route': '/matches',
        'desc': 'List all matches',
        'section': 'B1'
      },
      {
        'route': '/matches/:match_id',
        'desc': 'Display statistics of a match',
        'section': 'B2, B3, B4'
      },
      {
        'route': '/players/:player_id',
        'desc': 'Display statistics of a player',
        'section': 'C'
      },
      {
        'route': '/pointstable/:season_year',
        'desc': 'Display Points Table for a year',
        'section': 'D'
      },
      {
        'route': '/venues',
        'desc': 'List all venues',
        'section': 'E1'
      },
      {
        'route': '/venue/:venue_id',
        'desc': 'Display statistics of a venue',
        'section': 'E2'
      },
      {
        'route': '/venues/add',
        'desc': 'Display form to add new venue',
        'section': 'F2'
      }
    ];
  }

}
