"use strict";
const nodemailer = require("nodemailer");

const generateResponse = (code, payload) => ({
  statusCode: code,
  headers: {
    "Access-Control-Allow-Origin": process.env.ALLOW_ORIGIN,
    "Access-Control-Allow-Credentials": true
  },
  body: JSON.stringify(payload)
});

module.exports.handler = async event => {
  const params = JSON.parse(event.body);

  // params validations
  if (!params || !params.subject) {
    return generateResponse(400, {
      message: "Provide a body param with the subject"
    });
  }
  if (!params || !params.text) {
    return generateResponse(400, {
      message: "Provide a body param with the text"
    });
  }

  const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  });

  const message = {
    from: process.env.FROM,
    to: process.env.TO,
    cc: process.env.CC,
    subject: params.subject,
    text: params.text
  };

  try {
    await transport.sendMail(message);
    return generateResponse(200, { message: "success" });
  } catch (e) {
    return generateResponse(400, { message: e });
  }
};
