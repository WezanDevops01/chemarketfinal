$(document).ready(function() {
    let currentStep = 1;

    function validateStep(step) {
        let isValid = true;
        $(`#step-${step} [required]`).each(function() {
            const value = $(this).val();
            if (value === null || value === "" || (typeof value === 'string' && value.trim() === "")) {
                $(this).addClass('is-invalid');
                isValid = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        return isValid;
    }

    function updateUI() {
        // Show/Hide Form content
        $('.step-content').addClass('d-none');
        $(`#step-${currentStep}`).removeClass('d-none');
        
        // NEW LOGIC: Highlighting current AND previous tabs
        $('.step-tab').each(function() {
            const tabStep = parseInt($(this).data('step'));
            if (tabStep <= currentStep) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });

        $('#nextBtn').text(currentStep === 3 ? 'Create Broadcast RFQ' : 'Continue');
    }

    $('#nextBtn').click(function() {
        if (validateStep(currentStep)) {
            if (currentStep < 3) {
                currentStep++;
                updateUI();
            } else {
                alert("Request Submitted Successfully!");
                $('#broadcastModal').modal('hide');
            }
        }
    });

    $('#prevBtn').click(function() {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
        } else {
            $('#broadcastModal').modal('hide');
        }
    });

    $('.toggle-icon').click(function() {
        $(this).toggleClass('bi-caret-right-fill bi-caret-down-fill');
        $(this).parent().next('.sub-nodes').toggleClass('show');
    });

    $('.form-control, .form-select').on('change input', function() {
        if ($(this).val() !== "" && $(this).val() !== null) {
            $(this).removeClass('is-invalid');
        }
    });
});