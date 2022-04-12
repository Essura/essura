const projectAPI = "https://waxbn648pk.execute-api.ap-southeast-2.amazonaws.com/prod/"

async function getProject(projectId) {
	const params = {
        "type": "Details",
    }
    let projectEndpoint = new URL(projectAPI + companyId + "/" + projectId)
	projectEndpoint.search = new URLSearchParams(params).toString();
	return await fetch(projectEndpoint, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Token':localStorage.getItem('Token'),
      },
    })
    .then(response => response.json())
  	.then(data => {
        return data["Items"][0]
    })
    .catch(e => { 
    	console.log(e)
        alert("Issue loading projects. Please contact support")
    })
}

async function getProjectPhases(companyId, projectId) {
    const params = {
      "type": "Phase",
  }
  let projectEndpoint = new URL(projectAPI + companyId + "/" + projectId)
  projectEndpoint.search = new URLSearchParams(params).toString();

  let data = await fetch(projectEndpoint, {
      method: "GET",
        headers: {
        'Content-Type': 'application/json',
        'Token':localStorage.getItem('Token'),
        },
    })
  .then(response => {
       return response.json().then((data) => {
              if("Items" in data) return data["Items"];
              else return [];
       });
  })
  .catch(e => { 
        console.log(e)
        alert("Issue loading this project. Please try again later")
  })
  console.log(data)
  return data
}