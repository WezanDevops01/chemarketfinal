/**
 * Password Strength Logic
 * Placed outside for global access and clean organization
 */

let activeRole = 'buyer';
let currentStep = 1;
const totalSteps = 3;






function checkPasswordStrength() {
    const $passwordInput = $('#' + activeRole + '-step-2 input[type="password"]').first();

    // 🔒 SAFETY CHECK
    if (!$passwordInput.length) return false;

    const password = ($passwordInput.val() || '').trim();
    const $status = $('#' + activeRole + '-password-strength-status');

    const number = /[0-9]/;
    const alphabets = /[a-zA-Z]/;
    const special = /[~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<]/;

    if (!password) {
        $status.hide();
        return false;
    }

    $status.show().removeClass('weak-password medium-password strong-password');

    if (password.length < 6) {
        $status.addClass('weak-password').text('Weak (min 6 characters)');
        return 'weak';
    }

    if (number.test(password) && alphabets.test(password) && special.test(password)) {
        $status.addClass('strong-password').text('Strong');
        return 'strong';
    }

    $status.addClass('medium-password')
        .text('Medium (use letters, numbers & symbols)');
    return 'medium';
}




$(function () {
   /* =========================
   1. INITIALIZE PHONE INPUT
========================= */

const phoneInstances = {};

function initPhone(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    phoneInstances[inputId] = window.intlTelInput(input, {
        initialCountry: "sa",
        autoPlaceholder: "aggressive",
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/js/utils.js",
    });
}

// Initialize ALL phone inputs (after DOM is ready)
initPhone('buyer-phone');
initPhone('seller-phone');
initPhone('seller-phone-business');


    /* =========================
       2. DYNAMIC COUNTRY LIST LOGIC
    ========================= */
    const countryData = window.intlTelInputGlobals.getCountryData();
    const $countrySelect = $('#country-selector');

    // Populate the dropdown automatically from the library data
    $.each(countryData, function(index, country) {
        $countrySelect.append($('<option>', {
            value: country.iso2.toUpperCase(),
            text: country.name
        }));
    });

    function getActivePhoneInstance() {
        const phoneId =
            activeRole === 'buyer'
                ? 'buyer-phone'
                : currentStep === 3
                    ? 'seller-phone-business'
                    : 'seller-phone';
    
        return phoneInstances[phoneId];
    }
    
    // Dropdown → Phone
    $countrySelect.on('change', function () {
        const iti = getActivePhoneInstance();
        if (!iti) return;
        iti.setCountry($(this).val().toLowerCase());
    });
    
    // Phone → Dropdown
    $(document).on('countrychange', 'input[type="tel"]', function () {
        const iti = phoneInstances[this.id];
        if (!iti) return;
        $countrySelect.val(iti.getSelectedCountryData().iso2.toUpperCase());
    });
    
   
 

    function updateStepUI(step) {
        $('.multistep-step').removeClass('active');
        $('#' + activeRole + '-step-' + step).addClass('active');
    
        $('.registerheader-tabs li').each(function () {
            const s = $(this).data('step');
            $(this).toggleClass('active', s <= step);
        });
    
        // ✅ Show role radio switcher ONLY on step 1
        if (step === 1) {
            $('#role-switcher').removeClass('d-none');
            $('input[name="regType"]').prop('disabled', false);
        } else {
            $('#role-switcher').addClass('d-none');
            $('input[name="regType"]').prop('disabled', true);
        }
    
        $('#stepstatusCurrentStep').text(step);
        currentStep = step;
        window.scrollTo(0, 0);
    }
    

    /* =========================
       4. VALIDATION CORE
    ========================= */
    function validateContainer(container) {
        let isValid = true;
    
        // ===============================
        // 1. NORMAL FIELD VALIDATION
        // ===============================
        container.find('input, select, textarea').each(function () {
            const input = $(this);
    
            // Skip hidden or disabled
            if ((!input.is(':visible') && !input.hasClass('hidden-file-input')) || input.is(':disabled')) {
                return true;
            }
    
            const fieldName = input.data('name') || 'This field';
            const val = input.val() ? input.val().trim() : '';
    
            // REQUIRED (skip checkbox here)
            if (input.hasClass('required')) {
    
                if (input.is(':checkbox')) {
                    return; // checkbox handled as group
                }
    
                if (input.attr('type') === 'file') {
                    if (!input[0].files || !input[0].files.length) {
                        showError(input, fieldName + ' is required');
                        isValid = false;
                        return;
                    }
                } else if (val === '') {
                    showError(input, fieldName + ' is required');
                    isValid = false;
                    return;
                }
            }
    
            // EMAIL VALIDATION
            if (val !== '' && input.attr('type') === 'email') {
                const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailReg.test(val)) {
                    showError(input, 'Invalid email format');
                    isValid = false;
                    return;
                }
            }
    
            // PHONE VALIDATION
            if (val !== '' && input.attr('type') === 'tel') {
                const itiInstance = phoneInstances[input.attr('id')];
                if (itiInstance && !itiInstance.isValidNumber()) {
                    showError(input, 'Invalid phone number');
                    isValid = false;
                    return;
                }
            }
    
            clearError(input);
        });
    
        // ===============================
        // 2. COMPANY TYPE CHECKBOX GROUP
        // ===============================
        container.find('.company-type-options').each(function () {
            const checkboxes = $(this).find('input[type="checkbox"]');
    
            if (!checkboxes.filter(':checked').length) {
                showError(checkboxes.first(), 'Company type is required');
                isValid = false;
            }
        });
    
        return isValid;
    }
    


    $(document).on('change', '.company-type-options input[type="checkbox"]', function () {
        if ($(this).closest('.company-type-options').find(':checked').length) {
            clearError($(this));
        }
    });

    
    /* =========================
       5. PASSWORD MATCH VALIDATION
    ========================= */
    

    function validatePasswords() {
        const password = $('#' + activeRole + '_password');
        const confirm  = $('#' + activeRole + '_confirm_password');
        const strength = checkPasswordStrength();
    
        clearError(password);
        clearError(confirm);
    
        if (!password.val()) {
            showError(password, 'Password is required');
            return false;
        }
    
        if (strength === 'weak') {
            showError(password, 'Password is too weak');
            return false;
        }
    
        if (password.val() !== confirm.val()) {
            showError(confirm, 'Passwords do not match');
            return false;
        }
    
        return true;
    }
    
      



    /* =========================
       6. BUTTON & LIVE EVENTS
    ========================= */

    // Trigger Password Strength on Typing
    $(document).on(
        'input',
        '#buyer-step-2 input[type="password"], #seller-step-2 input[type="password"]',
        function () {
            checkPasswordStrength();
        }
      );
      


      function goToSellerStep3Page(page) {
        $('#seller-step-3 .step3-page').removeClass('active');
        $('#step3-page-' + page).addClass('active');
    }
    

    /* =========================
   SECURE GATEKEEPER LOGIC
   ========================= */
   $('.next-step').on('click', function (e) {
    e.preventDefault();
  
// 🔒 Determine correct validation container
let stepBox;

if (activeRole === 'seller' && currentStep === 3) {
    stepBox = $('#seller-step-3 .step3-page.active');
} else {
    stepBox = $('#' + activeRole + '-step-' + currentStep);
}


  
    if (!validateContainer(stepBox)) return;
  
    if (currentStep === 2 && !validatePasswords()) return;
  
    if (activeRole === 'seller' && currentStep === 3) {

        // PAGE 1 → PAGE 2
        if ($('#step3-page-1').hasClass('active')) {
    
            if (!validateContainer($('#step3-page-1'))) return;
    
            goToSellerStep3Page(2);
            return;
        }
    
        // PAGE 2 → SUBMIT
        if ($('#step3-page-2').hasClass('active')) {
    
            if (!validateContainer($('#step3-page-2'))) return;
    
            $('#sellerForm').submit();
            return;
        }
    }
    
    // NORMAL STEP FLOW (buyer + seller steps 1 & 2)
    if (currentStep < totalSteps) {
        updateStepUI(currentStep + 1);
    } else {
        $('#' + activeRole + 'Form').submit();
    }
    
  });

  
  $('.prev-step').on('click', function () {

    if (activeRole === 'seller' && currentStep === 3) {

        if ($('#step3-page-2').hasClass('active')) {
            goToSellerStep3Page(1);
            return;
        }
    }

    if (currentStep > 1) updateStepUI(currentStep - 1);
});

  




    /* =========================
       7. UI ERROR HELPERS
    ========================= */
    function showError(input, message) {
        input.addClass('error');
        const container = input.closest('.mb-3, .col-sm-6, .form-check, .password-wrapper');
        container.find('.error-message').first().text(message).addClass('show');
    }

    function clearError(input) {
        input.removeClass('error');
        const container = input.closest('.mb-3, .col-sm-6, .form-check, .password-wrapper');
        container.find('.error-message').first().removeClass('show').text('');
    }

    // Live clear error on input
    $(document).on('input change', '.required', function () {
        const input = $(this);
        if (input.val() && input.val().trim() !== '') {
            clearError(input);
        }
    });

    /* =========================
       8. FILE & PASSWORD UI EXTRAS
    ========================= */
    $('.custom-upload').on('click', function () {
        $('#' + $(this).data('input')).trigger('click');
    });

    $('.hidden-file-input').on('change', function () {
        const fileName = this.files[0]?.name || 'Upload File';
        $(this).siblings('.custom-upload').addClass('selected')
               .find('.upload-title').text(fileName);
        clearError($(this));
    });

    $('.password-wrapper i').on('click', function () {
        const input = $(this).siblings('input');
        const isPassword = input.attr('type') === 'password';
        input.attr('type', isPassword ? 'text' : 'password');
        $(this).toggleClass('fa-eye fa-eye-slash');
    });

    $('input[name="regType"]').on('change', function () {
        activeRole = this.value; // buyer | seller
    
        $('#buyer-wrapper').toggleClass('d-none', activeRole !== 'buyer');
        $('#seller-wrapper').toggleClass('d-none', activeRole !== 'seller');
    
        currentStep = 1;
        updateStepUI(1);
    });
    
});