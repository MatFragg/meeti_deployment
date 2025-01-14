import nodemailer from 'nodemailer'
import emailConfig from '../config/email.js'
import fs from 'fs' //access to archives and their contents
import util from 'util' 
import ejs from 'ejs' // contains a method that compiles the archive and generate the email
import { fileURLToPath } from 'url';
import { dirname,join } from 'path';
import { Resend } from 'resend'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});


const sendEmail = async(options) => {
    console.log(options);

    // Read the mail archive
    const archivePath = join(__dirname,'..','views','emails',`${options.archive}.ejs`);

    // Compile
    const compiled = ejs.compile(fs.readFileSync(archivePath, 'utf8'));

    // Create the HTML
    const html = compiled({url: options.url});

    // Configure the email options
    const emailOptions = {
        from: 'Meeti <noreplay@meeti.com>',
        to: options.user.email,
        subject: options.subject,
        html // when value and key are the same , you could have only one (html: html)
    }

    // Send the mail
    const sendMail = util.promisify(transport.sendMail, transport);
    return sendMail.call(transport,emailOptions);
}
const resend = new Resend(process.env.RESEND_KEY);

const resendFunction = async (options) => {
    // Read the mail archive
    const archivePath = join(__dirname,'..','views','emails',`${options.archive}.ejs`);

    // Compile
    const compiled = ejs.compile(fs.readFileSync(archivePath, 'utf8'));

    // Create the HTML
    const html = compiled({url: options.url});
    const { data, error } = await resend.emails.send({
        from: 'Meeti <onboarding@resend.dev>',
        to: options.user.email,
        subject: options.subject,
        html
    });
    
    if (error) {
        return console.error({ error });
    }
    
    console.log({ data });
}

export {
    sendEmail,
    resendFunction
};


