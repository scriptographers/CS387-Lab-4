import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchesComponent } from './matches/matches.component';
import { MatchComponent } from './match/match.component';
import { PlayerComponent } from './player/player.component';
import { PtableComponent } from './ptable/ptable.component';
import { VenuesComponent } from './venues/venues.component';
import { VenueComponent } from './venue/venue.component';
import { VenueAddComponent } from './venue-add/venue-add.component';

// Specifies the route-component mapping
const routes: Routes = [
  { path: 'matches', component: MatchesComponent },
  { path: 'matches/:match_id', component: MatchComponent },
  { path: 'players/:player_id', component: PlayerComponent },
  { path: 'pointstable/:season_year', component: PtableComponent },
  { path: 'venues', component: VenuesComponent },
  { path: 'venue/:venue_id', component: VenueComponent },
  { path: 'venues/add', component: VenueAddComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
