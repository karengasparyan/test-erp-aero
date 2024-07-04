import path from 'path';
import ejs from 'ejs';
import nodemailer from 'nodemailer';
import { EMAIL_FROM, EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_USER } from '../config';
import HttpError from 'http-errors';
import { Status } from '../types/Global';

export const sendEmail = async (email: string, content: object, ejsFile?: string) => {
  try {
    const htmlDirection = path.resolve('src', 'emailTemplates', `${ejsFile || 'email-template'}.ejs`);

    const html = await ejs.renderFile(htmlDirection, content);

    return nodemailer
      .createTransport({
        auth: {
          user: EMAIL_USER as string,
          pass: EMAIL_PASSWORD as string
        },
        secure: true,
        host: EMAIL_HOST as string,
        port: Number(EMAIL_PORT)
      })
      .sendMail({
        from: EMAIL_FROM,
        to: email,
        subject: 'Test task',
        html
      });
  } catch (e) {
    console.error(e);
    throw HttpError(Status.BAD_REQUEST, 'Email is not sent');
  }
};
