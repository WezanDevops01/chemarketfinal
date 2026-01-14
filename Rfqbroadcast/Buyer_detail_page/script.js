

// Prevent accordion toggle when clicking buttons


function toggleAccordion(element) {
    const $this = $(element);
    const $detailRow = $this.next('.detail-row');
    const $arrow = $this.find('.toggle-arrow');

    // Slide the detail row
    $detailRow.stop().slideToggle(300);

    // Toggle the rotation class
    $arrow.toggleClass('rotated');
}

$(document).ready(function () {
    // Initialize DataTable (Fixing the ID to match your HTML table)
    var table = $('#rfqTable').DataTable({
        "dom": 't',
        "ordering": false,
        "pageLength": 6 // Matches your current UI
    });

       // Sidebar Toggle Logic
       $("#menu-toggle, #sidebar-overlay").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });


    // Sidebar Accordion Logic (Quotation sub-menu)
    $('#quotation-toggle').click(function () {
        $('#quotation-subnav').toggleClass('hidden');
        $(this).find('.bi-chevron-down').toggleClass('bi-chevron-up');
    });

    // Optional: Close sidebar when a nav-link is clicked on mobile
    $('.nav-link-custom').click(function () {
        if (window.innerWidth < 992 && !$(this).is('#quotation-toggle')) {
            $("#wrapper").removeClass("toggled");
        }
    });
    //for request seller details page 

    



    $('.btn-accept, .btn-reject').on('click', function(e) {
        e.stopPropagation();
        // Bootstrap data-bs-target handles the opening automatically
    });




    
    
});