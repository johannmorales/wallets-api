module.exports = {
  generateUser: function (userContext, events, done) {
    const random = Math.floor(Math.random() * 10000000000);
    userContext.vars.email = `user${random}@example.com`;
    userContext.vars.password = `Pass${random}!`;
    return done();
  },
};
