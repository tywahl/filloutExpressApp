const Joi = require('joi');

const validate = (schema)=>{
    return(req, res, next)=>{
        let query = req.query;
        if(query.filters){
            query.filters = JSON.parse(decodeURIComponent(req.query.filters));
        }
        const result = schema.validate(query)
        if(result.error){
            return res.status(400).json({message:"validation Error", error:result.error.details[0].message})
        }
        if(!req.value){
            req.value = {};
        }
        req.value['query'] = result.value;
        next();
    }
}

module.exports = {
    validate
}