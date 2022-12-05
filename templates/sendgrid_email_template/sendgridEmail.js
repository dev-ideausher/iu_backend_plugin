const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');


module.exports = class Email{
    constructor(user,otp){
        if(user.userType==='vendor'){
            this.to = user.email
        }else{
            this.to = user.username;
        }
        // this.to = user.username;
        this.otp = otp;
        this.from = `Idea Usher <${process.env.EMAIL_FROM}>`;
    }

    newTransport(){
        
        //sendgrid
        return nodemailer.createTransport({
            service:'SendGrid',
            auth:{
                user:process.env.SENDGRID_USERNAME,
                pass:process.env.SENDGRID_PASSWORD
            }
        });
    }

    async send(template,subject){
        // 1) Render Html template on a pug template
        const html = pug.renderFile(`./views/emails/${template}.pug`,
        {
            name:this.name,
            otp:this.otp,
            subject
        });

        // 2) Define email options
        const mailOptions = {
            from:this.from,
            to:this.to,
            subject:subject,
            html:html,
            // text:htmlToText.convert(html)
        }
        // 3) create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    };

    async sendWelcome(){
        await this.send('welcome','Welcome to the This web page');
    }

    async sendPasswordReset(){
        await this.send('passwordReset','Your password reset token (valid) for only 10min');
    }

    async forgotPasswordOTP(){
        await this.send("forgotPasswordOtp","Your forgot password OTP.")
    }
};