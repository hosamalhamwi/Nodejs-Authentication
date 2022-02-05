const { email_verification } = require("./email_verification/email_verification");
const { forgot_password } = require("./forgot_password/forgot_password");
const { forgot_verify } = require("./forgot_password/forgot_verify");
const { new_password } = require("./forgot_password/new_password");
const { google_QRCode } = require("./google_authenticator/google_QRCode");
const { google_verify } = require("./google_authenticator/google_verify");
const { sign_in } = require("./sign_in/sign_in");
const { sign_up } = require("./sign_up/sign_up");

module.exports = {
    email_verification,
    forgot_password,
    forgot_verify,
    new_password,
    google_QRCode,
    google_verify,
    sign_in,
    sign_up
}