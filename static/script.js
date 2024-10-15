function formOpen() {
  $('#post-form').slideDown('50');
}
function formClose() {
  $('#post-form').slideUp('50');
}

function posting() {
  let url = $('#movieUrl').val();
  let star = $('#star').val();
  let comment = $('#comment').val();
  const loadingButton = $('#loading');
  const submitButton = $('#submitButton');
  const form = document.forms['post-form'];
  const alert = $('.alert');
  loadingButton.show();
  submitButton.hide();
  $.ajax({
    type: 'POST',
    url: '/movie',
    data: { url: url, star: star, comment: comment },
    success: function (response) {
      alert.html(`
        <strong>Thanks!</strong> ${response['msg']}.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `);
      alert.show();
      loadingButton.hide();
      submitButton.show();
      form.reset();
      listing();
    }
  });
}

function listing() {
  const movies_box = $('#cards-box');
  movies_box.empty();
  $.ajax({
    type: 'GET',
    url: '/movie',
    data: {},
    success: function (response) {
      if (response['movies'].length) {
        let movies = response['movies'];
        for (let i = 0; i < movies.length; i++) {
          const img = movies[i].image;
          let title = movies[i].title;
          let titleOnly = title.split("⭐")[0].trim()
          const desc = movies[i].description;
          const star = movies[i].star;
          const comment = movies[i].comment;
          const starIcon = "⭐".repeat(star);
          const temp_html = `
          <div class="col">
          <div class="card h-100">
              <img
                src="${img}"
                class="card-img-top" alt="Movie Avenger Cover">
              <div class="card-body">
                <h5 class="card-title">${titleOnly}</h5>
                <p class="card-text">${desc}</p>
                <p>${starIcon}</p>
                <small>${comment}</small>
              </div>
            </div>
          </div>
        `
          movies_box.append(temp_html);
        }
      } else {
        movies_box.append("<p>No Movies, let's save some movie</p>");
      }
    }
  })
}

$(document).ready(function () {
  listing();
});