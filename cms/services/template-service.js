const amp = require('cms-javascript-sdk');
const handlebarsService = require('./handlebars-service');
const fs = require('fs');
const path = require('path');

function compileSlots(response, template) {
    var contentItems = amp.inlineContent(response);
    var compiled = contentItems.map(function(content) {
        return compile(content, template);
    });

    return Promise.all(compiled)
        .then(function(outputs) {
            var result = {};
            for(var i=0; i < contentItems.length; i++) {
                var id = contentItems[i]["@id"];
                id = id.slice(id.lastIndexOf('/')+1);
                result[id] = outputs[i];
            }
            return result;
        });
}

function compile(content, template) {
    return handlebarsService.process(template || 'mapping', content, {
        getTemplate: getTemplate
    });
}

const templateCache = {};

function getTemplate(name) {
    if(templateCache[name]) {
        return templateCache[name];
    }

    const result = new Promise(function(resolve, reject) {
        fs.readFile(path.resolve(__dirname, '../templates/' + name + '.hbs'), "utf-8", function (error, data) {
            if(error) {
                reject(error);
            }else{
                resolve(data);
            }
        });
    });

    if(process.env.env == 'production') {
        templateCache[name] = result;
    }

    return result;
}


module.exports = {
    compileSlots: compileSlots
};