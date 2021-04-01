import https from 'https';
import axios from 'axios';
const NodeCache = require( "node-cache" );

const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );
const agent = new https.Agent({
  rejectUnauthorized: false,
});
class circuitBreaker {
    constructor(request) {
      this.request = request
      this.state = "CLOSED"
      this.failureThreshold = 3
      this.failureCount = 0
      this.successThreshold = 2
      this.successCount = 0
      this.timeout = 6000
      this.nextAttempt = Date.now()
    }
    async fire() {
      if (this.state === "OPEN") {
        if (this.nextAttempt <= Date.now()) {
          this.state = "HALF"
        } else {
          throw new Error("Breaker is OPEN")
        }
      }
      try {
        let response = await this.request
        //console.log(response.data)
        return this.success(response)
      } catch (err) {
        return this.fail(err)
      }
    }
  
    // async fire(api) {
    //   if (this.state === "OPEN") {
    //     if (this.nextAttempt <= Date.now()) {
    //       this.state = "HALF"
    //     } else {
    //       throw new Error("Breaker is OPEN")
    //     }
    //   }
    //   try {
    //     const response =await  axios.get(api, {httpsAgent: agent})
    //     return this.success(response)
    //   } catch (err) {
    //     return this.fail(err)
    //   }
    // }
    success(response) {
      if (this.state === "HALF") {
        this.successCount++
        if (this.successCount > this.successThreshold) {
          this.successCount = 0
          this.state = "CLOSED"
        }
      }
      this.failureCount = 0
  
      this.status("Success")
      return response
    }
  
    fail(err) {
      this.failureCount++
    //   if(myCache.take("failurecount") === undefined)
    // {
    //     myCache.set("failurecount", 0, 1000);
    // }    
    // console.log(this.failureCount)
    //  console.log("cachevalue ,"+myCache.take("failurecount"))
    //   myCache.set( "failurecount",myCache.take("failurecount")+ this.failureCount );
      if (this.failureCount >= this.failureThreshold) {
        this.state = "OPEN"
        this.nextAttempt = Date.now() + this.timeout
      }
      this.status("Failure")
      return err
    }
  
    status(action) {
      console.table({
        Action: action,
        Timestamp: Date.now(),
        Successes: this.successCount,
        Failures: this.failureCount,
        State: this.state
      })
    }
  }
  
  
  module.exports = circuitBreaker