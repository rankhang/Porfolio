import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AboutComponent } from './about/about.component';

import { ContactComponent } from './contact/contact.component';
import { ResumeComponent } from './resume/resume.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SocialMediaLinkComponent } from './social-media-link/social-media-link.component';
import { AddFriendComponent } from './contact/add-friend/add-friend.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule} from '@angular/fire/compat'
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import  {MatCurrencyFormatModule} from 'mat-currency-format';
import {ClipboardModule} from '@angular/cdk/clipboard';
//For AWS Amplify
// import { AWSLexV2Provider } from '@aws-amplify/interactions';
// import { Amplify, API, Interactions } from 'aws-amplify';


//For Firebase
import { environment } from 'src/environments/environment';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';

import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { providePerformance,getPerformance } from '@angular/fire/performance';
import { provideRemoteConfig,getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CryptoTradingGameComponent } from './apps-list/crypto-trading-game/crypto-trading-game.component';
import { SignUpComponent } from './apps-list/crypto-trading-game/sign-up/sign-up.component';
import { ErrorMessageModalComponent } from './error-message-modal/error-message-modal.component';
import { HomeGameComponent } from './apps-list/crypto-trading-game/home-game/home-game.component';
import { AuthService } from './auth.service';
import { AuthGuardCrytoCurrencyGame } from './crytoGame-auth-guard.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog'


import {ScrollingModule} from '@angular/cdk/scrolling';
import { CoinGraphComponent } from './apps-list/crypto-trading-game/coin-graph/coin-graph.component';
import {MatCardModule} from '@angular/material/card';
import { NgChartsModule } from 'ng2-charts';
import { GameNavbarComponent } from './apps-list/crypto-trading-game/game-navbar/game-navbar.component';
import { GameModeComponent } from './apps-list/crypto-trading-game/game-mode/game-mode.component';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { WalletComponent } from './apps-list/crypto-trading-game/home-game/wallet/wallet.component';
import { StoreComponent } from './apps-list/crypto-trading-game/home-game/store/store.component';
import { BuyCoinModalComponent } from './apps-list/crypto-trading-game/home-game/trade-coin-modal/trade-coin-modal.component';
import { ReviewOrderModalComponent } from './apps-list/crypto-trading-game/home-game/trade-coin-modal/review-order-modal/review-order-modal.component';
import { PriceComponent } from './apps-list/crypto-trading-game/price/price.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectSearchModule } from 'mat-select-search';
import { ExchangeWalletComponent } from './apps-list/crypto-trading-game/home-game/exchange-wallet/exchange-wallet.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { AddFundModalComponent } from './apps-list/crypto-trading-game/add-fund-modal/add-fund-modal.component';
import { NgToastModule } from 'ng-angular-popup';
import { TooltipModule } from 'ng2-tooltip-directive';
import { GameSettingComponent } from './apps-list/crypto-trading-game/home-game/game-setting/game-setting.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { MulticolorAnimationBackgroundComponent } from './multicolor-animation-background/multicolor-animation-background.component';
import { AppsListComponent } from './apps-list/apps-list.component';

import { KatbookComponent } from './apps-list/katbook/katbook.component';
import { UserProfilePageComponent } from './apps-list/katbook/user-profile-page/profile-page.component';
import { AuthGuardKatbook } from './katbook-auth-guard.service';
import { KatBookHomepageComponent } from './apps-list/katbook/homepage/homepage.component';
import { CreateNewPostModalComponent } from './apps-list/katbook/user-profile-page/create-new-post-modal/create-new-post-modal.component';





// Amplify.configure({
//     Auth: {
//       identityPoolId: 'us-east-1:1802f116-0fe5-4f11-a25a-aeadd031641f',
//       region: 'us-east-1'
//     },
//     Interactions: {
//       bots: {
//         "ScheduleAppointment_dev": {
//           "name": "ScheduleAppointment_dev",
//           "alias": "$LATEST",
//           "region": "us-east-1",
//         },
        
//       }
//     }
//   });


//   Amplify.addPluggable(new AWSLexV2Provider());

// const interactionsConfig = {
//     Auth: {
//         identityPoolId: 'us-east-1:1802f116-0fe5-4f11-a25a-aeadd031641f',
//         region: 'us-east-1'
//     },
//     Interactions: {
//         bots: {
//             // LexV2 Bot
//             "ScheduleAppointment_dev": {
//                 name: "ScheduleAppointment_dev",
//                 aliasId: "TSTALIASID",
//                 botId: "7AAHGJPOGD",
//                 localeId: "en_US",
//                 region: "us-east-1",
//                 providerName: "AWSLexV2Provider",
//             },
//         }
//     }
// }

// Amplify.configure(interactionsConfig);






@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    AboutComponent,
    ContactComponent,
    ResumeComponent,
    HomepageComponent,
    SocialMediaLinkComponent,
    AddFriendComponent,
    FriendsListComponent,
    PageNotFoundComponent,
    CryptoTradingGameComponent,
    SignUpComponent,
    ErrorMessageModalComponent,
    HomeGameComponent,
    CoinGraphComponent,
    GameNavbarComponent,
    GameModeComponent,
    WalletComponent,
    StoreComponent,
    BuyCoinModalComponent,
    ReviewOrderModalComponent,
    PriceComponent,
    ExchangeWalletComponent,
    LoadingScreenComponent,
    AddFundModalComponent,
    GameSettingComponent,
    ChatbotComponent,
    MulticolorAnimationBackgroundComponent,
    AppsListComponent,
    KatbookComponent,
    UserProfilePageComponent,
    KatBookHomepageComponent,
    CreateNewPostModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
   AngularFireDatabaseModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
    ScrollingModule,
    MatToolbarModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatCardModule,
    NgChartsModule,
    MdbRangeModule,
    MatButtonToggleModule,
    MatDialogModule,
    Ng2SearchPipeModule,
    MatSelectModule,
    MatCardModule,
    MatSelectSearchModule,
    MatCurrencyFormatModule,
    ClipboardModule,
    NgToastModule,
    TooltipModule
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService, 
    AuthService,
    AuthGuardCrytoCurrencyGame,
    AuthGuardKatbook
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
