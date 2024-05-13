import { AfterContentChecked, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import {default as Annotation} from 'chartjs-plugin-annotation';
import { Auth, User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { BaseChartDirective } from 'ng2-charts';
import { Subject } from 'rxjs';
import { Coins } from 'src/app/models/coins.model';


import { OwnedWallet } from 'src/app/models/ownedWallet.model';
import { TransactionModel } from 'src/app/models/transaction.model';
import { HomeGameComponent } from '../home-game/home-game.component';
import { BuyCoinModalComponent } from '../home-game/trade-coin-modal/trade-coin-modal.component';

@Component({
  selector: 'app-coin-graph',
  templateUrl: './coin-graph.component.html',
  styleUrls: ['./coin-graph.component.css']
})
export class CoinGraphComponent implements OnInit {

  @Input() selectedCoinIndex: number = 0;
  @Input() coin: Coins  = new Coins("",0) ;
  @Input() test: number = 0;
  @Input() coins: Coins[] = [];
  @Input() ownedWallet: OwnedWallet[] = [];
  @Input() accountBalance: number = 0;
  @Input() month!: number;
  @Input() year!: number;
  @Input() day!: number;

  @Input() db! :Firestore;
  @Input() auth!:Auth 
  @Input() user!:User|null 



  @Input() chosenChart = HomeGameComponent.WEEK_CHART;

  @ViewChild('tradeButtonToggle', { static: true }) tradeButtonToggle!: ElementRef;
  // @Input() last7DaysDayMonthString: string[] = ["","","","","","",""];
  // @Input() last24HoursString: string[] = ["","","","","","","","","","","","","","","","","","","","","","","",""];



  @Input() label :string[] = new Array(7);

  

  constructor() { 
    
    Chart.register(Annotation);

  }
  

  ngOnInit(): void {
  }


  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data:  this.coin.valueLast365Days,
        label: this.coin.name,
        backgroundColor: 'rgba(245, 230, 24,0.3)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
      // ,
      // {
      //   data: [ 28, 48, 40, 19, 86, 27, 90 ],
      //   label: 'Series B',
      //   backgroundColor: 'rgba(77,83,96,0.2)',
      //   borderColor: 'rgba(77,83,96,1)',
      //   pointBackgroundColor: 'rgba(77,83,96,1)',
      //   pointBorderColor: '#fff',
      //   pointHoverBackgroundColor: '#fff',
      //   pointHoverBorderColor: 'rgba(77,83,96,1)',
      //   fill: 'origin',
      // },
      // {
      //   data: [ 180, 480, 770, 90, 1000, 270, 400 ],
      //   label: 'Series C',
      //   yAxisID: 'y-axis-1',
      //   backgroundColor: 'rgba(255,0,0,0.3)',
      //   borderColor: 'red',
      //   pointBackgroundColor: 'rgba(148,159,177,1)',
      //   pointBorderColor: '#fff',
      //   pointHoverBackgroundColor: '#fff',
      //   pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      //   fill: 'origin',
      // }
    ],
    labels: this.label
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    
    elements: {
      line: {
        tension: 0.5
      }
    },
    // scales: {
    //   // We use this empty structure as a placeholder for dynamic theming.
    //   x: {},
    //   'y-axis-0':
    //     {
    //       position: 'left',
    //     },
    //   'y-axis-1': {
    //     position: 'right',
    //     grid: {
    //       color: 'rgba(255,0,0,0.3)',
    //     },
    //     ticks: {
    //       color: 'red'
    //     }
    //   }
    // },

    plugins: {
      legend: { display: true }
      // annotation: {
      //   annotations: [
      //     {
      //       type: 'line',
      //       scaleID: 'x',
      //       value: 'March',
      //       borderColor: 'orange',
      //       borderWidth: 2,
      //       label: {
      //         position: 'center',
      //         enabled: true,
      //         color: 'orange',
      //         content: 'LineAnno',
      //         font: {
      //           weight: 'bold'
      //         }
      //       }
      //     },
      //   ],
      // }
    }
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

   private static generateNumber(i: number): number {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }

  public randomize(): void {
    for (let i = 0; i < this.lineChartData.datasets.length; i++) {
      for (let j = 0; j < this.lineChartData.datasets[i].data.length; j++) {
        this.lineChartData.datasets[i].data[j] = CoinGraphComponent.generateNumber(i);
      }
    }
    this.chart?.update();
  }

  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public hideOne(): void {
    const isHidden = this.chart?.isDatasetHidden(1);
    this.chart?.hideDataset(1, !isHidden);
  }

  public pushOne(): void {
    this.lineChartData.datasets.forEach((x, i) => {
      const num = CoinGraphComponent.generateNumber(i);
      x.data.push(num);
    });
    this.lineChartData?.labels?.push(`Label ${ this.lineChartData.labels.length }`);

    this.chart?.update();
  }

  public changeColor(): void {
    this.lineChartData.datasets[2].borderColor = 'red';
    this.lineChartData.datasets[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;

    this.chart?.update();
  }

  public changeLabel(newLabel : string): void {
      this.lineChartData.datasets[0].label = newLabel;
    this.chart?.update();
  }


  //toggle trade button from exchange when user hit on a coin in market
  onTradeButtonTogge(){
    this.tradeButtonToggle.nativeElement.click();
  }
  
}


