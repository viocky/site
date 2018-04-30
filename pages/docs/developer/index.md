---
layout: cards
title: Documentation for developers
permalink: "/docs/developer/"
nocomments: true
---
<div class="container">
    <div class="row">
        <div class="col-md-4 mt-5">
            {% include card.html 
                title='Class documentation'
                text="Apart from the <a href=\"/apigen/core/\">class documentation generated by apigen</a>, we have hand-crafted documentation for our public API."
                img='/img/classdocs.jpg'
                link='/docs/core/classdocs'
                link-text='Class documentation'
            %}
        </div>
        <div class="col-md-4 mt-5">
            {% include card.html 
                title='Developer theme'
                text='Use our demo with the developer theme to get a full Kint dump of the freesewing context.'
                img='/img/kint-dump.jpg'
                link='https://demo.freesewing.org/'
                link-text='Go to the demo'
            %}
        </div>
        <div class="col-md-4 mt-5">
            {% include card.html 
                title='Repository overview'
                text='All our code is hosted in GitHub, but it spread out in different repositories. This overview lists them all.'
                img='/img/repositories.jpg'
                link='/docs/repositories'
                link-text='Repository overview'
            %}
        </div>
    </div> <!-- .row -->
</div> <!-- .container -->
