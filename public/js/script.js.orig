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
                $('.autocomplete').append('<a class="option" href="#" data-id="'+value._id+'" data-name="'+value._source.firstName+' '+value._source.lastName+'"><span class="bold">'+ value._source.firstName +'</span> '+ value._source.lastName +'</a>')
            });

            $.each(lastName, function(index, value){
                $('.autocomplete').append('<a class="option" href="#" data-id="'+value._id+'" data-name="'+value._source.firstName+' '+value._source.lastName+'">'+value._source.firstName +' <span class="bold">'+ value._source.lastName +'</span></a>')
            });

        });

}

function search(id){
    $.getJSON('/stat/'+id)
        .done(function(data){
            $.each(data.hits.hits, function(index, value){
                var details = value._source;
                var retired = value._source.retired ? "Yes" : "No";

                $('.result').html('<div class="player"><p>Full Name: <span class="bold">'+details.firstName+ ' ' + details.lastName+'</span></p><p>Position: <span class="bold">'+details.position+'</span></p><p>Date of First International Match: <span class="bold">'+details.firstMatch+'</span></p><p>Height: <span class="bold">'+details.height+'</span></p><p>Age: <span class="bold">'+details.age+'</span></p><p>Country of Birth: <span class="bold">'+details.country+'</span></p><p>Residential Address: <span class="bold">'+details.address+'</span></p><p>Eye Color: <span class="bold">'+details.eyeColor+'</span></p><p>Retired?: <span class="bold">'+retired+'</span></p></div>')
            })
        });
}