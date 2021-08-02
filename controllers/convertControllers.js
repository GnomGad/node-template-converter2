// @ts-nocheck

var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');

var fs = require('fs');
var path = require('path');

var Templater = require('../lib/templater');


/**
 * Функция ожидания
 * @param {*} filePath путь к файлу
 * @param {*} timeout таймаут
 * @returns {Promise} вернет промис
 */ 
 function checkExistsWithTimeout(filePath, timeout) {
    return new Promise(function (resolve, reject) {
        var timer = setTimeout(function () {
            watcher.close();
            reject(new Error('File did not exists and was not created during the timeout.'));
        }, timeout);

        fs.access(filePath, fs.constants.R_OK, function (err) {
            if (!err) {
                clearTimeout(timer);
                watcher.close();
                resolve();
            }
        });

        var dir = path.dirname(filePath);
        var basename = path.basename(filePath);
        var watcher = fs.watch(dir, function (eventType, filename) {
            if (eventType === 'rename' && filename === basename) {
                clearTimeout(timer);
                watcher.close();
                resolve();
            }
        });
    });
};

/**
 * Функция генерирует автоматически файлы
 * @param {*} res 
 * @param {*} templateName 
 * @param {*} pdfName 
 */
function createTemplate(res, templateName, pdfName){
    // сформировать путь к шаблону
    let templatePath = path.resolve('templates', templateName + '.docx');
    // сформировать путь к заполненному файлу
    let outputPath = path.resolve('templates','pdf', templateName +new Date().getTime()+ '.docx');
    //получают набор данных
    var obj = JSON.parse(fs.readFileSync(path.resolve('templates','params', templateName + '.json'), 'utf8'));

    var tp = new Templater(templatePath,outputPath);
    tp.fill(obj);
    return outputPath;
}

exports.convertOneOpt = async function(req, res){
    let downloadPath = createTemplate(res, '1-opt_m', '1-opt_m');
    res.download(downloadPath);
}

exports.convertOnePE = async function (req, res) {
    let downloadPath = createTemplate(res, '1-PE_m', '1-PE_m');
    res.download(downloadPath);
}

