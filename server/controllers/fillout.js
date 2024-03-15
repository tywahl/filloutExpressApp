const filloutAdapter = require('../adapters/fillout')
const {filloutApiSchema} = require('../middleware/schemas')
const formsPath = '/api/forms/'
const submissionsPath = '/submissions';
const filterResponse = async (responseId,params)=>{
    let filters = {}
    console.log(params)
    let limit = params.limit
    let offset = params.offset;
    //easier to try and filter once than to try and filter an unknown amount of times to calculate responses. 
    delete params.limit;
    delete params.offset;
    if(params.filters){
        filters = params.filters;
        delete params.filters;
    }
    console.log(params);
    let {error, value} = filloutApiSchema.validate(params)
    if(error){
        console.error(error)
        let errorResponse = {message:"validation Error", error:error.details[0].message, status:400}
        return errorResponse;
    }
    let path = formsPath + responseId + submissionsPath;
    let result = await filloutAdapter.fetchResult(path,value);
    console.log(result);

    if(filters.length>0){
     result =  await filterResults(result, filters);
     //console.log(result);
        if(limit  && result.pageCount>1 && result.responses.count<limit){
            params.filters = filters;
            params.offset = params.offset;
            params.limit = limit;
            result = filterResponse(responseId, params);
        }
       
    }
    console.log('limit' + limit);console.log('offset:'+offset);
    result.totalResponses = result.responses.length;
    result.pageCount = Math.ceil(result.responses.length/limit) || 1;
    result.responses = result.responses.slice(offset-1, offset+limit);
    return result;
}


const filterResults = (async(result, filters)=>{
    console.log('filtering logic');

    let tempResult = result;
    for(var filter in filters){
        console.log(filters[filter]);
        switch(filters[filter].condition){
            case 'equals':
                console.log('filtering the condition is equals')
                tempResult.responses = tempResult.responses.filter((response)=>response.questions.some((question)=>question.id == filters[filter].id && filterEqualQuestionVal(filters[filter], question)))
                break;
            case 'greater_than':
                tempResult.responses = tempResult.responses.filter((response)=>response.questions.some( (question)=>question.id == filters[filter].id &&  filterGreaterThanQuestionVal(filters[filter], question)))
                break;
            case 'less_than':
                tempResult.responses = tempResult.responses.filter((response)=>response.questions.some( (question)=>question.id == filters[filter].id &&  filterLessThanQuestionVal(filters[filter], question)))
                break;
        }
    }
    return tempResult;
})

const filterEqualQuestionVal=((filter,question )=>{
    if(question.type=="DatePicker" || question.type=="DateTimePicker"){
        question.value = new Date(question.value);
        console.log(question.value);
    }
    let result = question.value == filter.value
    console.log(result);
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
    return question.value < filter.value
})

module.exports={
    filterResponse
}