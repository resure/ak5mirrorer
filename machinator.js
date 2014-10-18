
var fs = require('fs');

fs.readFile('./data.json', 'utf8', function (err, data) {
    if (err) {
        console.error(err);
        return
    }

    data = JSON.parse(data);
    makeParty(data);
})

function makeParty(list) {
    list.forEach(function (elem) {
        if (elem.dir) {
            fs.mkdirSync('./files/' + elem.path)
            makeParty(elem.children);
        } else {
            console.log(elem.path);
        }
    });
}
