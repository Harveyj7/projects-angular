import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

// Import and register Chart.js components
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the required components including line components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface BalanceData {
  Month: string;
  Payment: number;
  Cumulative: number;
}

interface ApiResponse {
  data: BalanceData[];
}

@Component({
  selector: 'app-balance',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './balance.html',
  styleUrls: ['./balance.scss']
})
export class Balance implements OnInit {
  balanceData: BalanceData[] = [];
  loading = true;
  error: string | null = null;
  public chartPlugins = [DataLabelsPlugin];
  public chartType = 'bar' as const;
  public chartAriaLabel = 'Balance Chart showing cumulative values by month with 320,000 threshold';

  public chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Cumulative Balance',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  public chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Cumulative Value (£)'
        },
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat('en-GB', {
              style: 'currency',
              currency: 'GBP',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(value as number);
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.dataset.label === 'Threshold (£320,000)') {
              return `${context.dataset.label}`;
            }
            return `${context.dataset.label}: ${this.formatCurrency(context.parsed.y)}`;
          }
        }
      },
      datalabels: {
        display: false
      }
    }
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadBalanceData();
  }

  private loadBalanceData(): void {
    const apiUrl = 'https://script.google.com/macros/s/AKfycbwVQDzmMgGEZrzg-hd8sp8B9wtOPRjuYhBoE5ZSaCICiR2EQ3fd9M2LAaU5Z-EMQVOl/exec';

    this.http.get<ApiResponse>(apiUrl).subscribe({
      next: (response) => {
        this.balanceData = response.data;
        this.updateChartData();
        this.loading = false;
        console.log('Balance Data:', this.balanceData);
      },
      error: (error) => {
        console.error('Error loading balance data:', error);
        this.error = 'Failed to load balance data. Please try again later.';
        this.loading = false;
      }
    });
  }

  private updateChartData(): void {
    const thresholdValue = 320000;
    const thresholdData = new Array(this.balanceData.length).fill(thresholdValue);

    this.chartData = {
      labels: this.balanceData.map(item => item.Month),
      datasets: [
        {
          label: 'Cumulative Balance',
          data: this.balanceData.map(item => item.Cumulative),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          type: 'bar'
        },
        {
          label: 'Threshold (£320,000)',
          data: thresholdData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          borderWidth: 2,
          borderDash: [10, 5],
          pointRadius: 0,
          fill: false,
          type: 'line'
        } as any  // Use 'as any' to bypass TypeScript strict typing for mixed charts
      ]
    };
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(value);
  }
}
