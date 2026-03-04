import { Injectable } from '@angular/core'
import { PriceAlert } from '../../shared/models/price-alert.model'

@Injectable({
  providedIn: 'root'
})
export class PriceAlertService {

  private key = 'fintech-alerts'

  getAlerts(): PriceAlert[] {

    const data = localStorage.getItem(this.key)

    return data ? JSON.parse(data) : []

  }

  addAlert(alert: PriceAlert) {

    const alerts = this.getAlerts()

    alerts.push(alert)

    localStorage.setItem(this.key, JSON.stringify(alerts))

  }

}
