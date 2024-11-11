// Function to fetch and parse CSV data
async function fetchCSVData() {
  const response = await fetch("data/results.csv"); // Fetch the CSV file
  const data = await response.text(); // Get the raw text

  const lines = data.trim().split("\n"); // Split into lines

  const metrics = [];
  const utHarData = [];
  const originalFrameworkData = [];

  // Iterate over each line after the header
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((col) => col.trim());
    metrics.push(cols[0]); // Metric name
    utHarData.push(parseFloat(cols[1])); // UT-HAR value
    originalFrameworkData.push(parseFloat(cols[2])); // Original Framework value
  }

  return { metrics, utHarData, originalFrameworkData };
}

// Function to create the chart
async function createChart() {
  const { metrics, utHarData, originalFrameworkData } = await fetchCSVData(); // Fetch data

  const ctx = document.getElementById("performanceChart").getContext("2d");

  const performanceChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: metrics, // X-axis labels from CSV
      datasets: [
        {
          label: "UT-HAR",
          data: utHarData,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          borderRadius: 10, // Rounded corners
        },
        {
          label: "Original Framework",
          data: originalFrameworkData,
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          borderRadius: 10, // Rounded corners
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true, // Preserve aspect ratio
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: {
              size: 14,
            },
          },
        },
        title: {
          display: false,
          text: "Mean Performance Metrics Comparison",
        },
        tooltip: {
          backgroundColor: "#fff",
          titleColor: "#333",
          bodyColor: "#333",
          borderColor: "#ddd",
          borderWidth: 1,
          padding: 10,
          borderRadius: 6,
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y + "%";
              }
              return label;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function (value) {
              return value + "%";
            },
            font: {
              size: 12,
            },
          },
          grid: {
            color: "#e0e0e0",
            borderDash: [5, 5], // Dashed grid lines
          },
          title: {
            display: true,
            text: "Mean Performance (%)",
            font: {
              size: 14,
            },
          },
        },
        x: {
          ticks: {
            font: {
              size: 12,
            },
          },
          grid: {
            display: false,
          },
        },
      },
      animation: {
        duration: 1000,
        easing: "easeOutQuart",
      },
    },
  });
}

// Initialize the chart after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", createChart);
