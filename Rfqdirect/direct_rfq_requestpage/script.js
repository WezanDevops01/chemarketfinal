$(document).ready(function () {
    // Initialize DataTable (Fixing the ID to match your HTML table)
    var table = $('#rfqTable').DataTable({
        "dom": 't',
        "ordering": false,
        "pageLength": 6 // Matches your current UI
    });

    // FIX: Sidebar Toggle Logic
    // Combined both the button and the overlay to trigger the toggle
    $("#sidebarToggle, #sidebar-overlay").click(function (e) {
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
});