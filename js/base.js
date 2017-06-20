// Set the location of the APIs you want to connect to here
var api = {
    data: 'https://data.freesewing.org',
};

var user = false;
var logged_in = false;
var page = window.location.pathname;
var token = window.localStorage.getItem("jwt");

(function ($) {
    $(document).ready(function () {

        // Authentication ///////////////////////////////////////////
        if(token === null) {
            $('body').addClass('visitor');
            logged_in = false;
            postAuth();
        } else {
            // Is token still valid?
            $.ajax({
                url: api.data+'/auth',
                method: 'GET',
                dataType: 'json',
                success: function() { postLogin() }, 
                error: function() { postLogout() }, 
                headers: {'Authorization': 'Bearer '+token},
            }); 
        }
        
        // Bind off-canvas menu actions /////////////////////////////

        // Bind click for the left menu
        $('.oc-toggle.left').click(function () {
            $('#oc-left').css({ side : "inherit" });
            if($('#oc-right-wrapper').hasClass('shown')) siobhanOcHide('right');
            siobhanOcToggle('left');
        });
    
        // Bind click for the right menu
        $('.oc-toggle.right').click(function () {
            if($('#oc-left').hasClass('shown')) siobhanOcHide('left'); 
            siobhanOcToggle('right');
        });

        // Bind click for the overlay
        $('.oc-overlay').click(function () {
            siobhanOcHide('left');
            siobhanOcHide('right');
        });

        // Clicking a ToC link should close the off-canvas toc
        $("#markdown-toc").find('a').click(function() { 
            if($('body').hasClass('right')) siobhanOcToggle('right');
        });

        // Clicking a menu link should close the off-canvas menu
        $("#sidemenu").find('a.link').click(function() { 
            if($('body').hasClass('left')) siobhanOcToggle('left');
        });

        // Bind other actions ///////////////////////////////////////

        $('a.login, button.login').click(function(e){ e.preventDefault(); login() }); // Login links
   
        $('a.logout, btn.logout').click(function(e){ e.preventDefault(); logout() }); // Logout links
   
        if($('#login-conf').attr('data-autoload') === 'true') $('button.login').click(); // On login page, trigger modal without click

        $('.close-modal').click(function(e) { e.preventDefault(); closeModal(); }); // Close modal links

        $('.scroll-to-top').click(function() { $('html, body').animate({scrollTop : 0},800); }); // Scroll to top link

        $('.tour-guide').click(function(e) { 
            $('#modal').removeClass().addClass('shown light'); 
            $('.burger').addClass('hidden'); 
            $.getScript('/js/tour.js',function(){
                $('#modal-main').attr('data-tour-guide',e.currentTarget.dataset.episode);
            }); 
        }); // Show tour guide
        
        // Handle off-canvas flick on touchscreen interfaces
        $('.oc-panel').on('flick', function(e) {
            var side = $(this).attr('data-side');
            var direction = e['direction'];
            if(side == 'right') direction = direction * -1; 
            if(e['orientation'] == 'horizontal' && direction == -1) siobhanOcHide(side);
        });

        // Handle off-canvas drag on touchscreen interfaces
        $('.oc-panel').on('drag', function(e) {
            panel = $(this);
            var side = panel.attr('data-side');
            var offset = e['dx'];
            if(side == 'right')  offset = offset * -1;
            var dist = offset - 300;
            if(e['end']) {
                if(dist<-400) { 
                    siobhanOcHide(side);
                    setTimeout(function(){ panel.css(side,"-300px")}, 750);
                } else panel.css(side,"-300px");
            } else if(dist<-300) panel.css(side,dist+"px");
        });

        // Toggle body.scrolled class when scrolled
        $(window).scroll(function() {
            if ($(document).scrollTop() > 200) $('body').addClass('scrolled');  
            else $('body').removeClass('scrolled');
        });
        
        // Things that just need to happen //////////////////////////

        $('.sticky').Stickyfill(); // Sticky polyfill

        headingAnchors(); // Heading anchor links
        
        logReferral(); // Referrals 

        $('#markdown-toc').detach().appendTo('#oc-right'); // Move auto-generated ToC to the correct place in the DOM
    });
}(jQuery));

// Methods /////////////////////////

function headingAnchors() {
    $("#content h2, #content h3, #content h4, #content h5, #content h6").each(function(i, el) {
        var $el, icon, id;
        $el = $(el);
        id = $el.attr('id');
        icon = '<i class="fa fa-link"></i>';
        if (id) {
            return $el.append($("<a />").addClass("header-link").attr("href", "#" + id).html(icon));
        }
    });
}

