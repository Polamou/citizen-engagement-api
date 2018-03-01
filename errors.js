// 404 Not Found
exports.notFound = function (message){
  let err = new Error(message);
  err.status = 404;
  return err;
}
exports.unprocessableError = function (message){
  let err = new Error(message);
  err.status = 422;
  return err;
}
