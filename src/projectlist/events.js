getCompanyIdFromUrl()
getProjects("Details", () => {
  
  getSettings(() => {
    loadProjectList()

    const phaseData = getChartData("Phase", "S", projectDetails)

  
    // Type
    const typeData = getChartData("Type", "S", projectDetails)
    loadDoughnutChart("doughnut-type", typeData.keys, 'Project By Type', typeData.values, typeData.colours)
    
    // Status
  	let phaseKeys = []
    for (const key of phaseData.keys) {
    	phaseKeys.push(projectSettings[key])
    }
    loadDoughnutChart("doughnut-status", phaseKeys, 'Project By Status', phaseData.values, typeData.colours)

    //Cost by Phase and Project Type
    getProjects("Phase", () => {
      const investmentFields = projectPhases.filter(obj => {
        return obj.Project.S.endsWith('Investment')
      })
      const labels = [projectSettings[1], projectSettings[2], projectSettings[3], projectSettings[4], projectSettings[5]]
      let phaseCostData = {}
      console.log("HEY")
      console.log(investmentFields)
      for(const field of investmentFields){
        const projectId = field["Project"]["S"].split("#")[1]
        const projectPhase = field["Project"]["S"].split("#")[2]
        const projectType = getProjectDetail(projectId)["Type"]["S"]
        const phaseCost = parseInt(field["Complete"]["S"])
        if (projectType in phaseCostData) {
          let data = phaseCostData[projectType]['data']
          data[parseInt(projectPhase) - 1] += phaseCost
          phaseCostData[projectType]['data'] = data
        } else {
          let data = [0, 0, 0, 0, 0]
          data[parseInt(projectPhase) - 1] = phaseCost
          phaseCostData[projectType] = {
            'label': projectType,
            'data': data,
            'backgroundColor': generateColour(),
          }
        }
      }

      loadStackedBarChart("bar-cost-status", labels, "Project Spend By Phase", Object.values(phaseCostData))
    })
  })

  
  // Cost
  //const costData = getChartData("TotalCost", "S", projectDetails)
  //loadDoughnutChart("doughnut-size", costData.keys, 'Project By Size', costData.values)
})

var Webflow = Webflow || [];
Webflow.push(function() {
  
  // unbind webflow form handling
  $(document).off('submit');

  // new form handling
  $('form').submit(function(e) {
  	e.preventDefault();
  	const $form = $(this);
    const $submit = $('[type=submit]', $form); // Submit button of form
    const buttonText = $submit.val(); // Original button text
    const buttonWaitingText = $submit.attr('data-wait'); // Waiting button text value
    const formMethod = $form.attr('method'); // Form method (where it submits to)
    const formAction = $form.attr('action'); // Form action (GET/POST)
    const body = {
    	"ProjectId": `${uuidv4()}`,
      "Name": $('#ProjectName').val(),
      "Type": $('#ProjectType').val(),
      "Division": $('#ProjectDivision').val(),
      "Owner": $('#ProjectOwner').val(),
      "Phase": "1",
    }
    
    // Set waiting text
    if (buttonWaitingText) {
      $submit.val(buttonWaitingText); 
    }
    
    fetch(formAction + "/" +  localStorage.getItem('CompanyId'), {
      method: formMethod,
      headers: {
        'Content-Type': 'application/json',
        'Token':localStorage.getItem('Token'),
      },
      body: JSON.stringify(body)
    })
    .then(response => { 
    	$form
      	.hide() // optional hiding of form
    		.siblings('.w-form-done').show() // Show success
      	.siblings('.w-form-fail').hide(); // Hide failure
      getProjects("Details", () => {
        loadProjectList()
      })
    })
    .catch(e => { 
    	console.log(e)
    	$form
      	.siblings('.w-form-done').hide() // Hide success
    	  .siblings('.w-form-fail').show(); // show failure
    })
    .finally(() => {
	    $submit.val(buttonText);
    	//setTimeout(function() { location.reload(true); }, 1000);
    });
  });
});