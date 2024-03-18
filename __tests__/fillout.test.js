
jest.mock('../server/adapters/filloutAdapter');
const filloutAdapter = require('../server/adapters/filloutAdapter');
const filloutController = require('../server/controllers/fillout')

const mockFetchResults = jest.spyOn(filloutAdapter, 'fetchResult')
describe('filter responses', ()=>{
    beforeEach(() => {
        jest.resetModules();
      });
    test('should not filter if query values are bad', async()=>{
       
        let queryParams = {
           status: "broken"
        }
        return  expect(filloutController.filterResponse("qe12345", queryParams)).rejects.toThrowError();
    });
    test('results should return full if no filter and limit not hit', async()=>{
        const mockResultList = jest.fn(async()=>{
            return  require('../server/adapters/mockData/fullResponse.json')
        })
        mockFetchResults.mockImplementation(mockResultList);
        const queryParams = {}
        let result =  filloutController.filterResponse("qe12345", queryParams).then((result)=>{
            expect(result.totalResponses).toEqual(2)
        })
        return result;
    });
    test('results should filter to equals value', async()=>{
        const mockResultList = jest.fn(async()=>{
            return  require('../server/adapters/mockData/fullResponse.json')
        })
        mockFetchResults.mockImplementation(mockResultList);
        let queryParams1 = {
            limit : 1,
            filters:[{
                id:"nameId",
                condition:"equals",
                value:"Johnny"
            }]
        }
        let result1 = await filloutController.filterResponse("qe12345", queryParams1)
            filloutAdapter.fetchResult.mockClear();
            expect(result1.totalResponses).toEqual(1)
            return;
    });
    it('results should return filter to greaterthan value',async()=>{
        const mockResultList = jest.fn(async()=>{
            return  require('../server/adapters/mockData/fullResponse.json')
        })
        mockFetchResults.mockImplementation(mockResultList);
        let queryParams2 = {
            limit : 1,
            filters:[{
                id:"birthdayId",
                condition:"greater_than",
                value:"2024-02-22T05:01:47.691Z"
            }]
        }
        let result2 = await filloutController.filterResponse("qe12345", queryParams2)
        expect(result2.totalResponses).toEqual(1);
        expect(result2.responses[0].questions[0].value).toEqual("Johnny")
        filloutAdapter.fetchResult.mockClear();
    })
    it('results should return filter to less than value', async()=>{
        const mockResultList = jest.fn(async()=>{
            return  require('../server/adapters/mockData/fullResponse.json')
        })
        mockFetchResults.mockImplementation(mockResultList);
        let queryParams3 = {
            filters:[{
                id:"birthdayId",
                condition:"less_than",
                value:"2024-03-22T05:01:47.691Z"
            }]
        }
        const result3 = await filloutController.filterResponse("qe12345", queryParams3)
        expect(result3.totalResponses).toEqual(1);
        expect(result3.responses[0].questions[0].value).toEqual("Timmy")
        filloutAdapter.fetchResult.mockClear();
    })
    test('results should filter to does not equal value', async()=>{
        const mockResultList = jest.fn(async()=>{
            return  require('../server/adapters/mockData/fullResponse.json')
        })
        mockFetchResults.mockImplementation(mockResultList);
        let queryParams4 = {
            filters:[{
                id:"nameId",
                condition:"does_not_equal",
                value:"Timmy"
            }]
        }
        const result4 =await filloutController.filterResponse("qe12345", queryParams4)
        expect(result4.totalResponses).toEqual(1);
        expect(result4.responses[0].questions[0].value).toEqual("Johnny")
        filloutAdapter.fetchResult.mockClear();
    })
})