const uuidv4 = require('uuid/v4');
const Q = require('q');
//Create a standalone Handlebars so other instances do not conflict
const Handlebars = require('handlebars').create();
patchResolvePartial(Handlebars);
registerHelpers(Handlebars);

const MARKER_PREFIX = '\u0001((';
const MARKER_SUFFIX = '))\u0001';


var currentState = null;
function runWithState(state, callback){
    currentState = state;
    callback();
}

function registerHelpers(Handlebars){
    var helpers = require('handlebars-helpers')(
        [
            'array',
            'collection',
            'comparison',
            'date',
            'html',
            'math', 
            'misc',
            'number',
            'object',
            'regex',
            'string',
            'url',
            'markdown'
        ],
        {
            handlebars: Handlebars
        }
    );
}

Handlebars.registerHelper('splitBlock', function (index, split) {
                if (typeof split === 'undefined') {
                    return ''
                }
                var id = parseInt(index, 10);
                var splitter = split.split('/');
                if (id === 0) {
                    return 'amp-ca-size-' + splitter[0];
                }

                return 'amp-ca-size-' + splitter[1];
            });

Handlebars.registerHelper('compare_length', function(
    arr,
    operator,
    val,
    opts,
) {
    let result = false;
    switch (operator) {
        case '==':
            result = arr.length == val;
            break;
        case '<':
            result = arr.length < val;
            break;
        case '>':
            result = arr.length > val;
            break;
        default:
            throw 'Unknown operator ' + operator;
    }

    if (result) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

Handlebars.registerHelper('escapeUrl', url => {
    if (!url || url.length < 1) {
        return '';
    }
    return encodeURIComponent(url);
});

Handlebars.registerHelper('math', (
    lvalue,
    operator,
    rvalue,
    options,
) => {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        '+': lvalue + rvalue,
        '-': lvalue - rvalue,
        '*': lvalue * rvalue,
        '/': lvalue / rvalue,
        '%': lvalue % rvalue,
    }[operator];
});

Handlebars.registerHelper('templateChooser', (
    context,
    addTemplateClassname,
) => {
    context = context instanceof Array ? context[0] : context;

    if (!context || !context._meta) {
        return '';
    }
    const parsedName = context._meta.schema
        .match(/(\/[\w\-]+)/g)
        .splice(-1)[0]
        .replace('/', '')
        .replace(/-([a-z])/g, g => g[1].toUpperCase());
    let matchedTemplate;
    for (const x in this.handlebars) {
        if (parsedName.toLowerCase() === x.toLowerCase()) {
            matchedTemplate = this.handlebars[x].length
                ? this.handlebars[x]
                : this.handlebars.template(this.handlebars[x]);
            break;
        }
    }

    if (!matchedTemplate) {
        return 'Template matching id: ' + parsedName + ' not found';
    }


    context.addTemplateClassname =
        typeof addTemplateClassname !== 'undefined'
            ? addTemplateClassname
            : '';
    return new this.handlebars.SafeString(matchedTemplate(context));
});

Handlebars.registerHelper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);

    if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
    }
});

Handlebars.registerHelper('roundelConfig', roundel => {
    if (
        roundel &&
        roundel[0] &&
        roundel[0].roundel &&
        roundel[0].roundel.name
    ) {
        const roundelParams = [];
        let imageRoundelIndex;
        for (let x = 0; x < roundel.length; x++) {
            let roundelParam = '';
            switch (roundel[x].roundelPosition) {
                case 'Bottom Right':
                    roundelParam = 'p1_img=';
                    imageRoundelIndex = 1;
                    break;
                case 'Bottom Left':
                    roundelParam = 'p2_img=';
                    imageRoundelIndex = 2;
                    break;
                case 'Top Left':
                    roundelParam = 'p3_img=';
                    imageRoundelIndex = 3;
                    break;
                case 'Top Right':
                    roundelParam = 'p4_img=';
                    imageRoundelIndex = 4;
                    break;
            }

            const roundelRatio = roundel[x].roundelRatio;
            roundelParam +=
                roundel[x].roundel.name +
                (roundelRatio
                    ? '&roundelRatio' + imageRoundelIndex + '=' + roundelRatio
                    : '');
            roundelParams.push(roundelParam);
        }

        return roundelParams.join('&');
    } else {
        return '';
    }
});

Handlebars.registerHelper('roundelProperties', function(opts) {
    if (
        this.roundel &&
        this.roundel[0] &&
        this.roundel[0].roundel &&
        this.roundel[0].roundelPosition &&
        this.roundel[0].roundelRatio
    ) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

Handlebars.registerHelper('json', (obj) => {
    return JSON.stringify(obj);
});

Handlebars.registerHelper('iff', function(a, operator, b, opts) {
    let bool = false;
    switch (operator) {
        case '==':
            bool = a == b;
            break;
        case '>':
            bool = a > b;
            break;
        case '<':
            bool = a < b;
            break;
        default:
            throw new Error('Unknown operator ' + operator);
    }

    if (bool) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

function patchResolvePartial(Handlebars){
    Handlebars.VM.resolvePartial = function(partial, context, options){
        if (!partial) {
            partialName = options.name;
        } else if (!partial.call && !options.name) {
            // This is a dynamic partial that returned a string
            partialName = partial;
        }
        return function(){
            var id = uuidv4();
            currentState.markers[id] = processSingleTemplate(partialName, context, currentState);
            return MARKER_PREFIX + id + MARKER_SUFFIX;
        }
    }
}

function getMarkers(text){
    var result = [];
    var io = 0;
    while((io = text.indexOf(MARKER_PREFIX, io)) != -1){
        io += MARKER_PREFIX.length;
        var end = text.indexOf(MARKER_SUFFIX, io);
        if(end == -1){
            throw new Error('unable to process nested template');
        }else{
            result.push(text.slice(io, end));
        }
    }
    return result;
}

function replaceMarker(text, id, value){
    return text.split(MARKER_PREFIX + id + MARKER_SUFFIX).join(value);
}


function processSingleTemplate(templateName, data, state){
    state.includes++;
    if(state.includes > 1000){
        return Q.reject(new Error("maximum template recursion reached"));
    }

    return state.config.getTemplate(templateName)
        .then(function(template){
            
            var output;
            runWithState(state, function(){
                var compiled = Handlebars.compile(template, {srcName: templateName});
                output = compiled(data);
            });

            var markers = getMarkers(output);
            var markerPromises = markers.map(function(id){
                return state.markers[id];
            });
            
            return Q.allSettled(markerPromises).then(function(results){
                results.forEach(function (result, i) {
                    var id = markers[i];
                    if (result.state === "fulfilled") {
                        var value = result.value;
                        output = replaceMarker(output, id, value);
                    } else {
                        //Error
                        throw result.reason;

                        //Or blank?
                        //output = replaceMarker(output, id, '');
                    }
                });
                return output;
            });

        }, function(err){
            //Remap the error to a friendly message
            throw new Error('unable to find template ' + templateName);
        });
}

function process(templateName, data, config){
    var state = {
        config: config,
        markers: {},
        includes: 0
    };
    return processSingleTemplate(templateName, data, state);
}

module.exports = {
    process: process
}