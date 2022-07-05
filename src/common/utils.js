function getCompanyIdFromUrl() {
  if(window.location.hash) {
    // Get Hash values ot JSON object
    var hash = window.location.hash.substr(1);
    var result = hash.split('&').reduce(function (res, item) {
        var parts = item.split('=');
        res[parts[0]] = parts[1];
        return res;
    }, {});

    // Set cookie
    var d = new Date();
    d = new Date(d.getTime() + 1000 * result.expires_in);
    document.cookie = "token" + '=' + result.id_token + '; expires=' + d.toGMTString() + ';';
    var data = JSON.parse(atob(result.id_token.split(".")[1]));
    localStorage.setItem('Token', result.id_token);
    localStorage.setItem('CompanyId', data["custom:CompanyId"]);
  }
}
  
function generateColour() {
    return "#" + Math.floor(Math.random()*16777215).toString(16)
}

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('/');
}