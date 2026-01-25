import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const DailyRevenueChart = ({ data: chartData }) => {
  // Ensure we have valid data
  const labels = chartData?.labels || ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const values = chartData?.data || [15420, 18950, 22340, 18450];

  const data = {
    labels: labels,
    datasets: [{
      label: 'Revenue (₹)',
      data: values,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 5
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            return `Revenue: ₹${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)'
        },
        ticks: {
          callback: function (value) {
            return '₹' + value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return <Line data={data} options={options} />;
};

export const ZoneRevenueChart = ({ data: chartData }) => {
  // Ensure we have valid data
  const labels = chartData?.labels || ['Zone A', 'Zone B', 'Zone C', 'Zone D'];
  const values = chartData?.data || [45230, 32180, 18940, 12650];

  const data = {
    labels: labels,
    datasets: [{
      label: 'Revenue (₹)',
      data: values,
      backgroundColor: [
        'rgba(220, 38, 38, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(5, 150, 105, 0.8)',
        'rgba(16, 185, 129, 0.8)'
      ],
      borderColor: [
        '#dc2626',
        '#f59e0b',
        '#059669',
        '#10b981'
      ],
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ₹${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)'
        },
        ticks: {
          callback: function (value) {
            return '₹' + value.toLocaleString();
          }
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export const PaymentMethodsChart = ({ data: chartData }) => {
  // Ensure we have valid data
  const labels = chartData?.labels || [];
  const values = chartData?.data || [];

  const data = {
    labels: labels,
    datasets: [{
      data: values,
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#ef4444'
      ],
      borderWidth: 2,
      hoverOffset: 4
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed.toLocaleString()}`;
          }
        }
      }
    }
  };

  return <Doughnut data={data} options={options} />;
};

export const OccupancyTrendsChart = ({ data: chartData }) => {
  // Ensure we have valid data
  const labels = chartData?.labels || ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];
  const values = chartData?.data || [15, 85, 92, 65, 78, 45];

  const data = {
    labels: labels,
    datasets: [{
      label: 'Occupancy (%)',
      data: values,
      borderColor: '#7c3aed',
      backgroundColor: 'rgba(124, 58, 237, 0.2)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#7c3aed',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 5
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            return `Occupancy: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0,0,0,0.1)'
        },
        ticks: {
          callback: function (value) {
            return value + '%';
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return <Line data={data} options={options} />;
};