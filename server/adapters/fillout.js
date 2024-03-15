const baseUrl = 'https://api.fillout.com/v1'

const fetchResult = (async(path, query) =>{
    try{
        
        let queryParams = '';
        if(query){queryParams = '?'}
        for(var param in query){
            if(param == 'afterDate'|| param == "beforeDate"){
                console.log(param)
                console.log(query[param]);
                query[param] =  query[param].toISOString()
            }
            queryParams +=param + '=' + query[param]+ '&'
        }
        queryParams = queryParams.substring(0, queryParams.length-1);
        headerset = {
            "Authorization": "Bearer " + process.env.FILLOUT_TOKEN
        }
        console.log(queryParams);
        const res  = await fetch(baseUrl + path + queryParams, { 
            method:"GET",
            headers:headerset
        })
        const results = await res.json();
        console.log(results);
        return results;
    }
    catch(err){
        console.error(err);
    }
})


module.exports = {
    fetchResult
}