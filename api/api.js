
/**
 * @swagger
 * resourcePath: /apiJs
 * description: All about API
 */

/**
 * @swagger
 * path: /authenticate
 * operations:
 *   -  httpMethod: POST
 *      summary: Login with username and passwordwuehcuehcucu
 *      notes: Returns a user based on username
 *      responseClass: User
 *      nickname: authenticate
 *      consumes: 
 *        - text/html
 *      parameters:
 *        - name: username
 *          description: Your username
 *          paramType: query
 *          required: true
 *          dataType: string
 *        - name: password
 *          description: Your password
 *          paramType: query
 *          required: true
 *          dataType: string
 */
exports.login = function (req, res) {
  var user = {};
  user.username = req.param('username');
  user.password = req.param('password');
  res.json(user);
};

/**
 * @swagger
 * models:
 *   User:
 *     id: User
 *     properties:
 *       username:
 *         type: String
 *       password:
 *         type: String    
 */