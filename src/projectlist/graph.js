const chartHeight = 377;

function getChartData(field, fieldType, data) {
  const dataset = data.map(project => project[field][fieldType]);
  const occurences = dataset.reduce(function(obj, item) {
    obj[item] = (obj[item] || 0) + 1;
    return obj;
  }, {});
  let colours = []
  for (const occurence of Object.values(occurences)) {
      colours.push(generateColour())
  }
  
  return {
      keys: Object.keys(occurences),
    values: Object.values(occurences),
    colours: colours,
  }
}

function loadDoughnutChart(id, labels, title, data, colours) {
    new Chart(document.getElementById(id), {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [
        {
          label: "Count",
          backgroundColor: colours,
          data: data
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: title
      }
    }
  });
  document.getElementById(id).height = chartHeight;
}

function loadStackedBarChart(id, labels, title, data) {
  new Chart(document.getElementById(id), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: data
    },
    options: {
      title: {
        display: true,
        text: title
      },
      responsive: true,
      scales: {
        xAxes: [{
            stacked: true
        }],
        yAxes: [{
            stacked: true
        }]
      }
    }
  })
  document.getElementById(id).height = chartHeight;
}