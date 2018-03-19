const _ = require('lodash');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const errors = require('./errors');
const User = require('./models/user');
const Issue = require('./models/issue');
const formatLinkHeader = require('format-link-header');



module.exports = {
  findUserById: function(req, res, next) {
    if (ObjectId.isValid(req.params.id)) {
      User.findById(req.params.id).exec(function(err, user) {
        if (err) {
          return next(err);
        } else if (!user) {
          return next(errors.notFound('No User found with ID ' + req.params.id));
        }
        req.user = user;
        next();
      });
    } else {
      return next(errors.unprocessableError(req.params.id + ' is not a valid ID.'));
    }
  },
  findIssueById: function(req, res, next) {
    if (ObjectId.isValid(req.params.id)) {
      Issue.findById(req.params.id).exec(function(err, issue) {
        if (err) {
          return next(err);
        } else if (!issue) {
          return next(errors.notFound('No issue found with ID ' + req.params.id));
        }
        req.issue = issue;
        next();
      });
    } else {
      return next(errors.unprocessableError(req.params.id + ' is not a valid ID.'));
    }
  },
  queryPaginate: function(resourceHref, query, total, req, res) {

    // Parse the "page" param (default to 1 if invalid)
    let page = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    // Parse the "pageSize" param (default to 100 if invalid)
    let pageSize = parseInt(req.query.pageSize, 10);
    if (isNaN(pageSize) || pageSize < 0 || pageSize > 100) {
      pageSize = 100;
    }
    // Apply skip and limit to select the correct page of elements
    query = query.skip((page - 1) * pageSize).limit(pageSize);

    // URL
    const links = {};
    const url = "https://polamou-citizen-engagement-api.herokuapp.com/" + resourceHref;
    const maxPage = Math.ceil(total / pageSize);

    // Add first & prev links if current page is not the first one
    if (page > 1) {
      links.first = {
        rel: 'first',
        url: `${url}?page=1&pageSize=${pageSize}`
      };
      links.prev = {
        rel: 'prev',
        url: `${url}?page=${page - 1}&pageSize=${pageSize}`
      };
    }

    // Add next & last links if current page is not the last one
    if (page < maxPage) {
      links.next = {
        rel: 'next',
        url: `${url}?page=${page + 1}&pageSize=${pageSize}`
      };
      links.last = {
        rel: 'last',
        url: `${url}?page=${maxPage}&pageSize=${pageSize}`
      };
    }

    // If there are any links (i.e. if there is more than one page),
    // add the Link header to the response
    if (Object.keys(links).length >= 1) {
      res.set('Link', formatLinkHeader(links));
    }

    return query;
  },
  filterUserReq: function(req, res, next) {
    req.bodyFiltered = _.pick(req.body, ['firstName', 'lastName', 'role']);
    next();
  },
  filterIssueReq: function(req, res, next) {
    req.bodyFiltered = _.pick(req.body, ['status', 'description', 'imageUrl', 'geolocation', 'tags', 'userId']);
    if (ObjectId.isValid(req.bodyFiltered.userId)) {
      next();
    } else {
      next(errors.unprocessableError(`userId : ${req.bodyFiltered.userId} is not valid.`));
    }
  },
  /*
   * This function validate the status change of an issue
   *
   */
  validateStatusChange: function(req, res, next) {
    const actualStatus = req.issue.status;
    let wantedStatus = req.body.status;
    if (_.isUndefined(wantedStatus)) {
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
    } else {
      return next(errors.unprocessableError("The status change from " + actualStatus + " to " + wantedStatus + " is not allowed."));
    }
  }
}
