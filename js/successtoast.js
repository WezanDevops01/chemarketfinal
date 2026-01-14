$(document).ready(function() {
    // When the user clicks the final 'Delete' button in the modal
    $('#confirmDelete').click(function() {
        
        // 1. Hide the confirmation modal using Bootstrap's method
        var deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();

        // 2. Hide the main Request Details table/modal (if it's still open)
        $('#modalOverlay').fadeOut(200);

        // 3. Show the Success Toast
        $('#deleteSuccessToast').css('display', 'flex').hide().fadeIn(400);

        // 4. Optional: Auto-hide the toast after 4 seconds
        setTimeout(function() {
            $('#deleteSuccessToast').fadeOut();
        }, 4000);
    });
});