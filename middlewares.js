const _ = require('lodash');
const errors = require('./errors');
const User = require('./models/user');
const Issue = require('./models/issue');

module.exports = {
  findUserById: function(req, res, next) {
    User.findById(req.params.id).exec(function(err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        return next(errors.notFound('No User found with ID '+req.params.id));
      }
      req.user = user;
      next();
    });
  },
  filterUserReq: function(req, res, next) {
    req.filteredBody = _.pick(req.body, ['firstName', 'lastName', 'role']);
    next();
  },
  /*
   * This function validate the status change of an issue
   *
   */
  validateStatusChange: function(req, res, next) {
    const actualStatus = req.issue.status;
    const wantedStatus = req.body.status;
    const possibleOptions = {
      "new": [
        "inProgress",
        "canceled"
      ],
      "inProgress": [
        "canceled",
        "completed"
      ]
    }
    if (!_.includes(possibleOptions[actualStatus], wantedStatus)) {
        next(errors.unprocessableError("The status change from "+actualStatus+" to "+wantedStatus+" is not allowed."));
    } else{
      next();
    }
  },
  findIssueById: function(req, res, next) {
    Issue.findById(req.params.id).exec(function(err, issue) {
      if (err) {
        return next(err);
      } else if (!issue) {
        return next(errors.notFound('No issue found with ID ' + req.params.id));
      }
      req.issue = issue;
      next();
    });
  }
}
