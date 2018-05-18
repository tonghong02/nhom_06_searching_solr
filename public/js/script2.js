
function removeDuplicates(arr) {
  let unique_array = []
  for (let i = 0; i < arr.length; i++) {
    if (unique_array.indexOf(arr[i].title) == -1) {
      unique_array.push(arr[i])
    }
  }
  return unique_array
}

$(function () {
  var titles = [];
  $.ajax({
    url: "http://localhost:8983/solr/university/select?wt=json&json.wrf=?&indent=true&start=0&rows=20000&fl=title&q=*:*",
    dataType: 'jsonp',
    success: function (data) {
      let docs = data.response.docs;
      for (var i = 0; i < docs.length; i++) {
        titles.push(docs[i].title[0])
      }
      // console.log("haha")
      // console.log(titles)
    }
  });

  $("#tags").autocomplete({
    source: titles
  });

  $(".search input").focus(function () {
    $('.search input[type=search]').val('');
  });

  $('.search button').on('click', function (e) {
    // ngan chan hanh dong mac dinh cua lien ket
    e.preventDefault();
    $('.search_results').empty();
    var user_input = $('.search input[type=search]').val().trim();
    console.log("input = " + user_input);
    var wiki_api = "http://localhost:8983/solr/university/select?hl=true&hl.fl=content&hl.usePhraseHighlighter=true&wt=json&json.wrf=?&indent=true&start=0&rows=2000&defType=edismax&qf=title&stopwords=true&q=content:" + user_input
    if (user_input !== "") {
      $.ajax({
        url: wiki_api,
        dataType: 'jsonp',
        success: function (data) {
          console.log(data);
          var docs = data.response.docs;

          // loai bo trung lap cac object co cung title
          var results = [];
          var titleSeen = {}, titleSeenValue = {};
          let len = docs.length;
          for (var i = 0, title; i < len; i++) {
            title = docs[i].title;
            // console.log("title: " + title);
            // console.log(i + " : titleSeen[title]: " + titleSeen[title]);
            // console.log(i + " : titleSeenValue: " + titleSeenValue);
            if (titleSeen[title] !== titleSeenValue) {
              results.push(docs[i]);
              titleSeen[title] = titleSeenValue;
            }
          }
          // return results;


          console.log("RESULT");
          console.log(results);

          // var totalResults = data.response.numFound;
          var totalResults = results.length;
          var qtime = data.responseHeader.QTime;
          var highLight = data.highlighting;

          console.log("highlight");
          console.log(highLight);
          console.log("result docs")
          console.log(results);
          $(".qtime").text("Khoảng " + totalResults + " kết quả (" + qtime / 1000 + " s)");
          $('#pagination-demo').twbsPagination('destroy');
          $('#pagination-demo').twbsPagination({
            startPage: 1,
            totalPages: Math.ceil(totalResults / 10),
            visiblePages: 6,
            initiateStartPageClick: true,
            hideOnlyOnePage: true, //	This hides all control buttons if it has one page
            next: 'Next',
            prev: 'Prev',
            onPageClick: function (event, page) {
              // neu la trang cuoi cung
              if (page === Math.ceil(totalResults / 10)) {
                $('.search_results').empty();
                for (var pageid = page * 10 - 10; pageid <= totalResults - 1; pageid++) {
                  var docId = results[pageid].id;
                  var docContent = results[pageid].content;
                  console.log("doc content : " + docContent);
                  console.log("substring: " + docContent.toString().substring(1, 10))
                  var hl = highLight;
                  var content = "";

                  Object.keys(hl).forEach(function (key) {
                    if (key == docId) {
                      if (hl[key].hasOwnProperty('content')) {
                        if (docContent.toString().trim().substring(0, 20) !== hl[key].content[0].toString().trim().substring(0, 20)) {
                          content = docContent.toString().trim().substring(0, 60) + "..." + hl[key].content[0].toString().trim();
                        }
                        else {
                          content = hl[key].content[0].toString().trim();
                        }
                      }
                      else {
                        content = results[pageid].content.toString().trim();
                      }
                      console.log("content = " + content)
                    }
                  });

                  var results_url = '<div class="articleDiv"><a href=' + results[pageid].url  + '" target="_blank">';
                  var results_title = '<h2>' + results[pageid].title + '</h2></a>';
                  var results_content = '<p>' + content + '...' + '</p></div>';
                  if (results.hasOwnProperty(pageid)) {
                    $('.search_results').append(results_url + results_title + results_content);
                  }
                }
              }
              // neu khong phai la trang cuoi cung
              else {
                $('.search_results').empty();
                for (var pageid = page * 10 - 10; pageid <= page * 10 - 1; pageid++) {
                  var docId = results[pageid].id;
                  var docContent = results[pageid].content;
                  var hl = highLight;
                  var content = "";

                  Object.keys(hl).forEach(function (key) {
                    if (key == docId) {
                      if (hl[key].hasOwnProperty('content')) {
                        if (docContent.toString().trim().substring(0, 20) !== hl[key].content[0].toString().trim().substring(0, 20)) {
                          content = docContent.toString().trim().substring(0, 60) + "..." + hl[key].content[0].toString().trim();
                        }
                        else {
                          content = hl[key].content[0].toString().trim();
                        }
                      }
                      else {
                        content = results[pageid].content.toString().trim();
                      }
                      console.log("content = " + content)
                    }
                  });

                  var results_url = '<div class="articleDiv"><a href=' + results[pageid].url + ' target="_blank">';
                  var results_title = '<h2>' + results[pageid].title + '</h2></a>';
                  var results_content = '<p>' + content + '...' + '</p></div>';
                  if (results.hasOwnProperty(pageid)) {
                    $('.search_results').append(results_url + results_title + results_content);
                  }
                }
              }
            }
          });
        }
      });
    }
  });
});
