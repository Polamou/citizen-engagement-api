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
    req.bodyFiltered = _.pick(req.body, ['firstName', 'lastName', 'role']);
    next();
  },
  filterIssueReq: function(req, res, next) {
    req.bodyFiltered = _.pick(req.body, ['status','description','imageUrl', 'geolocation', 'tags']);
    next();
  },
  /*
   * This function validate the status change of an issue
   *
   */
  validateStatusChange: function(req, res, next) {
    const actualStatus = req.issue.status;
    let wantedStatus = req.body.status;
    if (_.isUndefined(wantedStatus)){
      return next();
    }
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
    if (_.includes(possibleOptions[actualStatus], wantedStatus) || actualStatus === wantedStatus) {
        return next();
    } else{
      return next(errors.unprocessableError("The status change from "+actualStatus+" to "+wantedStatus+" is not allowed."));
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
