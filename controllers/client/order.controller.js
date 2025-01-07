const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const Order = require("../../models/order.model")
const User = require("../../models/user.model")
// const Chart = require("../../models/chart.model")

const productHelper = require("../../helpers/product")

let $ = require('jquery')
const request = require('request')
const moment = require('moment')

// [GET] /order
module.exports.index = async (req, res) => {
    // Lặp qua từng phần tử để lấy thông tin sản phẩm 
    // Tối ưu đoạn code tính tôngr tiền san phẩm thành helper
    let listProducts = []

    if(res.locals.orders){
        for (const order of res.locals.orders) {
            for (const product of order.products) {
                const orderProduct = await Product.findOne({
                    _id: product.product_id,
                    deleted: false,
                    status: "active"
                }).select("title thumbnail")
    
                product.title = orderProduct.title
                product.thumbnail = orderProduct.thumbnail
                product.priceNew = productHelper.priceNewProduct(product)
                product.totalPrice = product.priceNew * product.quantity
                listProducts.push(product)
            }
            order.totalPrice = listProducts.reduce((sum, item) => item.totalPrice + sum, 0)
            order.listProducts = listProducts
            listProducts = []
        }
    }
    // res.locals.orders.totalPrice = order.listProducts.reduce((sum, item) => item.totalPrice + sum, 0)

    res.render('order/orderlist.pug', {
        pageTitle: 'Danh sách đơn hàng',
        listProducts: listProducts
    })
}

// [GET] /order/create_payment_url
module.exports.payment = async (req, res) => {
    try {
        if (Object.keys(req.query).length == 0) {
            const order = await Order.findOne({
                _id: req.cookies.order
            })
            
            if (order.products.length > 0) {
                for (const item of order.products) {
                    item.priceNew = productHelper.priceNewProduct(item)

                    item.totalPrice = item.priceNew * item.quantity
                }
            }

            order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice * 25000, 0)

            res.render('order/index.jade', {
                title: 'Thanh toán đơn hàng',
                cart: order
            })
            //Xử lý lấy thông tin và giá tiền
        } else {
            const cartId = req.cookies.cartId
            const tokenUser = req.cookies.tokenUser
            const cart = await Cart.findOne({
                _id: cartId
            })
            const user = await User.findOne({
                tokenUser: tokenUser
            })

            const products = []

            if (cart.products.length > 0) {
                for (const item of cart.products) {
                    const objectProduct = {
                        product_id: item.product_id,
                        quantity: item.quantity
                    }
                    const productInfo = await Product.findOne({
                        _id: item.product_id,
                    }).select("price discountPercentage")

                    item.productInfo = productInfo
                    item.priceNew = productHelper.priceNewProduct(item.productInfo)

                    item.totalPrice = item.priceNew * item.quantity

                    objectProduct.price = productInfo.price
                    objectProduct.discountPercentage = productInfo.discountPercentage

                    products.push(objectProduct)
                }
            }

            cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice * 25000, 0)

            const userInfo = {
                fullName: req.query.fullName,
                phone: req.query.phone,
                address: req.query.address
            }

            if (!req.cookies.order) {
                const order = new Order({
                    cart_id: req.cookies.cartId,
                    userInfo: userInfo,
                    user_id: user.id,
                    products: products
                })
                await order.save()

                res.cookie("order", order.id, {
                    maxAge: 365 * 24 * 60 * 60 * 1000
                })
            } else {
                await Order.updateOne({
                    _id: req.cookies.order
                }, {
                    userInfo: userInfo,
                    cart_id: req.cookies.cartId,
                    user_id: user.id,
                    products: products
                })
            }
            res.render('order/index.jade', {
                title: 'Thanh toán đơn hàng',
                cart: cart
            })
        }
    } catch (e) {
        req.flash("error", "Có lỗi trong quá trình xử lý đơn !")
        res.redirect("back")
    }
}

// [POST] /order/create_payment_url
module.exports.paymentPost = async (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let config = require('config');

    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnpUrl = config.get('vnp_Url');
    let returnUrl = config.get('vnp_ReturnUrl');
    let orderId = moment(date).format('DDHHmmss');
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;

    let locale = req.body.language;
    if (locale === null || locale === '') {
        locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, {
        encode: false
    });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, {
        encode: false
    });

    res.redirect(vnpUrl)
}

