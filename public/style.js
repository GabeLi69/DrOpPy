//get request to append the filenames onto index.html
$(document).ready(function(){
    $
        .get("http://localhost:8000/storage/updates")
        .done(function (data) {
          for(i=0; i<data.length; i++){
              console.log('works')
              $('#list').append(`<li><a href="/storage/${data[i]}">${data[i]} </a>
              <a class="btn btn-outline-primary btn-sm delete" href="/storagedelete/${data[i]}">delete</a></li>`);
          }
        })
        .fail(function (data) {
          console.log("fail")
        })
        .always(function (data) {
          console.log("always")
        })
})


