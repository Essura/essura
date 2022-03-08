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
        title: {
          display: true,
          text: title
        }
      }
    });
  }