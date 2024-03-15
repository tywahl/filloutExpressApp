const express = require('express');
const validators = require("../middleware/validators");
const {filteredResponseValidatorSchema }= require("../middleware/schemas")
const filloutController = require('../controllers/fillout')
var router = express.Router();

router.get('/:formId/filteredResponses',validators.validate(filteredResponseValidatorSchema) , async function(req, res, next){

  try{
    let formId = req.params.formId;
    const result =await filloutController.filterResponse(req.params.formId, req.value.query)
    return res.json(result);
  }
  catch(err){
    console.error(err);
  }
})
module.exports = router;
