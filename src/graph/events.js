getSettings();

var Webflow = Webflow || [];
Webflow.push(function() {
  
  // unbind webflow form handling
  $(document).off('submit');
  
  $('.model').click(function() {
  	$('.model').hide()
    $('.investmentform').hide()
    $('.benefitsform').hide()
    $('.scopeform').hide()
    $(".timeform").hide();
    $(".documentform").hide();
	}); 
  
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
  
});