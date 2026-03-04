import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
// import { MarketDataService } from '../../../core/services/market-data.service'
import { MarketDataService } from '../../../../core/services/market-data.service'
// import { Coin } from '../../../shared/models/coin.model'
import { Coin } from '../../../../shared/models/coin.model';
@Component({
  selector: 'app-market-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-dashboard.component.html',
  styleUrl: './market-dashboard.component.scss'
})
export class MarketDashboardComponent implements OnInit {

  coins: Coin[] = []
  loading = false
  error = false

  constructor(private marketService: MarketDataService) {}

  ngOnInit(): void {
    this.loadMarket()
  }

  loadMarket() {

    this.loading = true

    this.marketService.getTopCoins().subscribe({
      next: (data) => {
        this.coins = data
        this.loading = false
      },
      error: () => {
        this.error = true
        this.loading = false
      }
    })
  }

}
