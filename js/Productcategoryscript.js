$(function () {
    // 1. Tab switching logic
    $('.tab').on('click', function () {
        $('.tab').removeClass('active');
        $(this).addClass('active');
        $('.tab-content').removeClass('active');
        $('#' + $(this).data('target')).addClass('active');
    });

    // 2. Accordion logic (Footer trigger)
    $('.btn-toggle-desc').on('click', function () {
        const card = $(this).closest('.product-card');
        card.find('.description-full').slideToggle(300);
        $(this).toggleClass('active');
    });

    // 3. Grid vs List Toggle
    $('#viewToggle').on('click', function() {
        const grid = $('#productGrid');
        const isGrid = grid.hasClass('list-view'); // Toggle state
        
        if (isGrid) {
            grid.removeClass('list-view');
            $(this).find('span').text('Grid view');
            $(this).find('i.bi').first().attr('class', 'bi bi-grid');
        } else {
            grid.addClass('list-view');
            $(this).find('span').text('List view');
            $(this).find('i.bi').first().attr('class', 'bi bi-list-task');
        }
    });
});