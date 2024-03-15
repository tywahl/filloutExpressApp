const Joi = require('joi')

const filterObject = Joi.object({
    "id":Joi.string().required(),
    "condition":Joi.string().valid("equals", "does_not_equal", "greater_than", "less_than").required(),
    "value":[Joi.string(), Joi.number()]
})

const filteredResponseValidatorSchema = Joi.object().keys({
    "limit": Joi.number().optional(),
    "afterDate": Joi.date().iso().optional(),
    "beforeDate":Joi.date().iso().optional(),
    "offset":Joi.number().optional(),
    "status":Joi.string().valid("in_progress", "finished").optional(),
    "includeEditLink": Joi.boolean().optional(),
    "sort":Joi.string().valid("asc", "desc").optional(),
    "filters":Joi.array().items(filterObject).optional()
})

module.exports={
    filteredResponseValidatorSchema
}