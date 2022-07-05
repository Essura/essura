setupButtons();
getSettings()
$('.datepicker').datepicker();

var Webflow = Webflow || [];
Webflow.push(function() {
  
  // unbind webflow form handling
  $(document).off('submit');
  setProjectInformation();
  
  $('.model').click(function() {
    $('.model').hide()
    $('.investmentform').hide()
    $('.benefitsform').hide()
    $('.scopeform').hide()
    $(".timeform").hide();
    $(".documentform").hide();
  }); 


  $('.completePhase').click(() => {
    updateProjectDetail(companyId, projectId, {"Status": currentPhase + 1})
    location.reload();
  })
  
  $('.benifitaddfield').click(function() {
    addRow('benefits', 'benefitfieldempty', 'benefitfieldtemplate', 'benefitslistcontainer');
  }); 
  
  $('.scopeaddfield').click(function() {
    addRow('scope', 'scopefieldempty', 'scopefieldtemplate', 'scopelistcontainer');
  }); 
  
  $('.benefitlistcontainer').on('click', '.deletebenefit', function() {
    $(this).parent().parent().parent().remove();
  });
  $('.scopelistcontainer').on('click', '.deletescope', function() {
    $(this).parent().parent().parent().remove();
  });
  
  // new form handling
  $('form').submit(function(e) {
    e.preventDefault();
    const $form = $(this);
    const $submit = $('[type=submit]', $form); // Submit button of form
    const field = sessionStorage.getItem('field');
    const phase = sessionStorage.getItem('phase');
    
    let body = {
      "Phase": phase,
    }
    if(sessionStorage.getItem('field') === "investment") {
      body = {
        ...body,
      "Field": "Investment",
      "Gate": $('#Gate').val() ? $('#Gate').val() : $('#PrevGate').text(),
      "CurrentGate": $('#CurrentGate').val() ? $('#CurrentGate').val() : $('#PrevCurrentGate').text(),
      "Complete": $('#Complete').val() ? $('#Complete').val() : $('#PrevComplete').text(),
      "Contingency": $('#Contingency').val() ? $('#Contingency').val() : $('#PrevContingency').text(),
      "ETC": $('#ETC').val() ? $('#ETC').val() : $('#PrevETC').text(),
      }
      postPhaseInformation(body, $form, $submit);
    } else if(sessionStorage.getItem('field') === "benefits") {
      let fields = []
      $('.benefitsFieldRow').each(function(i, obj) {
          let field = {}
          field['Name'] = { "S": $(obj).find('.benefittitle').val()}
          field['StrategicAlignment'] = { "S": $(obj).find('.benefitselect').val()}
          if($(obj).find('.yearone').val()) field['YearOne'] = { "N": $(obj).find('.yearone').val()};
          if($(obj).find('.yeartwo').val()) field['YearTwo'] = { "N": $(obj).find('.yeartwo').val()};
          if($(obj).find('.yearthree').val()) field['YearThree'] = { "N": $(obj).find('.yearthree').val()};
          if($(obj).find('.yearfour').val()) field['YearFour'] = { "N": $(obj).find('.yearfour').val()};          
          fields.push({
            "M": field
          })
      });
      body = {
        ...body,
      "Field": "Benefits",
      "Benefits": fields,
      }
      postPhaseInformation(body, $form, $submit);
    } else if(sessionStorage.getItem('field') === "time") {
      body = {
        ...body,
      "Field": "Time",
      "StartDate": (new Date($('.startdate').val())).getTime().toString(),
      "EndDate": (new Date($('.enddate').val())).getTime().toString(),
      }
      postPhaseInformation(body, $form, $submit);
    } else if(sessionStorage.getItem('field') === "scope") {
      let fields = []
      $('.scopeFieldRow').each(function(i, obj) {
          let field = {}
          field['Name'] = { "S": $(obj).find('.scopetitle').val()}
          field['Description'] = { "S": $(obj).find('.scopedescription').val()}      
          fields.push({
            "M": field
          })
      });
      body = {
        ...body,
      "Field": "Scope",
      "Scopes": fields,
      }
      postPhaseInformation(body, $form, $submit);
    } else if(sessionStorage.getItem('field') === "document") {
      const filename = $('.documentUploadButton').val().split('\\').pop();
      postFileS3($form, $submit, filename)
    }
  });
});