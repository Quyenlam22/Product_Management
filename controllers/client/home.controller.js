// [GET] /
module.exports.index = async (req, res) => {
    res.render('client/page/home/index.pug', { 
        pageTitle: 'Trang chủ',
        
    })
}