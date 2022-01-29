import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchesComponent } from './matches/matches.component';

// Specifies the route-component mapping
const routes: Routes = [
  { path: 'matches', component: MatchesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
