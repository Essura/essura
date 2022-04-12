let phases = []
getProjectPhases(companyId, projectId).then(data => {phases=data})
if(!projectId) window.location.replace("https://essura.webflow.io/projectlists");

function getFieldValue(phase, field) {
	return phases.find(obj => {
  	return obj.Project.S === `Phase#${projectId}#${phase}#${field}`
	})
}

function getFieldIndex(phase, field) {
	return phases.findIndex(obj => obj.Project.S === `Phase#${projectId}#${phase}#${field}`)
}

function setButtonActions(field) {
	$('.field.' + field).find(".status").each(function(i, element) {
  	const phase = $(element).parents().eq(6).data("phase");
    element.addEventListener("click", () => {
      sessionStorage.setItem('field', field);
      sessionStorage.setItem('phase', phase);
      console.log(phases)
      $("#Model").show()
      if(field === "investment") {
      	$(".investmentform").show()
      	const phaseValues = getFieldValue(phase, "Investment")
        if(phaseValues) {
        	$("#PrevCurrentGate").text(phaseValues.CurrentGate.S);
          $("#PrevGate").text(phaseValues.Gate.S);
          $("#PrevComplete").text(phaseValues.Complete.S);
          $("#PrevContingency").text(phaseValues.Contingency.S);
          $("#PrevETC").text(phaseValues.ETC.S);
        } else {
        	$("#PrevCurrentGate").text("N/A");
          $("#PrevGate").text("N/A");
          $("#PrevComplete").text("N/A");
          $("#PrevContingency").text("N/A");
          $("#PrevETC").text("N/A");
        }
      } else if(field === "time"){
      	$(".timeform").show();
        const phaseValues = getFieldValue(phase, "Time")
        $('.startdate').val("")
        $('.enddate').val("")
        if(phaseValues){
          if("StartDate" in phaseValues) {
            const startDate = new Date(parseInt(phaseValues.StartDate.S))
            const day = startDate.getDate()
            const month = startDate.getMonth() + 1
            const year = startDate.getFullYear()
            $('.startdate').val(`${month}/${day}/${year}`)
          }
          if("EndDate" in phaseValues) {
            const endDate = new Date(parseInt(phaseValues.EndDate.S))
            const day = endDate.getDate()
            const month = endDate.getMonth() + 1
            const year = endDate.getFullYear()
            $('.enddate').val(`${month}/${day}/${year}`)
          }
        }
      } else if(field === "scope"){
      	$(".scopeform").show();
        $('.scopeFieldRow').remove();
        $(".scopefieldempty").show();
        const phaseValue = getFieldValue(phase, "Scope")
        if(phaseValue){
          if("Scopes" in phaseValue){
            const fields = phaseValue["Scopes"]["L"]
            if (fields.length > 0) {
              $(".scopefieldempty").hide()
              showEmtpy = false;
              for(const field of fields) {
                addOldScopeField(
                  field.M.Name.S,
                  field.M.Description.S,
                )
              }
            }
          }
        }
      } else if(field === "document"){
      	$(".documentform").show()
        $('.documentFieldRow').remove();
        $(".documentfieldempty").show()
        const phaseValue = getFieldValue(phase, "Document")
        if(phaseValue){
          if("Documents" in phaseValue){
          	const fields = phaseValue["Documents"]["L"]
          	if (fields.length > 0) {
              $(".documentfieldempty").hide()
              for(const field of fields) {
                addOldDocument(field.S)
              }
            }
          }
        }
      } else if(field === "benefits"){
      	$(".benefitsform").show()
        $('.benefitsFieldRow').remove();
        $(".benefitfieldempty").show()
        const phaseValue = getFieldValue(phase, "Benefits")
        if(phaseValue){
          if("Benefits" in phaseValue){
            const fields = phaseValue["Benefits"]["L"]
            if (fields.length > 0) {
              $(".benefitfieldempty").hide()
              showEmtpy = false;
              for(const field of fields) {
                addOldBenefitField(
                  field.M.Name.S,
                  field.M.StrategicAlignment.S,
                  field.M.YearOne ? field.M.YearOne.N : "N/A",
                  field.M.YearTwo ? field.M.YearTwo.N : "N/A",
                  field.M.YearThree ? field.M.YearThree.N : "N/A",
                  field.M.YearFour ? field.M.YearFour.N : "N/A"
                )
              }
            }
          }
        }
      }
    });
	});
}

function setupButtons() {
	setButtonActions('investment');
  setButtonActions('time');
  setButtonActions('scope');
  setButtonActions('benefits');
  setButtonActions('document');
}

