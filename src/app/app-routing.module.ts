import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth-guard.service';
import { ContactComponent } from './contact/contact.component';
import { CryptoTradingGameComponent } from './crypto-trading-game/crypto-trading-game.component';
import { GameModeComponent } from './crypto-trading-game/game-mode/game-mode.component';
import { HomeGameComponent } from './crypto-trading-game/home-game/home-game.component';
import { SignUpComponent } from './crypto-trading-game/sign-up/sign-up.component';
import { FriendsListComponent } from './friends-list/friends-list.component';

import { HomepageComponent } from './homepage/homepage.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ResumeComponent } from './resume/resume.component';
import { AppsListComponent } from './apps-list/apps-list.component';


const routes: Routes = [
  {path: '', component: AboutComponent},
  {path: 'home', component: HomepageComponent},
  {path: 'about', component: AboutComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'resume', component: ResumeComponent},
  {path: 'friends-list', component: FriendsListComponent},
  {path: 'game', component: CryptoTradingGameComponent},
  {path: 'game/sign-up', component: SignUpComponent},
  {path: 'game/home',canActivate:[AuthGuard], component: HomeGameComponent}, //, 
  {path: 'game/game-mode', component: GameModeComponent},
  {path: 'appsList', component: AppsListComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
