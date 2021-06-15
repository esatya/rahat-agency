module.exports = {
  APP_CONSTANTS: { PASSCODE_LENGTH: 6 },
  BACKUP: {
    PASSPHRASE_RULE: '"^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{12,})"',
    GDRIVE_FOLDERNAME: 'RumsanWalletBackups',
  },
  DB: {
    NAME: 'db_wallet',
    VERSION: 1,
    TABLES: {
      DATA: 'tbl_data',
    },
  },
};
