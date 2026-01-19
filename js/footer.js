    $(document).ready(function () {
    
      function footerAccordion() {
        if (window.innerWidth <= 576) {
    
          $('.cm-footer-toggle').off('click').on('click', function () {
            const parent = $(this).closest('.cm-footer-col');
    
            // Close others
            $('.cm-footer-col').not(parent).removeClass('active');
    
            // Toggle current
            parent.toggleClass('active');
          });
    
        } else {
          // Reset for tablet & desktop
          $('.cm-footer-col').removeClass('active');
          $('.cm-footer-menu').removeAttr('style');
        }
      }
    
      footerAccordion();
      $(window).on('resize', footerAccordion);
    
    });