import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

  id: number = 0;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private server: ServerService
  ) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') ? parseInt(params.get('id') as string) : 0;
    });
  }

  ngOnInit(): void {
  }

}
