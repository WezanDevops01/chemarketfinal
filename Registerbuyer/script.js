/**
 * Password Strength Logic
 * Placed outside for global access and clean organization
 */
function checkPasswordStrength() {
    var number = /([0-9])/;
    var alphabets = /([a-zA-Z])/;
    var special_characters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;
    var password = $('#password').val().trim();
    var $status = $('#password-strength-status');

    if (password.length === 0) {
        $status.hide();
        return false; // Added return
    }

    $status.show().removeClass('weak-password medium-password strong-password');

    if (password.length < 6) {
        $status.addClass('weak-password').html("Weak (should be at least 6 characters.)");
        return "weak"; // Added return
    } else {
        if (password.match(number) && password.match(alphabets) && password.match(special_characters)) {
            $status.addClass('strong-password').html("Strong");
            return "strong"; // Added return
        } else {
            $status.addClass('medium-password').html("Medium (should include alphabets, numbers and special characters.)");
            return "medium"; // Added return
        }
    }
}

$(function () {
    /* =========================
       1. INITIALIZE PHONE INPUT
    ========================= */
    const phoneInput = document.querySelector("#phone");
    const iti = window.intlTelInput(phoneInput, {
        initialCountry: "sa",
        separateDialCode: false,
        autoPlaceholder: "aggressive",
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.2.1/js/utils.js",
    });

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

    // Sync Dropdown change -> Change Phone Flag
    $countrySelect.on('change', function() {
        const countryCode = $(this).val().toLowerCase();
        if (countryCode) {
            iti.setCountry(countryCode);
        }
    });

    // Sync Phone Flag change -> Change Dropdown selection
    phoneInput.addEventListener("countrychange", function() {
        const selectedData = iti.getSelectedCountryData();
        $countrySelect.val(selectedData.iso2.toUpperCase());
    });

    /* =========================
       3. STEP & STATE MANAGEMENT
    ========================= */
    let currentStep = 1;
    const totalSteps = 3;

    function updateStep(step) {
        // Clear errors ONLY when going backward
        if (step < currentStep) {
            $('.error-message').removeClass('show').text('');
            $('.error').removeClass('error');
        }

        $('.multistep-step').removeClass('active');
        $('#step-' + step).addClass('active');

        $('.registerheader-tabs li').each(function () {
            const stepNumber = $(this).data('step');
            $(this).toggleClass('active', stepNumber <= step);
        });

        $('#stepstatusCurrentStep').text(step);
        currentStep = step;
        window.scrollTo(0, 0);
    }

    /* =========================
       4. VALIDATION CORE
    ========================= */
    function validateContainer(container) {
        let isValid = true;
    
        // Find all inputs that should be validated
        container.find('input, select, textarea').each(function () {
            const input = $(this);
            
            // Skip validation for hidden or disabled fields
            if ((!input.is(':visible') && !input.hasClass('hidden-file-input')) || input.is(':disabled')) {
                return true; 
            }
    
            const fieldName = input.data('name') || 'This field';
            const val = input.val() ? input.val().trim() : "";
    
            // 1. Check Required
            if (input.hasClass('required')) {
                if (input.is(':checkbox')) {
                    if (!input.is(':checked')) {
                        showError(input, 'This is required');
                        isValid = false;
                        return;
                    }
                } else if (input.attr('type') === 'file') {
                    if (!input[0].files || !input[0].files.length) {
                        showError(input, fieldName + ' is required');
                        isValid = false;
                        return;
                    }
                } else if (val === "") {
                    showError(input, fieldName + ' is required');
                    isValid = false;
                    return;
                }
            }
    
            // 2. Specific Type Validation (Email/Phone)
            if (val !== "") {
                if (input.attr('type') === 'email') {
                    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailReg.test(val)) {
                        showError(input, 'Invalid email format');
                        isValid = false;
                    }
                } else if (input.attr('id') === 'phone') {
                    if (!iti.isValidNumber()) {
                        showError(input, 'Invalid phone number');
                        isValid = false;
                    }
                }
            }
            
            if (isValid) clearError(input);
        });
    
        return isValid;
    }
    /* =========================
       5. PASSWORD MATCH VALIDATION
    ========================= */
    function validatePasswords() {
        const password = $('#password');
        const confirm = $('#step-2 input[type="password"]').last();
        const strength = checkPasswordStrength();
    
        // Reset errors
        clearError(password);
        clearError(confirm);
    
        // BLOCK 1: Empty
        if (!password.val()) {
            showError(password, 'Password is required');
            return false;
        }
    
        // BLOCK 2: Weakness (THE HACKER BLOCK)
        // If strength is "weak" or less than 6 chars, return false to stop the button
        if (strength === "weak" || password.val().length < 6) {
            showError(password, 'Security Risk: Password is too weak.');
            return false;
        }
    
        // BLOCK 3: Match
        if (password.val() !== confirm.val()) {
            showError(confirm, 'Passwords do not match');
            return false;
        }
    
        return true; // Only returns true if Strong/Medium AND matching
    }
    /* =========================
       6. BUTTON & LIVE EVENTS
    ========================= */

    // Trigger Password Strength on Typing
    $(document).on('input', '#password', function() {
        checkPasswordStrength();
    });

    /* =========================
   SECURE GATEKEEPER LOGIC
   ========================= */
$('.next-step').on('click', function (e) {
    e.preventDefault();

    // 1. Always validate Step 1 first (The Foundation)
    if (!validateContainer($('#step-1'))) {
        updateStep(1); // Force them back to Step 1 if they tampered with it
        console.log("Security Trigger: Step 1 data is no longer valid.");
        return;
    }

    // 2. If trying to leave Step 2, validate Step 2 + Passwords
    if (currentStep >= 2) {
        const step2Valid = validateContainer($('#step-2'));
        const passwordsValid = validatePasswords();
        if (!step2Valid || !passwordsValid) {
            if (currentStep !== 2) updateStep(2); // Force back to 2 if they are on 3
            return;
        }
    }

    // 3. If everything behind is valid, allow moving forward
    if (currentStep < totalSteps) {
        updateStep(currentStep + 1);
    } else {
        // Final Step 3 Validation
        if (validateContainer($('#step-3'))) {
            console.log('FORM SUBMITTED SUCCESSFULLY');
            $('#buyerForm').submit();
        }
    }
});

    // Back Button Logic
    $('.prev-step').on('click', function (e) {
        e.preventDefault();
        if ($('#step3-page-2').hasClass('active')) {
            $('#step3-page-2').removeClass('active');
            $('#step3-page-1').addClass('active');
            window.scrollTo(0, 0);
            return;
        }
        if (currentStep > 1) {
            updateStep(currentStep - 1);
        }
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
});