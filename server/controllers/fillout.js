const filloutAdapter = require('../adapters/filloutAdapter')
const {filloutApiSchema} = require('../middleware/schemas')
const formsPath = '/api/forms/'
const submissionsPath = '/submissions';
const filterResponse = async (responseId,params)=>{
    let filters = {}
    let limit = params.limit
    let offset = params.offset;
    //easier to try and filter once than to try and filter an unknown amount of times to calculate responses. 
    delete params.limit;
    delete params.offset;
    if(params.filters){
        filters = params.filters;
        delete params.filters;
    }
    let {error, value} = filloutApiSchema.validate(params)
    if(error){
        console.error(error)
        let errorResponse = {message:"validation Error", error:error.details[0].message, status:400}
        throw  new Error(errorResponse);
    }
    let path = formsPath + responseId + submissionsPath;
    let result = await filloutAdapter.fetchResult(path,value);
    if(filters.length>0){
        result =  await filterResults(result, filters);
        if(limit  && result.pageCount>1 && result.responses.count<limit){
            params.filters = filters;
            params.offset = params.offset;
            params.limit = limit;
            result = await filterResponse(responseId, params);
        }
    }
    result.totalResponses = result.responses.length;
    result.pageCount = Math.ceil(result.responses.length/limit) || 1;
    if(limit || offset){
        let sliceEnd = result.totalResponses;
        if(limit && offset){
            sliceEnd = limit + offset
        }
        else if(limit){
              sliceEnd = limit
        }
        let sliceStart = offset ?? 0;
        result.responses = result.responses.slice(sliceStart, sliceEnd);
    }
    return result;
}

const filterResults = (async(result, filters)=>{
    let tempResult = result;
    console.log(result);
    for(var filter in filters){
        switch(filters[filter].condition){
            case 'equals':
                tempResult.responses = tempResult.responses.filter((response)=>response.questions.some((question)=>question.id == filters[filter].id && filterEqualQuestionVal(filters[filter], question)))
                break;
            case 'greater_than':
                tempResult.responses = tempResult.responses.filter((response)=>response.questions.some( (question)=>question.id == filters[filter].id &&  filterGreaterThanQuestionVal(filters[filter], question)))
                break;
            case 'less_than':
                tempResult.responses = tempResult.responses.filter((response)=>response.questions.some( (question)=>question.id == filters[filter].id &&  filterLessThanQuestionVal(filters[filter], question)))
                break;
            case 'does_not_equal':
                tempResult.responses = tempResult.responses.filter((response)=>response.questions.some((question)=>question.id == filters[filter].id &&  filterDoesNotEqualQuestionVal(filters[filter], question)))
                break;
        }
    }
    return tempResult;
})

const filterEqualQuestionVal=((filter,question )=>{
    if(question.type=="DatePicker" || question.type=="DateTimePicker"){
        question.value = new Date(question.value);
    }
    let result = question.value == filter.value
    return result

})

const filterGreaterThanQuestionVal=((filter,question )=>{
    if(question.type=="DatePicker" || question.type=="DateTimePicker"){
        question.value = new Date(question.value);
        filter.value = new Date(filter.value);
    }
    return question.value > filter.value
})

const filterLessThanQuestionVal=((filter,question )=>{
    if(question.type=="DatePicker" || question.type=="DateTimePicker"){
        question.value = new Date(question.value);
        filter.value = new Date(filter.value);
    }
    let result = question.value < filter.value;
    return result
})

const filterDoesNotEqualQuestionVal=((filter,question )=>{
    if(question.type=="DatePicker" || question.type=="DateTimePicker"){
        question.value = new Date(question.value);
    }
    let result = question.value != filter.value;
    return result

})

module.exports={
    filterResponse
}