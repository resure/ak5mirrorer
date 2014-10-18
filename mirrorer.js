var _ = require('lodash'),
    jQuery = require('jquery'),
    env = require('jsdom').env,
    request = require('request'),
    vow = require('vow');

function getPath(path) {
    return 'http://ak-5.ru/explorer?path=' + path;
}

function get(url) {
    var defer = vow.defer();

    request({
        method: 'GET',
        uri: url
    }, function (error, response, body) {
        if (! error && response.statusCode === 200) {
            // console.info('GET', url);
            defer.resolve(body);
        } else {
            console.error(response.statusCode, url);
            defer.reject({text: 'GET failed', code: response.statusCode});
        }
    });

    return defer.promise();
}

function parsePage(url) {
    var defer = vow.defer();

    get(url)
        .then(function (html) {
            env(html, function (errors, window) {
                if (errors) {
                    defer.reject({text: 'jQuery parse failed', err: errors});
                } else {
                    defer.resolve(jQuery(window));
                }
            });
        })
        .fail(function (err) {
            defer.reject({text: 'get failed', err: err})
        });

    return defer.promise();
}

function scanPath(path, storage) {
    var defer = vow.defer(),
        defers = [];

    parsePage(getPath(path)).then(function ($) {
        $('.file-row').each(function (i, row) {
            var dataset = $('a', row).data(),
                link = {
                    dir: dataset.isdirectory === 'True',
                    path: dataset.path
                };

            storage.push(link); 

            if (link.dir) {
                link.children = [];
                defers.push(scanPath('/' + encodeURIComponent(link.path), link.children));
            }
        });

        vow.all(defers).then(function () {
            defer.resolve();
        }).fail(function (err) {
            defer.reject({text: 'One of the sub parsers failed', err: err});
        });

    }).fail(function (err) {
        defer.reject({text: 'parsePage failed', err: err})
    });

    return defer.promise();
}

var storage = [];

scanPath('/', storage)
    .then(function () {
        console.log(JSON.stringify(storage, null, 4));
    })
    .fail(function (err) {
        console.error(err);
    });


























