        $(document).ready(function() {
    
    // 1. Tab Switching Logic
    $('.tab-btn').on('click', function() {
        // Remove active class from all buttons and panes
        $('.tab-btn').removeClass('active');
        $('.tab-pane').removeClass('active');
        
        // Add active class to clicked button
        $(this).addClass('active');
        
        // Show corresponding content
        const targetId = $(this).data('target');
        $('#' + targetId).addClass('active');
    });

    // 2. Mobile Sidebar Toggle
    $('#mobileMenuBtn').on('click', function() {
        $('#sidebar').addClass('open');
    });

    $('.sidebar-toggle-btn').on('click', function() {
        $('#sidebar').removeClass('open');
    });

    // Close sidebar when clicking outside (optional UX improvement)
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#sidebar, #mobileMenuBtn').length) {
            $('#sidebar').removeClass('open');
        }
    });

    // 3. Dismiss Success Toast
    $('#closeToast').on('click', function() {
        $('#successToast').fadeOut(300);
    });

});
// --- Modal Logic ---

    // Open Modal
    $('#btn-delete-proposal').on('click', function() {
        $('#deleteModal').css('display', 'flex').hide().fadeIn(200);
        // Prevent body scrolling when modal is open
        $('body').css('overflow', 'hidden');
    });

    // Close Modal Function
    function closeModal() {
        $('#deleteModal').fadeOut(200);
        $('body').css('overflow', 'auto'); // Restore scrolling
    }

    // Trigger close on X icon or Cancel button
    $('#closeModalIcon, #btnModalCancel').on('click', function() {
        closeModal();
    });

    // Close when clicking outside the modal box
    $('#deleteModal').on('click', function(e) {
        if ($(e.target).is('#deleteModal')) {
            closeModal();
        }
    });
    $(document).ready(function() {

    // Handle closing the success message
    $('#closeToast').on('click', function() {
        // This targets the parent container with ID "successMessage" and fades it out
        $('#successMessage').fadeOut(300); 
    });

});

    $(document).ready(function(){
        // Simple Sidebar Toggle Logic
        $('.mobile-menu-btn').click(function(){
            $('.sidebar').addClass('open');
            $('.sidebar-overlay').addClass('active');
            $('body').css('overflow', 'hidden'); 
        });

        $('.sidebar-overlay, .mobile-close-btn').click(function(){
            $('.sidebar').removeClass('open');
            $('.sidebar-overlay').removeClass('active');
            $('body').css('overflow', '');
        });
    });
    
      $(document).ready(function(){
    // Tab switching logic
    $('.tab-link').click(function(){
        const tabId = $(this).attr('data-tab');

        // Remove active class from all buttons and panes
        $('.tab-link').removeClass('active');
        $('.tab-pane').removeClass('active');

        // Add active class to clicked button and corresponding pane
        $(this).addClass('active');
        $('#' + tabId).addClass('active');
    });
    
        // Simple Sidebar Toggle Logic
        $('.mobile-menu-btn').click(function(){
            $('.sidebar').addClass('open');
            $('.sidebar-overlay').addClass('active');
            $('body').css('overflow', 'hidden'); 
        });

        $('.sidebar-overlay, .mobile-close-btn').click(function(){
            $('.sidebar').removeClass('open');
            $('.sidebar-overlay').removeClass('active');
            $('body').css('overflow', '');
        });
    });
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    let currentStepIndex = 0;

    function updateUI() {
        steps.forEach((step, idx) => step.classList.toggle('active', idx === currentStepIndex));
        stepIndicators.forEach((indicator, idx) => {
            indicator.classList.toggle('active', idx <= currentStepIndex);
        });
        
        backBtn.style.visibility = currentStepIndex === 0 ? 'hidden' : 'visible';
        
        if (currentStepIndex === steps.length - 1) {
            nextBtn.innerText = 'Submit Proposal';
            nextBtn.classList.add('ready');
        } else {
            nextBtn.innerText = 'Continue';
            nextBtn.classList.remove('ready');
        }
    }

    function validateStep() {
        const currentStepFields = steps[currentStepIndex].querySelectorAll('[required]');
        let isValid = true;
        
        currentStepFields.forEach(field => {
            if (!field.value.trim()) { 
                field.classList.add('is-invalid'); 
                isValid = false; 

                field.addEventListener('input', function() {
                    if (this.value.trim() !== "") {
                        this.classList.remove('is-invalid');
                    }
                }, { once: true });
            } else { 
                field.classList.remove('is-invalid'); 
            }
        });
        
        return isValid;
    }

    nextBtn.addEventListener('click', () => {
        if (validateStep()) {
            if (currentStepIndex < steps.length - 1) {
                currentStepIndex++;
                updateUI();
            } else {
                alert("Proposal Submitted Successfully!");
                const modalEl = document.getElementById('proposalModal');
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();
            }
        }
    });

    backBtn.addEventListener('click', () => {
        if (currentStepIndex > 0) { 
            currentStepIndex--; 
            updateUI(); 
        }
    });

    // File Upload logic
    const fileInput = document.getElementById('fileInput');
    const uploadBox = document.getElementById('uploadBox');
    const filePreview = document.getElementById('filePreview');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            fileNameDisplay.innerText = this.files[0].name;
            uploadBox.style.display = 'none';
            filePreview.style.display = 'flex';
        }
    });

    document.getElementById('removeFile').addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = '';
        uploadBox.style.display = 'block';
        filePreview.style.display = 'none';
    });


  // 1. Initialize Tooltips with specific trigger logic
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
        trigger: 'click', // Better for mobile 'taps'
        boundary: 'viewport'
    });
});


// 2. Navigation + Tooltip Toggle
stepIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function(e) {
        
        // --- NEW: Hide all other tooltips first ---
        tooltipList.forEach(t => {
            if (t._element !== this) {
                t.hide();
            }
        });

        // --- Navigation Logic ---
        if (index < currentStepIndex || validateStep()) {
            currentStepIndex = index;
            updateUI();
            
            // Hide current tooltip after navigating if on desktop
            if (window.innerWidth > 576) {
                const tooltip = bootstrap.Tooltip.getInstance(this);
                if (tooltip) tooltip.hide();
            }
        }
        
        // Note: Bootstrap's 'click' trigger will toggle the 
        // current tooltip automatically.
    });
});

// 3. Clean up on resize
window.addEventListener('resize', () => {
    tooltipList.forEach(t => t.hide());
});
