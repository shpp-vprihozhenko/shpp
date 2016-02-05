/**
 * Created by Uzer on 05.02.2016.
 */
var winston = require('winston');

function getLogger(module) {
    var path = module.filename.split('/').slice(-2).join('/'); //отобразим метку с именем файла, который выводит сообщение
    var Logger=new winston.Logger({
        transports : [
            new winston.transports.Console({
                colorize:   true,
                level:      'debug',
                label:      path
            })
        ]
    });
    Logger.add(winston.transports.File, { filename: 'somefile.log' });
    return Logger;
}

module.exports = getLogger;