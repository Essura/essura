const documentAPI = "https://dccb14gib5.execute-api.ap-southeast-2.amazonaws.com/prod/"

async function s3FileActions(method, companyId, projectId, phase, filename) {
	const params = {
    	"phase": phase,
    	"filename": filename,
    }
    let uploadEndpoint = new URL(documentAPI + companyId + "/" + projectId)
	uploadEndpoint.search = new URLSearchParams(params).toString();
    await fetch(uploadEndpoint, {
		method: method,
      	headers: {
        	'Token':localStorage.getItem('Token'),
      	},
    })
    .then(response => response.blob())
    .then(blob => {
      	if(method.toLowerCase() != "delete") {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = filename
            document.body.appendChild(a)
            a.click()
            a.remove()
        }
    });
}
