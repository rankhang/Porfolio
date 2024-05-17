import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import {  AuthGuardCrytoCurrencyGame } from './crytoGame-auth-guard.service';
import { ContactComponent } from './contact/contact.component';
import { CryptoTradingGameComponent } from './apps-list/crypto-trading-game/crypto-trading-game.component';
import { GameModeComponent } from './apps-list/crypto-trading-game/game-mode/game-mode.component';
import { HomeGameComponent } from './apps-list/crypto-trading-game/home-game/home-game.component';
import { SignUpComponent } from './apps-list/crypto-trading-game/sign-up/sign-up.component';
import { FriendsListComponent } from './friends-list/friends-list.component';

import { HomepageComponent } from './homepage/homepage.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ResumeComponent } from './resume/resume.component';
import { AppsListComponent } from './apps-list/apps-list.component';
import { KatbookComponent } from './apps-list/katbook/katbook.component';
import { KatBookHomepageComponent } from './apps-list/katbook/homepage/homepage.component';
import { UserProfilePageComponent } from './apps-list/katbook/user-profile-page/profile-page.component';
import { AuthGuardKatbook } from './katbook-auth-guard.service';




const routes: Routes = [
  {path: '', component: AboutComponent},
  {path: 'home', component: HomepageComponent},
  {path: 'about', component: AboutComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'resume', component: ResumeComponent},
  {path: 'friends-list', component: FriendsListComponent},
  {path: 'appsList', component: AppsListComponent},
  {path: 'appsList/cryptoCurrencyGame', component: CryptoTradingGameComponent},
  {path: 'appsList/cryptoCurrencyGame/sign-up', component: SignUpComponent},
  {path: 'appsList/cryptoCurrencyGame/home',canActivate:[AuthGuardCrytoCurrencyGame], component: HomeGameComponent}, //, 
  {path: 'appsList/cryptoCurrencyGame/game-mode', component: GameModeComponent},
  {path: 'appsList/katbook/sign-in', component: KatbookComponent},
  {path: 'appsList/katbook/home',canActivate:[AuthGuardKatbook], component: KatBookHomepageComponent},
  {path: 'appsList/katbook/profile/:id', component: UserProfilePageComponent},
  
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
