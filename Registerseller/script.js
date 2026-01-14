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

        $('.figma-steps li').each(function () {
            const stepNumber = $(this).data('step');
            $(this).toggleClass('active', stepNumber <= step);
        });

        $('#figmaCurrentStep').text(step);
        currentStep = step;
        window.scrollTo(0, 0);
    }

    /* =========================
       4. VALIDATION CORE
    ========================= */
    function validateContainer(container) {
        let isValid = true;
    
        // Only look for required fields INSIDE the current active step/container
        container.find('.required').each(function () {
            const input = $(this);
            const fieldName = input.data('name') || 'This field';
    
            // skip if the element is hidden (unless it's our special file input)
            // and skip if it's disabled
            if ((!input.is(':visible') && !input.hasClass('hidden-file-input')) || input.is(':disabled')) {
                return true; // continue to next iteration
            }
    
            // A. Mobile Number
            if (input.attr('id') === 'phone') {
                if (!input.val() || !input.val().trim()) {
                    showError(input, 'Mobile number is required');
                    isValid = false;
                } else if (!iti.isValidNumber()) {
                    showError(input, 'Invalid phone number');
                    isValid = false;
                } else {
                    clearError(input);
                }
            }
            // B. Checkbox
            else if (input.is(':checkbox')) {
                if (!input.is(':checked')) {
                    showError(input, 'This is required');
                    isValid = false;
                } else {
                    clearError(input);
                }
            }
            // C. File Input
            else if (input.attr('type') === 'file') {
                if (!input[0].files || !input[0].files.length) {
                    showError(input, fieldName + ' is required');
                    isValid = false;
                } else {
                    clearError(input);
                }
            }
            // D. Text/Email/Password/Select
            else {
                const val = input.val();
                if (!val || (typeof val === 'string' && !val.trim())) {
                    showError(input, fieldName + ' is required');
                    isValid = false;
                } else {
                    clearError(input);
                }
            }
        });
    
        return isValid;
    }
    /* =========================
       5. PASSWORD MATCH VALIDATION
    ========================= */
    function validatePasswords() {
        const password = $('#password');
        const confirm = $('#step-2 input[type="password"]').last();
        
        // 1. Check if empty
        if (!password.val()) {
            showError(password, 'Password is required');
            return false;
        }
    
        // 2. Check Strength (BLOCK IF WEAK)
        const strength = checkPasswordStrength();
        if (strength === "weak" || strength === false) {
            showError(password, 'Password is too weak');
            return false;
        }
    
        // 3. Check if matching
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
    $(document).on('input', '#password', function() {
        checkPasswordStrength();
    });

    // Next Step Button Logic
    $('.next-step').on('click', function (e) {
        e.preventDefault();

        // Special handling for Step 3 internal pages
        if ($(this).hasClass('step3-next')) {
            const page1 = $('#step3-page-1');
            if (!validateContainer(page1)) return;
            page1.removeClass('active');
            $('#step3-page-2').addClass('active');
            window.scrollTo(0, 0);
            return;
        }

        const currentContainer = $('#step-' + currentStep);
        const fieldsValid = validateContainer(currentContainer);
        
        // Only validate password match if we are on step 2
        const passwordValid = currentStep === 2 ? validatePasswords() : true;

        if (!fieldsValid || !passwordValid) return;

        if (currentStep < totalSteps) {
            updateStep(currentStep + 1);
        } else {
            console.log('FORM SUBMITTED SUCCESSFULLY');
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