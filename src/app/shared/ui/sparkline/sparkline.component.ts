import { Component, Input, AfterViewInit, ElementRef } from '@angular/core'
import { Chart } from 'chart.js/auto'

@Component({
  selector: 'app-sparkline',
  standalone: true,
  template: `<canvas></canvas>`,
})
export class SparklineComponent implements AfterViewInit {

  @Input() data: number[] = []

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {

    const canvas = this.el.nativeElement.querySelector('canvas')

    new Chart(canvas, {

      type: 'line',

      data: {
        labels: this.data.map(() => ''),
        datasets: [{
          data: this.data,
          borderColor: '#2962ff',
          borderWidth: 2,
          pointRadius: 0
        }]
      },

      options: {
        responsive: false,
        plugins: { legend: { display: false }},
        scales: {
          x: { display: false },
          y: { display: false }
        }
      }

    })

  }

}