function siobhanOcShow(side) {
    if(side === 'right') {
        $('#oc-right-wrapper').addClass('shown');
    } else {
        $('#oc-left').addClass('shown');
    }
    $('.oc-overlay').addClass(side);
    $('.fade-oc').addClass('faded');
    $('body').addClass('oc-shown '+side);
}

function siobhanOcHide(side) {
    if(side === 'right') {
        $('#oc-right-wrapper').removeClass('shown');
    } else {
        $('#oc-left').removeClass('shown');
    }
    $('.oc-overlay').removeClass(side);
    $('.fade-oc').removeClass('faded');
    $('body').removeClass('oc-shown');
}

function siobhanOcToggle(side) {
    if(side === 'left') var sidediv = '#oc-left';
    else var sidediv = '#oc-right-wrapper';
    if($(sidediv).hasClass('shown')) siobhanOcHide(side); 
    else siobhanOcShow(side); 
}

function logout() {
    window.localStorage.removeItem("jwt");
    window.localStorage.removeItem("fsu");
    window.location.replace("/");
}

function login() {
    $('#modal').removeClass().addClass('shown thematic');
    $('#modal-main').html("<div id='login' class='loginbox'></div>");
    $('#login').load('/snippets/login/form');
    $.getScript( "/js/login.js");
}

function closeModal() {
    $('#modal').removeClass();
    $('.burger').removeClass('hidden');
}

// Things to do after login
function postLogin() { 
    user = JSON.parse(window.localStorage.getItem("fsu"));
    console.log(window.localStorage.getItem("fsu"));
    logged_in = true;
    $('body').addClass('user logged-in'); 
    postAuth();
}

// Things to do after logout
function postLogout() { 
    logged_in = false;
    window.localStorage.removeItem("fsu");
    $('body').addClass('user logged-out'); 
    postAuth();
}

// Things to do after authentication
function postAuth() {
    if ($('body').attr('data-comments') == 'true') loadComments();
}


/* 
 * We don't run any analytics code, but it is nice to know who links to us
 * so the only thing we track are external referrals.
 */
function logReferral() {
    if(document.referrer !== '') {
        var referrer = document.createElement('a');
        var site = document.createElement('a');
        referrer.href = document.referrer;
        if(referrer.hostname !== site.hostname) {
            $.ajax({
                url: api.data+'/referral',
                method: 'POST',
                data: {
                    host: referrer.hostname,
                    path: referrer.pathname,
                    url: document.referrer,
                },
                dataType: 'json',
            }); 
        }
    }
}

function loadComments() {
    marked = $.getScript( "/js/vendor/marked.min.js", function(){
        marked.setOptions({sanitize: true});
        var heading = '<h2>Comments</h2>';
        var form = '<form id="comment-form" class="text-left">';
        form += '<div class="form-group">';
        form += '<input type="hidden" name="parent" value="" id="comment-parent">';
        form += '<label for="comment" id="comment-label"><b>Add your comment</b></label>';
        form += '<textarea class="form-control" id="comment" name="comment" rows="12"></textarea>';
        form += '<input type="hidden" name="page" value="'+page+'">';
        form += '<p><b>Tip:</b> You can use <a href="https://en.wikipedia.org/wiki/Markdown" target="_BLANK">markdown</a> in your comment.</p>';
        form += '</div>';
        form += '<div class="text-right" id="comment-form-buttons">';
        form += '<a id="comment-preview" class="poh btn btn-outline-primary mx-1" href="#comment">Preview</a>';
        form += '<button type="submit" class="poh btn btn-primary mx-1" href="#comment">Save</button>';
        form += '</div>';
        form += '</form>';
        var loginmsg = '<blockquote class="tip m600"><p>You need to <a href="/login">login</a> before you can comment.</p></blockquote>';
        var container = '<div id="comments"></div>';
        
        if (logged_in) $('#comments-container').html(heading+container+form);
        else $('#comments-container').html(heading+container+loginmsg);
        $.get(api.data+'/comments/page'+page,  function(data){renderComments(data.comments)});

        // Bind action buttons
        $('#comment-preview').unbind().click(function(e) { e.preventDefault(); previewComment(); });
        $('#comment-form').unbind().submit(function(e) { e.preventDefault(); saveComment(); });
    });
}


