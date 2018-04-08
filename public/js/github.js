$(document).ready(function () {
    let $repo = $('#repo');
    $repo.autocomplete({
        source: function (request, response) {
            $.ajax({
                url: $repo.attr('data-url').replace('<username>', $repo.val()),
                dataType: "json",
                success: function (data) {
                    if (data.message) {
                        response(data.message);
                    } else {
                        response(data.repos);
                    }
                }
            });
        },
        minLength: 3,
        select: function (event, ui) {
            // log(ui.item ?
            //     "Selected: " + ui.item.label :
            //     "Nothing selected, input was " + this.value);
        }
    });
});