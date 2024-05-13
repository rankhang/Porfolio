import { AfterContentChecked, AfterViewChecked, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { collection } from 'firebase/firestore';
import { Coins } from 'src/app/models/coins.model';
import { HomeGameComponent } from '../home-game/home-game.component';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit{
  @Input() selectedCoin!: Coins;
  @Input() chosenChart!:string;
  math = Math ;
  @Input() fontSize = "large";
  @Input() arrowFontSize = "small"

  @Input() oldestValue!: number;// value to compare
  @Input() latestValue!: number;// value to compare

  constructor() { }

    




  ngOnInit(): void {
  }

}
