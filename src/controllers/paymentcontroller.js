const moment = require('moment');
const querystring = require('qs');
const crypto = require('crypto');
import axios from 'axios';
import orderApiService from '../service/orderApiService';

// Định nghĩa hàm sortObject
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
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
}

const checkout = async (req, res) => {
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let tmnCode = process.env.VNP_TMN_CODE;
    let secretKey = process.env.VNP_SECRET_KEY;
    let vnpUrl = process.env.VNP_URL;
    let returnUrl = process.env.VNP_RETURN_URL;
    let orderId = req.body.orderId;
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;

    let locale = req.body.language;
    if (!locale) {
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
    if (bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    // Gọi hàm sortObject để sắp xếp tham số
    vnp_Params = sortObject(vnp_Params);

    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac('sha512', secretKey);
    var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.json({ paymentUrl: vnpUrl });
};

const vnpReturn = async (req, res) => {
    const vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sortedParams = sortObject(vnp_Params);

    const secretKey = process.env.VNP_SECRET_KEY;
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
        const orderId = vnp_Params['vnp_TxnRef'];
        const transactionId = vnp_Params['vnp_TransactionNo'];
        const responseCode = vnp_Params['vnp_ResponseCode'];

        try {
            if (responseCode === '00') {
                const updateResult = await orderApiService.updateFunc(orderId, 'success', transactionId);
                if (updateResult.EC === 0) {
                    return res.redirect('http://localhost:3000/checkout/status?status=success');
                } else {
                    return res.json({
                        status: 'error',
                        message: 'Payment successful but failed to update order.',
                    });
                }
            } else {
                await orderApiService.updateFunc(orderId, 'failed');
                return res.redirect('http://localhost:3000/checkout/status?status=failed');
            }            
        } catch (error) {
            console.error(error);
            return res.json({
                status: 'error',
                message: 'An error occurred while processing the payment.',
            });
        }
    } else {
        return res.json({
            status: 'error',
            message: 'Invalid signature.',
        });
    }
};

const refund = async (req, res) => {
    try {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();

        // Lấy thông tin từ request
        const { orderId, transDate, amount, user } = req.body;

        if (!orderId || !transDate || !amount || !user) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required parameters.',
            });
        }

        // Kiểm tra điều kiện hoàn tiền
        let refundCheckResult = await orderApiService.checkRefundOrder(orderId);
        if (refundCheckResult.EC !== 0) {
            return res.status(400).json({
                EC: refundCheckResult.EC,
                EM: refundCheckResult.EM,
                DT: refundCheckResult.DT,
            });
        }

        // Lấy thông tin cấu hình
        const tmnCode = process.env.VNP_TMN_CODE;
        const secretKey = process.env.VNP_SECRET_KEY;
        const vnp_Api = process.env.VNP_API_URL;

        const vnp_RequestId = moment(date).format('HHmmss');
        const vnp_Version = '2.1.0';
        const vnp_Command = 'refund';
        const vnp_TransactionType = '02';
        const vnp_OrderInfo = `Hoan tien GD ma: ${orderId}`;
        const vnp_Amount = amount * 100;
        const vnp_TransactionNo = '0';

        const vnp_IpAddr =
            req.headers['x-forwarded-for'] ||
            req.connection?.remoteAddress ||
            req.socket?.remoteAddress ||
            req.connection?.socket?.remoteAddress;

        const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

        // Tạo dữ liệu để ký
        const data = [
            vnp_RequestId,
            vnp_Version,
            vnp_Command,
            tmnCode,
            vnp_TransactionType,
            orderId,
            vnp_Amount,
            vnp_TransactionNo,
            transDate,
            user,
            vnp_CreateDate,
            vnp_IpAddr,
            vnp_OrderInfo,
        ].join('|');

        const hmac = crypto.createHmac('sha512', secretKey);
        const vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest('hex');

        // Tạo body request
        const dataObj = {
            vnp_RequestId,
            vnp_Version,
            vnp_Command,
            vnp_TmnCode: tmnCode,
            vnp_TransactionType,
            vnp_TxnRef: orderId,
            vnp_Amount,
            vnp_TransactionNo,
            vnp_CreateBy: user,
            vnp_OrderInfo,
            vnp_TransactionDate: transDate,
            vnp_CreateDate,
            vnp_IpAddr,
            vnp_SecureHash,
        };

        // Gửi request refund
        const response = await axios.post(vnp_Api, dataObj, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.data && response.data.vnp_ResponseCode === '00') {
            await orderApiService.refundOrder(orderId);
            return res.json({
                EC: 0,
                EM: 'Refund successful.',
                DT: response.data,
            });
        } else {
            return res.status(400).json({
                EC: 1,
                EM: 'Refund failed.',
                DT: response.data,
            });
        }
    } catch (error) {
        console.error('Refund Error:', error.message || error);
        return res.status(500).json({
            EC: 1,
            EM: 'An error occurred during the refund process.',
            DT: '',
        });
    }
};

module.exports = {
    checkout,
    vnpReturn,
    refund,
};
