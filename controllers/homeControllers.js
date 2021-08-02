exports.index = function (req, res) {
    res.render("index.hbs",{
        title: 'Главная'
    });
};

exports.test = async function(req, res) {
    res.render("test.hbs",{
        title: 'Проверка'
    });
}