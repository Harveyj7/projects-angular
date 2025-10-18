import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  Legend,
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
  Legend,
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
  imports: [BaseChartDirective],
  templateUrl: './balance.html',
  styleUrls: ['./balance.scss'],
})
export class Balance implements OnInit {
  balanceData: BalanceData[] = [];
  loading = true;
  error: string | null = null;
  public chartPlugins = [DataLabelsPlugin];
  public chartType = 'line' as const;
  public chartAriaLabel =
    'Balance Chart showing cumulative values by month with 320,000 threshold';

  public chartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Cumulative Balance',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
    ],
  };

  public chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
        ticks: {
          callback: (value: string | number, index: number): string => {
            const label = this.chartData.labels?.[index];
            if (typeof label === 'string') {
              return this.formatDateLabel(label);
            }
            return String(label || value);
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cumulative Value (£)',
        },
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat('en-GB', {
              style: 'currency',
              currency: 'GBP',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value as number);
          },
        },
      },
    },

    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.dataset.label === 'Threshold (£320,000)') {
              return `${context.dataset.label}`;
            }
            return `${context.dataset.label}: ${this.formatCurrency(context.parsed.y)}`;
          },
        },
      },
      datalabels: {
        display: false,
      },
    },
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBalanceData();
  }

  private loadBalanceData(): void {
    const apiUrl =
      'https://script.google.com/macros/s/AKfycbwVQDzmMgGEZrzg-hd8sp8B9wtOPRjuYhBoE5ZSaCICiR2EQ3fd9M2LAaU5Z-EMQVOl/exec';

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
      },
    });
  }

  private updateChartData(): void {
    const thresholdValue1 = 200000;
    const thresholdValue2 = 320000;

    const thresholdData1 = new Array(this.balanceData.length).fill(
      thresholdValue1,
    );
    const thresholdData2 = new Array(this.balanceData.length).fill(
      thresholdValue2,
    );

    this.chartData = {
      labels: this.balanceData.map((item) => item.Month),
      datasets: [
        {
          label: 'Cumulative Balance',
          data: this.balanceData.map((item) => item.Cumulative),
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1,
        },
        {
          label: 'Threshold (200,000)',
          data: thresholdData1,
          borderColor: 'blue',
          backgroundColor: 'blue',
          borderWidth: 2,
          borderDash: [10, 5],
          pointRadius: 0,
          fill: false,
          tension: 0,
        },
        {
          label: 'Threshold (£320,000)',
          data: thresholdData2,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          borderWidth: 2,
          borderDash: [10, 5],
          pointRadius: 0,
          fill: false,
          tension: 0,
        },
      ],
    };
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(value);
  }

  formatDateLabel(dateString: string): string {
    try {
      // Parse the ISO date string directly
      const date = new Date(dateString);

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return dateString;
      }

      const monthNames = [
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'jul',
        'aug',
        'sep',
        'oct',
        'nov',
        'dec',
      ];

      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      return `${month}-${year}`;
    } catch (error) {
      // If parsing fails, return the original string
      return dateString;
    }
  }
}
