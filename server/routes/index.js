const express = require('express');
const validators = require("../middleware/validators");
const {filteredResponseValidatorSchema }= require("../middleware/schemas")
const filloutController = require('../controllers/fillout')
var router = express.Router();

router.get('/:formId/filteredResponses',validators.validate(filteredResponseValidatorSchema) , async function(req, res, next){

  try{
    let formId = req.params.formId;
    console.log(process.env.FILLOUT_TOKEN);
    const result =await filloutController.filterResponse(req.params.formId, req.value.query)
    console.log(result)
    //let filterParams = JSON.parse(decodeURIComponent(req.query.filters));
   // console.log(filterParams);
   // console.log(formId);

   // console.log(req);
    return res.json(result);
  }
  catch(err){
    console.error(err);
  }
})
module.exports = router;
