import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  private key = 'fintech-watchlist'

  getWatchlist(): string[] {

    const data = localStorage.getItem(this.key)

    return data ? JSON.parse(data) : []

  }

  toggle(symbol: string) {

    const list = this.getWatchlist()

    if (list.includes(symbol)) {

      const updated = list.filter(s => s !== symbol)

      localStorage.setItem(this.key, JSON.stringify(updated))

    } else {

      list.push(symbol)

      localStorage.setItem(this.key, JSON.stringify(list))

    }

  }

  isInWatchlist(symbol: string): boolean {

    return this.getWatchlist().includes(symbol)

  }

}
