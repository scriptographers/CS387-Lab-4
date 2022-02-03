import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchesComponent } from './matches/matches.component';
import { MatchComponent } from './match/match.component';
import { PtableComponent } from './ptable/ptable.component';

// Specifies the route-component mapping
const routes: Routes = [
  { path: 'matches', component: MatchesComponent },
  { path: 'matches/:match_id', component: MatchComponent },
  { path: 'pointstable/:season_year', component: PtableComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