function getSettings(){
	fetch(settingsAPI + companyId + "/project", {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Token':localStorage.getItem('Token'),
    },
  })
  .then(response => response.json())
  .then(data => {
  	console.log(data["Items"])
  	const phaseSetting = data["Items"].find(obj => {return obj.Setting.S === 'Project#Phase'})["PhaseNames"]["M"]
    const benefitSetting = data["Items"].find(obj => {return obj.Setting.S === 'Project#Benefits'})["StrategicAlignment"]["L"]
    $("#PhaseOneCard .cardtitle").text(phaseSetting["One"]["S"])
    $("#PhaseTwoCard .cardtitle").text(phaseSetting["Two"]["S"])
    $("#PhaseThreeCard .cardtitle").text(phaseSetting["Three"]["S"])
    $("#PhaseFourCard .cardtitle").text(phaseSetting["Four"]["S"])
    $("#PhaseFiveCard .cardtitle").text(phaseSetting["Five"]["S"])
    
    for (const aligment of benefitSetting) {
    	$('.benefitselect').append($('<option/>', { 
        value: aligment.S,
        text : aligment.S 
    	}));
    }
  })
  .catch(e => { 
    console.log(e)
    alert("Issue loading this project's settings. Please try again later")
  })
}

function postFileS3(form, button, filename){
	const buttonText = button.val();
  button.val("Uploading..."); 
	const params = {
  	"phase": sessionStorage.getItem('phase'),
    "filename": filename,
  }
  let uploadEndpoint = new URL(documentAPI + companyId + "/" + projectId)
	uploadEndpoint.search = new URLSearchParams(params).toString();
	fetch(uploadEndpoint, {
  	method: "PUT",
    headers: {
      'Token':localStorage.getItem('Token'),
    },
  })
  .then(response => {
    console.log(response)
    form
      .hide() // optional hiding of form
      .siblings('.w-form-done').show() // Show success
      .siblings('.w-form-fail').hide(); // Hide failure
  })
	.catch(e => {
    console.log(e)
    form
      .siblings('.w-form-done').hide() // Hide success
      .siblings('.w-form-fail').show();
  })
  .finally(() => {
  	setTimeout(function() { location.reload(true); }, 1500);
  });
}

function postPhaseInformation(body, form, button){
	const buttonText = button.val();
	button.val("Updating..."); 
  const field = sessionStorage.getItem('field');
  const phase = sessionStorage.getItem('phase');

	fetch(projectAPI +  companyId + "/" + projectId, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Token':localStorage.getItem('Token'),
      },
      body: JSON.stringify(body)
    })
    .then(response => { 
    	form
      	.hide() // optional hiding of form
    		.siblings('.w-form-done').show() // Show success
      	.siblings('.w-form-fail').hide(); // Hide failure
    })
    .catch(e => { 
    	console.log(e)
    	form
      	.siblings('.w-form-done').hide() // Hide success
    	  .siblings('.w-form-fail').show(); // show failure
    })
    .finally(() => {
    	 setTimeout(function() { location.reload(true); }, 1500);
    });
}

function addOldDocument(filename) {
	let documentRow = addRow('document','documentfieldempty', 'documentfieldtemplate', 'documentlistcontainer');
	
  const phase = sessionStorage.getItem('phase')
	$(documentRow).find('.documenttitle').text(filename)
  $(documentRow).find('.download').click(() => s3FileActions("GET", companyId, projectId, phase, filename) );
  $(documentRow).find('.delete').click(() => { 
  	s3FileActions("DELETE", companyId, projectId, phase, filename)
    setTimeout(function() { location.reload(true); }, 1500);
  });
}

function addOldScope(title, description) {
  let scopeRow = addRow('scope','scopefieldempty', 'scopefieldtemplate', 'scopelistcontainer');

  $(scopeRow).find('.scopetitle').val(title)
  $(scopeRow).find('.scopedescription').val(description)
}

function addOldBenefitField(title, strategy, yearOne, yearTwo, yearThree, yearFour) {
  let benefitRow = addRow('benefits', 'benefitfieldempty', 'benefitfieldtemplate', 'benefitslistcontainer');

  $(benefitRow).find('.yearone').val(yearOne)
  $(benefitRow).find('.yeartwo').val(yearTwo)
  $(benefitRow).find('.yearthree').val(yearThree)
  $(benefitRow).find('.yearfour').val(yearFour)
  $(benefitRow).find('.benefitselect').val(strategy)
  $(benefitRow).find('.benefittitle').val(title)
}

function addOldScopeField(name, description) {
  let scopeRow = addRow('scope', 'scopefieldempty', 'scopefieldtemplate', 'scopelistcontainer');

	$(scopeRow).find('.scopetitle').val(name)
  $(scopeRow).find('.scopedescription').val(description)
}