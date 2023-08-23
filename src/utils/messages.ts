const moment = require('moment');
moment.locale();

export function formatMessage (username: string, text: string) {
    return {
        username,
        text,
        time: moment().format('LT')
    };
}

export function formatPreviousMessages (previous: []) {
    let result = [];
    previous.forEach((element: any) => {
        result.push({
            username: element.sender.username,
            text: element.content,
            image: element.image,
            isImage: element.image ? true : false,
            time: element.timestamp
        });
    }); 
    return result;
}

export function formatImage (username: string, image: string) {
    return {
        username,
        image,
        isImage: true,
        time: moment().format('LT')
    }
}