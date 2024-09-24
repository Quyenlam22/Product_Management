module.exports.index = (req, res) => {
    res.render('client/page/home/index.pug', { 
        pageTitle: 'Trang chủ',
        message: 'Trang chủ'
    })
}