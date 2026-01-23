$(document).ready(function () {
    $('.tab-btn').on('click', function () {

        // Prevent re-clicking active tab
        if ($(this).hasClass('active')) return;

        // Buttons
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');

        const target = $(this).data('target');

        // Get current active content
        const $current = $('.tab-content.active');
        const $next = $('#' + target);

        // Smooth switch (NO flicker)
        $current.fadeOut(200, function () {
            $current.removeClass('active');
            $next.fadeIn(200).addClass('active');
        });
    });
});