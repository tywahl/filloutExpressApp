const baseUrl = 'https://api.fillout.com/v1/api'

const fetch = (async(path, query) =>{
    try{
        let queryParams = '';
        if(query){queryParams = '?'}
        for(var param in query){
            queryParams +=param + '=' + query[param]+ '&'
        }
        queryParams.substring(0, queryParams.length);
        headerset = {
            "Authorization": "Bearer " + process.env.FILLOUT_TOKEN
        }
        const res  = await fetch(baseUrl + '/' + path + queryParams, { 
            method:"GET",
            headers:headerset
        })
    }
    catch(err){
        console.error(err);
    }
})