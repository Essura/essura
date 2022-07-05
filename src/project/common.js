const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');
const companyId = localStorage.getItem('CompanyId');
let projectDetail, projectSetting;
getProject(projectId).then(data => {projectDetail=data})
getProjectSettings().then(data => {projectSetting=data})
const currentPhase = parseInt(projectDetail["Phase"]["S"])
let phases = []

// Redirect if Project id not provided
if(!projectId) window.location.replace("https://essura.webflow.io/projectlists");

// Get Project Phases
getProjectPhases(companyId, projectId).then(data => {phases=data})

// Get Phase Information
function getPhaseFieldValue(phase, field) {
	return phases.find(obj => {
  	return obj.Project.S === `Phase#${projectId}#${phase}#${field}`
	})
}

// function getPhaseFieldIndex(phase, field) {
// 	return phases.findIndex(obj => obj.Project.S === `Phase#${projectId}#${phase}#${field}`)
// }