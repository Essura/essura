const settingsAPI = "https://v2b4e2vp17.execute-api.ap-southeast-2.amazonaws.com/prod/"

async function getProjectSettings(companyId){
	return await fetch(settingsAPI + companyId + "/project", {
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
        alert("Issue loading projects settings. Please contact support")
    })
  }