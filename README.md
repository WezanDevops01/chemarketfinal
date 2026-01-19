# chemarketfinal

12:50


#login-form .form-control{
    border-radius: 6px;
    height: 50px;
    border-radius: 8px;
    border: 1px solid #dee2e6;
    padding-left: 15px;
    font-size: 14px;
    width: 100%;

}


#submit-login{
    background-color: #004d71;
    color: white;
    width: 100%;
    height: 55px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 16px;
    border: none;
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
}





    // --- Validation Logic ---
    $('#login-Form').on('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const email = $('#field-email');
        const password = $('.password-wrapper');
        const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Reset states
        $('.form-control').removeClass('is-invalid');

        // Validate Email
        if (email.val().trim() === "") {
            email.addClass('is-invalid');
            isValid = false;
        } else if (!emailReg.test(email.val())) {
            email.addClass('is-invalid');
            isValid = false;
        }

        // Validate Password
        if (password.val().trim() === "") {
            password.addClass('is-invalid');
            isValid = false;
        } else if (password.val().length < 6) {
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
            $('#content').addClass('shake');
            setTimeout(() => $('.login-card').removeClass('shake'), 400);
        }
    });

    // Real-time validation (Clear error when user types)
    $('.form-control').on('input', function() {
        if ($(this).val().trim() !== "") {
            $(this).removeClass('is-invalid');
        }
    });











------------------------------------------------------




//validation for field input



    // --- Validation Logic ---
    $('#login-Form').on('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const email = $('#field-email');
        const password = $('.password-wrapper');
        const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Reset states
        $('.form-control').removeClass('is-invalid');

        // Validate Email
        if (email.val().trim() === "") {
            email.addClass('is-invalid');
            isValid = false;
        } else if (!emailReg.test(email.val())) {
            email.addClass('is-invalid');
            isValid = false;
        }

        // Validate Password
        if (password.val().trim() === "") {
            password.addClass('is-invalid');
            isValid = false;
        } else if (password.val().length < 6) {
            password.addClass('is-invalid');
            isValid = false;
        }

        if (!isValid) {
           // Add shake effect to the card if invalid
            $('#content').addClass('shake');
            setTimeout(() => $('.login-card').removeClass('shake'), 400);
        } 
    });

    // Real-time validation (Clear error when user types)
    $('.form-control').on('input', function() {
        if ($(this).val().trim() !== "") {
            $(this).removeClass('is-invalid');
        }
    });

Today Task Completed : moved login ,register , buyer broadcast rfq and direct rfq html design to chemarket github and implemented the login html design in chemarket live site