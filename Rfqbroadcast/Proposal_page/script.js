        $(document).ready(function () {
            var table = $('#proposalsTable').DataTable({ "dom": 't', "ordering": false });

            // Sidebar Toggle Logic
            $("#sidebarToggle, #sidebar-overlay").click(function (e) {
                e.preventDefault();
                $("#wrapper").toggleClass("toggled");
            });

            // Sidebar Accordion Logic
            $('#quotation-toggle').click(function () {
                $('#quotation-subnav').toggleClass('hidden');
                $(this).find('.bi-chevron-down').toggleClass('bi-chevron-up');
            });

            // Table Expansion Logic
            //TABLE PRODUCT DETAIL EXPAND
            $('#proposalsTable tbody').on('click', '.expand-btn', function () {
                var tr = $(this).closest('tr');
                var row = table.row(tr);
                if (row.child.isShown()) {
                    row.child.hide();
                    $(this).removeClass('bi-chevron-up').addClass('bi-chevron-down');
                } else {
                    row.child($('#child_1').html(), 'p-0').show();
                    $(this).removeClass('bi-chevron-down').addClass('bi-chevron-up');
                }
            });


            // Optimized Chat Modal Logic
            $('#proposalsTable').on('click', '.bi-chat-left-dots', function () {
                var modalElement = document.getElementById('chatModal');
                var instance = bootstrap.Modal.getInstance(modalElement);
                if (!instance) {
                    instance = new bootstrap.Modal(modalElement);
                }
                instance.show();
            });



     //EDIT REQUEST POPUP DISPLAY LOGIC

     $('#menuToggle').on('click', function(e) {
        e.stopPropagation();
        $('#popoverMenu').toggleClass('show-menu');
      });
    
      // Close menu when clicking outside
      $(document).on('click', function(e) {
        if (!$(e.target).closest('.action-container').length) {
          $('#popoverMenu').removeClass('show-menu');
        }
      });



        //SHOW MORE AND SHOW LESS LOGIC

        $('#toggleshowmore').on('click', function() {
            $('#tableContainer').slideToggle(300, function() {
                if ($(this).is(':visible')) {
                    $('#toggleshowmore').text('Show less');
                } else {
                    $('#toggleshowmore').text('Show more');
                }
            });
        });



        });