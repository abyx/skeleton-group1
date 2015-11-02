var nodemailer = require('nodemailer');

module.exports = {
    sendmail: function (to,subject,message) {

        
        // create reusable transporter object using SMTP transport
        var transporter = nodemailer.createTransport({
            host: 'smtp.mail.com',
            auth: {
                user: 'fredgeorge123@mail.com',
                pass: 'fredgeorge'
            }
        });

        

        // NB! No need to recreate the transporter object. You can use
        // the same transporter object for all e-mails

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: 'Fred Foo ✔ <fredgeorge123@mail.com>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: message, // plaintext body
            html: '<b>' + message + '</b>' // html body
        };

        


        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log('send mail error' +  error);
            }
            console.log('Message sent: ' + info.response);
        });

        
    }
};





