const moment = require('moment');
moment.locale();

function formatMessage (username: string, text: string) {
    return {
        username,
        text,
        time: moment().format('LT')
    };
}

module.exports = formatMessage;