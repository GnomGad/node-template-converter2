//@ts-nocheck

var fs = require('fs');
var path = require('path');
var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');


/**
 * Класс отвечает за заполнение шаблона
 */
class Templater {
    constructor(templatePath, outPath){
        if(!templatePath || !templatePath){
            throw new Error("Неверный тип аргумента")
        }

        this.templatePath = templatePath;
        this.outPath = outPath;
    }

    // Объект ошибки содержит дополнительную информацию при регистрации с помощью JSON.stringify (он содержит объект свойств, содержащий все подопытные ошибки).
    _replaceErrors(key, value) {
        if (value instanceof Error) {
            return Object.getOwnPropertyNames(value).reduce(function(error, key) {
                error[key] = value[key];
                return error;
            }, {});
        }
        return value;
    };

    _errorHandler(error) {
        console.log(JSON.stringify({error: error}, this._replaceErrors));
    
        if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors.map(function (error) {
                return error.properties.explanation;
            }).join("\n");
            console.log('errorMessages', errorMessages);
        }
        throw error;
    };

    /**
     * Заполняет шаблон значениями из полей
     * @param {*} fields Словарь ключ-значение для  подстановки в шаблон
     * @returns {string} Возвращает путь к файлу
     */
    fill(fields){
        var content = fs.readFileSync(this.templatePath, 'binary');
        var zip = new PizZip(content);
        var doc;

        try {
            doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
        } catch(error) {
            // ошибки комплияции или неуместные теги
            this._errorHandler(error);
        }
        
        doc.setData(fields);

        try {
            //Рендер документа замена всех {значение} на исходные
            doc.render()
        }
        catch (error) {
            // Ловля ошибок связанных с рендером
            errorHandler(error);
        }
    
        var buf = doc.getZip()
                    .generate({type: 'nodebuffer'});
    
        fs.writeFileSync(this.outPath, buf);

        return this.outPath;
    };
}

module.exports = Templater;