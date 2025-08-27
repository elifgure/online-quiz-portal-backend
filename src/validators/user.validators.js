const {body, param} = require("express-validator")

const updateRoleValidators = [
    param('id')
    .isMongoId()
    .withMessage('Geçersiz kullanıcı ID'),
    body('role')
    .isIn(['teacher', 'student', 'admin'])
    .withMessage('Rol teacher, student veya admin olmalıdır.')
]

module.exports = {
    updateRoleValidators
}