function renderComments(comments) {
    $.each(comments, function(index, comment) {
        if(comment.parent > 0) var container = '#comment-'+comment.parent;
        else var container = '#comments';
        var markup = '<div id="comment-'+comment.id+'" class="comment '+comment.status+'">';
        markup += '<div class="meta">';
        var t = comment.time.split(/[- :]/);
        markup += '<a href="#comment-'+comment.id+'" title="Permalink to this comment">';
        markup += timeago().format(new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5])));
        markup += '</a> by <a href="/users/'+comment.userhandle+'" title="Visit the profile page of this user">'+comment.username+'</a>';
        markup += '</div>';
        markup += '<div class="comment-text '+comment.status+'">';
        if (comment.status == 'removed') markup += '<i class="fa fa-trash" aria-hidden="true"></i> <em>This comment was removed by its author.</em>';
        else if (comment.status == 'restricted') markup += '<i class="fa fa-ban" aria-hidden="true"></i> <em>his comment was removed by a moderator.</em>';
        else {
            markup += '<a href="/users/'+comment.userhandle+'" title="Visit the profile page of this user"><img src="'+api.data+comment.picture+'" class="avatile"></a>';
            markup += marked(comment.comment);
        }
        markup += '</div>';
        markup += '<div class="comment-actions '+comment.status+'">';
        if(logged_in) {
            if(comment.user == user.id) {
            markup += '<a href="#comment-'+comment.id+'" title="Remove this comment" data-comment="'+comment.id+'" class="comment-remove"><i class="fa fa-trash-o" aria-hidden="true"></i></a>';
            }
            markup += '<a href="#comment-'+comment.id+'" title="Reply to this comment" data-comment="'+comment.id+'" class="comment-reply"><i class="fa fa-reply" aria-hidden="true"></i></a>';
        } else {
        markup += '&nbsp;';
        }
        markup += '</div>';
        markup += '</div>';
        $(container).append(markup);
        
        // Bind action buttons
        $('a.comment-remove').unbind().click(function(e) { e.preventDefault(); removeComment($(this).attr('data-comment')); });
        $('a.comment-reply').unbind().click(function(e) { e.preventDefault(); replyToComment($(this).attr('data-comment')); });
    });
} 

function previewComment() {
    $('#modal').removeClass().addClass('shown light');
    var preview = '<div id="preview-container" class="m600">';
    preview += '<h2>Comment preview</h2>';
    preview += '<div class="paper drop-shadow">';
    preview += marked($('#comment').val());
    preview += '</div>';
    preview += '<div class="text-right">';
    preview += '<a id="preview-close" class="poh btn btn-outline-primary mt-3 mx-1" href="#comment">Edit</a>';
    preview += '<a id="preview-save" class="poh btn btn-primary mt-3 mx-1" href="#comment">Save</a>';
    preview += '</div>';
    $('#modal-main').html(preview);
    // Bind action buttons
    $('#preview-container').on('click','#preview-close', function(e) { e.preventDefault(); closeModal(); });
    $('#preview-container').on('click','#preview-save', function(e) { e.preventDefault(); saveComment(); closeModal(); });
}

function saveComment() {
    if($('#comment').val() == '') {
        $.bootstrapGrowl("Your comment was empy, so we did not save it", {type: 'warning'});
    } else {
        $.ajax({
            url: api.data+'/comment',
            method: 'POST',
            data: $('#comment-form').serialize(),
            dataType: 'json',
            success: function(data) { 
                $.bootstrapGrowl("Comment saved, thanks for your input.", {type: 'success'});
                loadComments(); 
            }, 
            error: function(data) { /*FIXME */ },
            headers: {'Authorization': 'Bearer ' + token},
        });
    }
}

function editComment() {
    console.log('editing comment');
}

function replyToComment(id) {
    console.log('Replying to comment '+id);
    $('#comment-parent').val(id);
    $('#comment-form').detach().addClass('mb-5').appendTo('#comment-'+id+' > div.comment-actions');
    $('#comment-label').html('<b>Add your reply</b>');
    if (!$('#cancel-reply-btn').length) $('#comment-form-buttons').prepend('<a href="comment-'+id+'" class="btn btn-outline-danger" id="cancel-reply-btn">Cancel reply</a>');
    $('#cancel-reply-btn').unbind().click(function(e) { 
        e.preventDefault();
        $('#comment-form').detach().removeClass('mb-5').appendTo('#comments-container');
        $('#comment-label').html('<b>Add your comment</b>');
        $('#cancel-reply-btn').remove();
        $('#comment-parent').val('');
    });
    
}

function removeComment(id) {
    console.log('removing comment '+id);
    $.ajax({
        url: api.data+'/comment/'+id,
        method: 'DELETE',
        data: $('#comment-form').serialize(),
        dataType: 'json',
        success: function(data) { 
            $.bootstrapGrowl("Comment removed.", {type: 'success'});
            loadComments(); 
        }, 
        error: function(data) { /*FIXME */ },
        headers: {'Authorization': 'Bearer ' + token},
    });
}

