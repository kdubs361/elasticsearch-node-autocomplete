"use strict";
jQuery(document).ready(function($){

    var previous;

    $('.searchbar').on("change paste keyup", function() {

        var word = $(this).val();

        if(word !== '' && word !== previous){
            previous = word;

            suggestion(word, 10);
        }

    });

    $(document).on('click', '.option', function(el){
        el.preventDefault();

        var id = $(this).data('id');
        var name = $(this).data('name');

        $('.submit').prop('disabled', false);

        $('.searchbar').val(name);
        $('.value').val(id);

        $('.submit').prop('disabled', false);

        $('.autocomplete').html('');

    });

    $(document).on('click', '.submit', function(el){
        el.preventDefault();

        var id = $('.value').val();

        search(id);

    })

});

function suggestion(text, size){

    $.getJSON('/suggest/'+text+'/'+size)
        .done(function(data){
            var firstName = data.suggest.firstNameSuggester[0].options;
            var lastName = data.suggest.lastNameSuggester[0].options;

            $('.autocomplete a').each(function(){
                $(this).remove();
            });

            $.each(firstName, function(index, value){
                // $('.autocomplete').append('<a class="option" href="#" data-id="'+value._id+'" data-name="'+value._source.name+' '+value._source.description+'"><span class="bold">'+ value._source.name +'</span> '+ value._source.description +'</a>')
                $('.autocomplete').append('<a class="option" href="#" data-id="'+value._id+'" data-name="'+value._source.name+'"><span class="bold">'+ value._source.name +'</span> '+'</a>')
            });

            // $.each(lastName, function(index, value){
            //     $('.autocomplete').append('<a class="option" href="#" data-id="'+value._id+'" data-name="'+value._source.name+' '+value._source.description+'">'+value._source.name +' <span class="bold">'+ value._source.description +'</span></a>')
            // });

        });

}

function search(id){
    $.getJSON('/stat/'+id)
        .done(function(data){
            $.each(data.hits.hits, function(index, value){
                var details = value._source;
                var retired = value._source.retired ? "Yes" : "No";

                $('.result').html('<div class="player"><p>Name: <span class="bold">'+details.name+ '</span></p><p>Description: <span class="bold">'+details.description+'</span></p><p>URL: <span class="bold"><a href='+details.url+'>'+details.url+'</a></span></p><p>Shipping: <span class="bold">$'+details.shipping+'</span></p><p>SKU: <span class="bold">'+details.sku+'</span></p><p>Manufacturer: <span class="bold">'+details.manufacturer+'</span></p><p>Model: <span class="bold">'+details.model+'</span></p><p><img src="'+details.image+'""></p><p>Type: <span class="bold">'+details.type+'</span></p></div>')
                // $('.result').html('<div class="player"><p>Name: <span class="bold">'+details.name+ '</span></p><p>Description: <span class="bold">'+details.description+'</span></p><p>URL: <span class="bold"><a href='+details.url+'>'+details.url+'</a></span></p><p>Shipping: <span class="bold">$'+details.shipping+'</span></p><p>SKU: <span class="bold">'+details.sku+'</span></p><p>Manufacturer: <span class="bold">'+details.manufacturer+'</span></p><p>Model: <span class="bold">'+details.model+'</span></p><p>Image: <span class="bold">'+details.image+'</span><img src="'+details.image+'""></p><p>Type: <span class="bold">'+details.type+'</span></p></div>')

            })
        });
}