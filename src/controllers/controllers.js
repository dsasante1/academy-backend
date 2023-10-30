function createController(service, query, runQuerry) {
  // eslint-disable-next-line consistent-return
  return async (req, res, next) => {
    try {
      const response = await service(req.body, query, runQuerry);

      return res.status(response.code).json(response);
    } catch (error) {
      next(error);
    }
  };
}

function loginController(service, query, runQuerry) {
  // return async (req, res, next) => {
  // try {
  //   const
  // }
  // }
  return true;
}

module.exports = {
  createController,
  loginController,
};
