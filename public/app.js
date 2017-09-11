$.getJSON("/saved", function(data) {
  for (var i = 0; i < data.length; i++) {
    $("#articleBox").append('<li class="title"><h3>'+ data[i].title + '</h3>'+
      '<hr><a href="'+ data[i].link + '" class="articleBtn">Link to Full Article</a>'+
      '<a href="/saved/notes/:'+ data[i]._id +'" class="articleBtn">Notes</a>' +
      '<a class="articleBtn" href="/delete/'+ data[i]._id +'">Delete Saved Article</a></li>');
  }
});
