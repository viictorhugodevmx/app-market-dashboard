import { Component, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { interval, Subscription } from 'rxjs'
import { FormsModule } from '@angular/forms'

// import { MarketDataService } from '../../../core/services/market-data.service'
import { MarketDataService } from '../../../../core/services/market-data.service'
import { WatchlistService } from '../../../../core/services/watchlist.service'
// import { Coin } from '../../../shared/models/coin.model'
import { Coin } from '../../../../shared/models/coin.model';
import { SparklineComponent } from '../../../../shared/ui/sparkline/sparkline.component';
import { PriceAlertService } from '../../../../core/services/price-alert.service'
@Component({
  selector: 'app-market-dashboard',
  standalone: true,
  imports: [CommonModule, SparklineComponent, FormsModule],
  templateUrl: './market-dashboard.component.html',
  styleUrl: './market-dashboard.component.scss'
})
export class MarketDashboardComponent implements OnInit, OnDestroy {

  coins: Coin[] = []
  filteredCoins: Coin[] = []
  searchTerm: string = ''
  topGainers: Coin[] = []
  topLosers: Coin[] = []
  sortColumn: string = 'market_cap_rank'
  sortDirection: 'asc' | 'desc' = 'asc'
  loading = false
  error = false
  isDarkMode: boolean = false

  lastUpdated: Date | null = null

  private refreshSub?: Subscription

constructor(
  private marketService: MarketDataService,
  private watchlistService: WatchlistService,
  private alertService: PriceAlertService
) {}

  ngOnInit(): void {

    this.loadMarket()

    this.refreshSub = interval(10000).subscribe(() => {
      this.loadMarket()
    })

  }

  loadMarket() {

    this.loading = true

    this.marketService.getTopCoins().subscribe({

      next: (data) => {
        this.coins = data
        this.filteredCoins = data
        this.applySorting()
        this.calculateMarketMovers()
        this.checkAlerts()
        this.lastUpdated = new Date()
        this.loading = false
      },

      error: () => {
        this.error = true
        this.loading = false
      }

    })

  }

  checkAlerts() {

    const alerts = this.alertService.getAlerts()

    alerts.forEach(rule => {

      const coin = this.coins.find(c => c.symbol === rule.symbol)

      if (!coin) return

      if (rule.type === 'above' && coin.current_price >= rule.price) {
        window.alert(`${coin.symbol.toUpperCase()} reached ${rule.price}`)
      }

      if (rule.type === 'below' && coin.current_price <= rule.price) {
        window.alert(`${coin.symbol.toUpperCase()} dropped below ${rule.price}`)
      }

    })

  }

  sortBy(column: string) {

    if (this.sortColumn === column) {

      this.sortDirection =
        this.sortDirection === 'asc' ? 'desc' : 'asc'

    } else {

      this.sortColumn = column
      this.sortDirection = 'asc'

    }

    this.applySorting()

  }

  applySorting() {

    const direction = this.sortDirection === 'asc' ? 1 : -1

    this.coins.sort((a: any, b: any) => {

      if (a[this.sortColumn] > b[this.sortColumn]) return direction
      if (a[this.sortColumn] < b[this.sortColumn]) return -direction

      return 0

    })

  }

  toggleWatchlist(symbol: string) {

    this.watchlistService.toggle(symbol)

  }

  isFavorite(symbol: string): boolean {

    return this.watchlistService.isInWatchlist(symbol)

  }

  calculateMarketMovers() {

    const sorted = [...this.coins].sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    )

    this.topGainers = sorted.slice(0, 3)

    this.topLosers = [...sorted].reverse().slice(0, 3)

  }

  filterCoins() {

    const term = this.searchTerm.toLowerCase()

    this.filteredCoins = this.coins.filter(coin =>
      coin.name.toLowerCase().includes(term) ||
      coin.symbol.toLowerCase().includes(term)
    )

  }

  toggleDarkMode() {

    this.isDarkMode = !this.isDarkMode

  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe()
  }

}
