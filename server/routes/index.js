const express = require('express');
const validators = require("../middleware/validators");
const {filteredResponseValidatorSchema }= require("../middleware/schemas/filteredResponsesSchema")
var router = express.Router();

router.get('/:formId/filteredResponses',validators.validate(filteredResponseValidatorSchema) , async function(req, res, next){

  try{
    let formId = req.params.formId;
    console.log(req.value);
    //let filterParams = JSON.parse(decodeURIComponent(req.query.filters));
   // console.log(filterParams);
   // console.log(formId);

   // console.log(req);
    return res.send("accepted");
  }
  catch(err){
    console.error(err);
  }
})
module.exports = router;
