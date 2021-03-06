location_search = location.search;

function materializeInit() {
    $('.modal-trigger').leanModal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .3, // Opacity of modal background
            in_duration: 300, // Transition in duration
            out_duration: 200, // Transition out duration
            starting_top: '4%', // Starting top style attribute
            ending_top: '10%', // Ending top style attribute
            ready: function() {  }, // Callback for Modal open
            complete: function() {  } // Callback for Modal close
        }
    );
    $('select').material_select();
    $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false, // Does not change width of dropdown to that of the activator
            hover: true, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: false, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        }
    );
}

function initSelectBox(name_list) {
    name_list.forEach(function(name) {
        $("select.select-"+name).change(function() {
            location_search = $.query.parseNew(location_search, name+"="+this.value).REMOVE('page').toString();
            List.init(location.pathname+'items/'+location_search);
        });
    });
}

var List = {
    init: function(url) {
        console.log("GET LIST: ", url);
        this.get(url);
        this.infiniteScroll()
    },
    get: function(url) {
        $.get(url, function(data) {
            $('section.product_list_section').html(data);
            materializeInit();
        });
    },
    getByScroll: function(next_page) {
        var parsedQuery = $.query.parseNew(location_search, "page="+next_page).toString();
        console.log("GET NEXT LIST: ", location.pathname+'items/'+ parsedQuery);
        $.get(location.pathname+'items/'+ parsedQuery, function(data) {
            $('.loader').remove();
            $('section.product_list_section').append(data);
            materializeInit();
        });
    },
    infiniteScroll: function() {
        $(window).scroll(function () {
            var $loader = $('.loader');
            var $next_page_container = $('.next-page-container');
            var next_page = $next_page_container.data('next');
            var footer = $('footer.page-footer').position().top;
            var scrollTop = $(window).scrollTop();
            if (scrollTop + $(window).height() >= footer - 30) {
                $loader.css('display', 'block');
                if(next_page) {
                    $next_page_container.remove();
                    List.getByScroll(next_page);
                }
            }
        });
    }
};

$(document).ready(function () {
    List.init(location.pathname+'items/'+location_search);
    materializeInit();
    initSelectBox(['order', 'list']);
});