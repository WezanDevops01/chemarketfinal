$(document).ready(function() {
    
    // Password Visibility Toggle
    $('#togglePasswordIcon').on('click', function() {
        const passwordInput = $('#password');
        const icon = $(this);
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordInput.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    // --- Validation Logic ---
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const email = $('#email');
        const password = $('#password');
        const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Reset states
        $('.form-control').removeClass('is-invalid');
        $('.error-message').hide();

        // Validate Email
        if (email.val().trim() === "") {
            $('#emailError').text("Email is required").show();
            email.addClass('is-invalid');
            isValid = false;
        } else if (!emailReg.test(email.val())) {
            $('#emailError').text("Please enter a valid email address").show();
            email.addClass('is-invalid');
            isValid = false;
        }

        // Validate Password
        if (password.val().trim() === "") {
            $('#passwordError').text("Password is required").show();
            password.addClass('is-invalid');
            isValid = false;
        } else if (password.val().length < 6) {
            $('#passwordError').text("Password must be at least 6 characters").show();
            password.addClass('is-invalid');
            isValid = false;
        }

        if (isValid) {
            // Proceed with Login
            const btn = $('.btn-login');
            btn.html('<i class="fas fa-spinner fa-spin"></i> Logging in...');
            
            console.log("Form is valid. Sending data...");
            // Simulate API Call
            setTimeout(() => {
                alert('Successfully Validated!');
                btn.html('Login <span>&rsaquo;</span>');
            }, 2000);
        } else {
            // Add shake effect to the card if invalid
            $('.login-card').addClass('shake');
            setTimeout(() => $('.login-card').removeClass('shake'), 400);
        }
    });

    // Real-time validation (Clear error when user types)
    $('.form-control').on('input', function() {
        if ($(this).val().trim() !== "") {
            $(this).removeClass('is-invalid');
            $(this).siblings('.error-message').hide();
            $(this).parent().siblings('.error-message').hide(); // For password container
        }
    });
});