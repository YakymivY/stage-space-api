const moment = require('moment');
moment.locale();

export function formatMessage (username: string, text: string) {
    return {
        username,
        text,
        time: moment().format('LT'),
        imageSRC: null
    };
}

//module.exports = formatMessage;