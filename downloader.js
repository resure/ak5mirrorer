var fs = require('fs');
var list = fs.readFileSync('list.txt').toString().split('\n');
var http = require('http');

var done = 0,
    total = list.length;

(function download(list) {
    var url = list.pop();

    if (url) {
        var dest = './files/' + url.split('/').slice(3).join('/'),
            file = fs.createWriteStream(dest);

        http.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close(function () {
                    console.log('[', ++done + '/' + total + '] ' + url);
                    if (list.length) {
                        download(list);
                    }
                })
            });
        }).on('error', function (e) {
            fs.unlink(dest);
            console.error(e);
        });
    } else if (list.length) {
        download(list);
    }
})(list);
