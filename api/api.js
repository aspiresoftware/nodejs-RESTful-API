
/**
 * @swagger
 * resourcePath: /apiJs
 * description: All about API
 */

/**
 * @swagger
 * path: /api/v1/authenticate
 * operations:
 *   -  httpMethod: POST
 *      summary: Login with username and password
 *      notes: Returns a user based on username
 *      responseClass: AuthToken
 *      nickname: authenticate
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: username
 *          description: Enter your username
 *          paramType: basic
 *          required: true
 *          dataType: string
 *        - name: password
 *          description: Enter your password
 *          paramType: basic
 *          required: true
 *          dataType: string
 *        - name: body parameter
 *          description: For new Authentication "grantType"="password". To get new auth token "grantType"= "accessToken"
 *          paramType: body
 *          required: true
 *          dataType: string
 */

/**
 * @swagger
 * models:
 *   AuthToken:
 *     id: AuthToken
 *     properties:
 *        id:
 *         type: integer
 *        user_id:
 *         type: integer
 *        accessToken:
 *         type: string
 *        refreshToken:
 *         type: string
 *        ipAddress:
 *         type: string
 *        userAgent:
 *         type: string
 *        createdAt:
 *         type: timestamp
 *        updatedAt:
 *         type: timestamp
 * 
 */

/**
 * @swagger
 * path: /api/v1/user
 * operations:
 *   -  httpMethod: POST
 *      summary: Create new user / Register User
 *      notes: Return a created user detalis
 *      responseClass: User
 *      nickname: Create User
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: username
 *          description: Enter your username
 *          paramType: string
 *          required: true
 *          dataType: string
 *        - name: password
 *          description: Enter your password
 *          paramType: string
 *          required: true
 *          dataType: string
 *        - name: firstName
 *          description: Enter your first name
 *          paramType: string
 *          required: true
 *          dataType: string
 *        - name: lastName
 *          description: Enter your last name
 *          paramType: string
 *          required: true
 *          dataType: string
 */

/**
 * @swagger
 * models:
 *   User:
 *     id: User
 *     properties:
 *        id:
 *         type: integer
 *        username:
 *         type: string
 *        password:
 *         type: string
 *        firstName:
 *         type: string
 *        lastName:
 *         type: string
 *        isActivate:
 *         type: boolean
 *        isDeleted:
 *         type: boolean
 *        createdAt:
 *         type: timestamp
 *        updatedAt:
 *         type: timestamp
 * 
 */