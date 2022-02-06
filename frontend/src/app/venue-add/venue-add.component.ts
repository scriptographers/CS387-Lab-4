import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-venue-add',
  templateUrl: './venue-add.component.html',
  styleUrls: ['./venue-add.component.scss']
})
export class VenueAddComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private server: ServerService,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      capacity: [0, Validators.required],
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.server.post('/venue/add', this.form.value).subscribe(
      res => {
        this.router.navigateByUrl('venues');
      },
      error => {
        this.router.navigateByUrl('venues');
      }
    )

  }
}
