import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Coin } from '../../shared/models/coin.model'
import { API_CONFIG } from '../config/api.config'

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {

  constructor(private http: HttpClient) {}

  getTopCoins(): Observable<Coin[]> {

    const url = `${API_CONFIG.COINGECKO_BASE}/coins/markets`

    return this.http.get<Coin[]>(url, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: '20',
        page: '1',
        sparkline: 'true'
      }
    })
  }
}
