module.exports = RSError => {
  return {
    DEFAULT: new RSError("Error Occured", "none", 500),
    AUTH_FAIL: new RSError("Authentication failed. Please try again.", "auth_fail", 401),
    DATE_FUTURE: new RSError("Date is in future", "date_future", 400),
    PWD_SEND_DIFFERENT: new RSError(
      "Please send different new password",
      "pwd_send_different",
      400
    ),
    PWD_NOTMATCH: new RSError("Old password does not match.", "pwd_notmatch", 400),
    TOKON_REQ: new RSError("Must send access_token", "token_req", 400),
    USER_NOEXISTS: new RSError("User does not exists.", "user_noexists", 400)
  };
};
