const { json } = require("express");

class ApiFeatures {
    constructor(query,queryStr){  //queryStr here is keyword in this case
        this.query = query;
        this.queryStr = queryStr;
        // in url anything after ? is a query 
    }
    search(){
        const keyword = this.queryStr.keyword?{ // agar keyword mila hia  req.query se to keyword ki value(modify) ye kardo wrna kuch ni
            name:{
                $regex : this.queryStr.keyword,  // regular expression needed to match not exact one but to pateern also
                $options : "i" // case insensitive ABC=abc
            }
        }:{}
        // console.log(keyword)
        this.query = this.query.find({...keyword}) // .find({name:"mkeyword"})
        return this // ye poori class ko hi return krdia

    }
    filter(){
        // const queryKeyword =  this.queryStr // here queryStr is an object and in javascript all objects are passed through a reference ,so it any change in queryKeyword will lead to change in original queryStr(keyword) | actully queryKeyword ko iski value ni but reference mila hai

        const queryCopy =  {...this.queryStr} // lol just use spread operator now actual copy is made 
        // console.log(queryCopy)

        // Removing some fields for category | category(filter) and .find({name:keywords}) is kinda similar
        const removeFields =['keyword', 'page','limit']
        removeFields.forEach((key)=>{
            delete queryCopy[key]  // queryCopy(query) bhi ek aaray hoga

        })
        // console.log(queryCopy)

        // filter for price and rating
        
        let queryStr = JSON.stringify(queryCopy)
        // bracket ke ander wala sab replace ho jaaygea
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`)
        // console.log(queryStr)


        this.query = this.query.find(JSON.parse(queryStr))  // this.query mtlb ye whi hai Product.find() | but iss baar case insensitive

        return this

    }
    pagination(resultsPerPage){
        let currentPage = Number(this.queryStr.page) || 1
        const skip  = resultsPerPage *(currentPage-1)

        this.query = this.query.limit(resultsPerPage).skip(skip)

        return this

    }
}

module.exports = ApiFeatures;