// [GET] /order/return
module.exports.return = async (req, res) => {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let config = require('config');
    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, {
        encode: false
    });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    const order = await Order.findOne({
        _id: req.cookies.order
    })

    if (order) {
        for (const product of order.products) {
            const productInfo = await Product.findOne({
                _id: product.product_id
            }).select("title thumbnail sold")

            const soldNew = product.quantity + productInfo.sold
            await Product.updateOne({
                _id: product.product_id
            }, {
                sold: soldNew
            })

            product.productInfo = productInfo
            product.priceNew = productHelper.priceNewProduct(product)
            product.totalPrice = product.quantity * product.priceNew
        }

        order.totalQuantity = order.products.reduce((sum, item) => sum + item.quantity, 0)
        order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0)

        // const chart = await Chart.find().sort({createdAt: "desc"}).limit(1)
        // const chart = await Chart.findOne().sort({createdAt: "desc"})

        // const objectChart = {
        //     revenue: chart.revenue + order.totalPrice,
        //     sold: chart.sold + order.totalQuantity
        // }
        // const newChart = new Chart(objectChart)

        // await newChart.save()
    }

    await Cart.updateOne({
        _id: req.cookies.cartId
    }, {
        products: []
    })

    await Order.updateOne({
        _id: req.cookies.order
    }, {
        status: "processed"
    })

    res.clearCookie("order")

    if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

        res.render('order/success.jade', {
            order: order,
            code: vnp_Params['vnp_ResponseCode']
        })
    } else {
        res.render('order/success.jade', {
            order: order,
            code: '97'
        })
    }
}

// [GET] /order/refund
module.exports.refund = async (req, res) => {
    let desc = 'Hoan tien GD thanh toan';
    res.render('order/refund.jade', {
        title: 'Hoàn tiền giao dịch thanh toán'
    })
}

// [POST] /order/refund
module.exports.refundPost = async (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();

    let config = require('config');
    let crypto = require("crypto");

    let vnp_TmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnp_Api = config.get('vnp_Api');

    let vnp_TxnRef = req.body.orderId;
    let vnp_TransactionDate = req.body.transDate;
    let vnp_Amount = req.body.amount * 100;
    let vnp_TransactionType = req.body.transType;
    let vnp_CreateBy = req.body.user;

    let currCode = 'VND';

    let vnp_RequestId = moment(date).format('HHmmss');
    let vnp_Version = '2.1.0';
    let vnp_Command = 'refund';
    let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;

    let vnp_IpAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;


    let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

    let vnp_TransactionNo = '0';

    let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");

    let dataObj = {
        'vnp_RequestId': vnp_RequestId,
        'vnp_Version': vnp_Version,
        'vnp_Command': vnp_Command,
        'vnp_TmnCode': vnp_TmnCode,
        'vnp_TransactionType': vnp_TransactionType,
        'vnp_TxnRef': vnp_TxnRef,
        'vnp_Amount': vnp_Amount,
        'vnp_TransactionNo': vnp_TransactionNo,
        'vnp_CreateBy': vnp_CreateBy,
        'vnp_OrderInfo': vnp_OrderInfo,
        'vnp_TransactionDate': vnp_TransactionDate,
        'vnp_CreateDate': vnp_CreateDate,
        'vnp_IpAddr': vnp_IpAddr,
        'vnp_SecureHash': vnp_SecureHash
    };

    request({
        url: vnp_Api,
        method: "POST",
        json: true,
        body: dataObj
    }, function (error, response, body) {
        console.log(response);
    });
}

// [GET] /order/querydr
module.exports.querydr = async (req, res) => {
    let desc = 'truy van ket qua thanh toan';
    res.render('order/querydr.jade', {
        title: 'Truy vấn kết quả thanh toán'
    })
}

// [POST] /order/querydr
module.exports.querydrPost = async (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();

    let config = require('config');
    let crypto = require("crypto");

    let vnp_TmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnp_Api = config.get('vnp_Api');

    let vnp_TxnRef = req.body.orderId;
    let vnp_TransactionDate = req.body.transDate;

    let vnp_RequestId = moment(date).format('HHmmss');
    let vnp_Version = '2.1.0';
    let vnp_Command = 'querydr';
    let vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;

    let vnp_IpAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let currCode = 'VND';
    let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

    let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TxnRef + "|" + vnp_TransactionDate + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;

    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");

    let dataObj = {
        'vnp_RequestId': vnp_RequestId,
        'vnp_Version': vnp_Version,
        'vnp_Command': vnp_Command,
        'vnp_TmnCode': vnp_TmnCode,
        'vnp_TxnRef': vnp_TxnRef,
        'vnp_OrderInfo': vnp_OrderInfo,
        'vnp_TransactionDate': vnp_TransactionDate,
        'vnp_CreateDate': vnp_CreateDate,
        'vnp_IpAddr': vnp_IpAddr,
        'vnp_SecureHash': vnp_SecureHash
    };
    // /merchant_webapi/api/transaction
    request({
        url: vnp_Api,
        method: "POST",
        json: true,
        body: dataObj
    }, function (error, response, body) {
        console.log(response);
    });
}

// [POST] /order/create_payment_again
module.exports.paymentAgain = async (req, res) => {
    res.cookie("order", req.body.id)

    res.redirect(`/order/create_payment_url`)
}

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}