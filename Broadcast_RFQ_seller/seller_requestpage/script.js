    $(document).ready(function(){
        // Navigation Active State
        $('.nav-item').click(function(e){
            e.preventDefault();
            $('.nav-item').removeClass('active');
            $(this).addClass('active');
        });

        // Mobile Sidebar Toggle
        $('.mobile-menu-btn').click(function(){
            $('.sidebar').addClass('open');
            $('.sidebar-overlay').addClass('active');
            $('body').css('overflow', 'hidden'); // Prevent background scrolling
        });

        // Close Sidebar (Click Overlay or Close Button)
        $('.sidebar-overlay, .mobile-close-btn').click(function(){
            $('.sidebar').removeClass('open');
            $('.sidebar-overlay').removeClass('active');
            $('body').css('overflow', '');
        });
    });