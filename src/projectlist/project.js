const projectUrl = "https://waxbn648pk.execute-api.ap-southeast-2.amazonaws.com/prod/"
const companyId = localStorage.getItem('CompanyId')
let projectDetails = []
let projectPhases = []
let projectSettings = []

function getProjects(type, callback) {
	const params = {
  	"type": type,
  }
  let projectEndpoint = new URL(projectUrl + companyId)
	projectEndpoint.search = new URLSearchParams(params).toString();
	fetch(projectEndpoint, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Token':localStorage.getItem('Token'),
      },
    })
    .then(response => response.json())
  	.then(data => {
    	console.log(type)
      console.log(data["Items"])
    	if(type == "Details"){
      	projectDetails = data["Items"]
      } else {
      	projectPhases = data["Items"]
      }
      callback();
    })
    .catch(e => { 
    	console.log(e)
      alert("Issue loading projects. Please contact support")
    })
}

function getSettings(callback){
	fetch(settingsAPI + companyId + "/project", {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Token':localStorage.getItem('Token'),
    },
  })
  .then(response => response.json())
  .then(data => {
  	const settings = data["Items"].find(obj => {return obj.Setting.S === 'Project#Phase'})["PhaseNames"]["M"]
    projectSettings = {1: settings["One"]["S"], 2: settings["Two"]["S"], 3: settings["Three"]["S"], 4: settings["Four"]["S"], 5: settings["Five"]["S"]}
    callback()
  })
  .catch(e => { 
    console.log(e)
    alert("Issue loading this project's settings. Please try again later")
  })
}

function loadProjectList() {
	if(projectDetails.length > 0) {
    const emptyProject = document.getElementById('emptyProjectCard')
    emptyProject.style.display = "none";
    const cardProjectHeader = document.getElementById('projectCardHeader')
    cardProjectHeader.style.display = "block";
  }
  const projectsContainer = document.getElementById("projectsContainer")
  for (item of projectDetails) {
    // For each restaurant, create a div called card and style with the "Sample Card" class
    const style = document.getElementById('templateProjectCard')
    // Copy the card and it's style
    const card = style.cloneNode(true)
    const projectId = item.Project.S.split("#")[1];
    card.setAttribute('id', projectId);
    card.style.display = 'block';

    // When a restuarant card is clicked, navigate to the item page by passing the restaurant id
    card.addEventListener('click', function() {
      document.location.href = "/project?id=" +  projectId;
    });

    // Set Values for card
    const projectName = card.querySelector("[data-id='projectName']");
    const division = card.querySelector("[data-id='division']");
    const phase = card.querySelector("[data-id='phase']");
    const status = card.querySelector("[data-id='status']");
    const rag = card.querySelector("[data-id='rag']");
    projectName.textContent = item.Name.S;
    division.textContent = item.Division.S;
    phase.textContent = "1"
    status.textContent = "2"
    rag.textContent = "Green"

    projectsContainer.appendChild(card);
  }
}

function getProjectDetail(id) {
	return projectDetails.find(obj => {
  	return obj.Project.S === `Details#${id}`
	})
}

function getChartData(field, fieldType) {
    const dataset = projectDetails.map(project => project[field][fieldType]);
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
          maintainAspectRatio: false,
        title: {
          display: true,
          text: title
        }
      }
    });
  }