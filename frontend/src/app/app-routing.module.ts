import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchesComponent } from './matches/matches.component';
import { MatchComponent } from './match/match.component';

// Specifies the route-component mapping
const routes: Routes = [
  { path: 'matches', component: MatchesComponent },
  { path: 'matches/:match_id', component: MatchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
