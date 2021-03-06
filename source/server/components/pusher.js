var mpns = require('mpns'),
    gcm = require('node-gcm'),
    Result = require('../models/result'),
    Subscriber = require('../models/subscriber');

var gcmSender;

var Pusher = function (config) {
    gcmSender = new gcm.Sender(config.gcmApiKey);
};

/**
 * Sends an event to all subscribers listed as target.
 * @param event {Event} Event to be pushed.
 */
Pusher.prototype.send = function (event) {
    if (!event.target) {
        throw new Error('Target not defined.');
    }
    if (!event.headers) {
        throw new Error('Headers not defined.');
    }
    if (!event.payload) {
        throw new Error('Payload not defined.');
    }
    var target = event.target;

    Subscriber.find({})
        .where('service').in(target.services)
        .where('platform').in(target.platforms) // optimizes query results
        .exec(function (err, subscribers) {
            if (err) {
                throw err;
            }

            // push to windows
            var windowsSubscribers = subscribers.filter(function (s) {
                return s.platform === 'windows';
            });
            pushToWindows(windowsSubscribers, event);

            // push to GCM
            var androidSubscribers = subscribers.filter(function (s) {
                return s.platform === 'android';
            });
            pushToGCM(androidSubscribers, event);
        });
};

function pushToWindows(subscribers, event) {
    if (!subscribers || subscribers.length == 0) {
        return;
    }
    var title = event.headers.text.toString(),
        content = event.headers.type == 'text' ? event.payload.content : '',
        id = event.id;

    var options = {text1: title, text2: content, param: '?eid=' + id};
    for (var i = 0; i < subscribers.length; i += 1) {
        mpns.sendToast(subscribers[i].token, options, function (err, result) {
            if (err) {
                throw err;
            }
            storeResult('mpns', event, result);
        });
    }
}

function pushToGCM(subscribers, event) {
    if (!subscribers || subscribers.length == 0) {
        return;
    }
    var tokens = subscribers.map(function (s) {
        return s.token;
    });

    gcmSender.send(event.headers.text, tokens, 4, function (err, result) {
        if (err) {
            throw err;
        }
        storeResult('gcm', event, result);
    });
}

function storeResult(provider, event, result) {
    var model = new Result({
        provider: provider,
        eid: event.id,
        data: result
    });
    model.save(function (err) {
        if (err) {
            throw  err;
        }
    });
}

module.exports = function (config) {
    return new Pusher(config)
};
