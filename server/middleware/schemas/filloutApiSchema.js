const Joi = require('joi')

const filloutApiSchema = Joi.object().keys({
    "limit": Joi.number().optional(),
    "afterDate": Joi.date().iso().optional(),
    "beforeDate":Joi.date().iso().optional(),
    "offset":Joi.number().optional(),
    "status":Joi.string().valid("in_progress", "finished").optional(),
    "includeEditLink": Joi.boolean().optional(),
    "sort":Joi.string().valid("asc", "desc").optional()
})

module.exports = {
    filloutApiSchema
}