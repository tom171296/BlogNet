---
title: Continuous validation
header:    
    overlay_image: 
    teaser: Getting grip on your non-functional requirements using the power of Azure
tagline: 
published: false
categories: []
tags: []
---

*Some short introduction*

As a software engineer I see a lot of project that have the focus on creating business functionality. A business functionality doesn't only consist of the functional requirements that we have to implement as software engineers. There is always a form of non-functional requirements that are as (if not more) important as the functional requirements, but are not treated that way.

Even if the functional requirements are all implemented perfectly, a software system can completely fail if the non-functional requirements like performance and availability are not met. This means that every time your architecture or code changes, you should verify that **all of your requirements** are still met. The process of continuously checking your non-functional requirements is called **continuous validation**.

##  Understanding non-functional requirements

Non-functional requirements (NFR's) define 'how' systems do what they do. This includes characteristics such as performance, security, maintainability, scalability and ease of use. 

Dealing with NFR's may seem like you're adding to your project's scope. However, NFR's are just as critical as functional epics, features and stories. They ensure the usability and the effectiveness of the entire system. Failing to meet any one of them can result in systems that fail to satisfy internal business, user or market needs. In some cases, non-compliance can cause significant legal issues (privacy, security, to name a few). 

Proper definition of NFR's is critical. Over-specify them and the solution may be too costly to be viable; under-specify or underachieve them, and the system will be inadequate for its intended use. 

In the context of continuous validation we'll focus on:

- the requirements that have impact on the performance of an application
- The scalability of an application
- How reliable is your architecture

<img src=../assets/images/2023/ContinuousValidation/nfrs.png height=500>

## The challenges of validating non-functional requirements

Like system requirements, NFR's must be tested and verified. Due to their scope, NFR tests require usually more that just simply running automated tests in the pipeline. Non-functional testing is all about testing that your systems behaves the way it should in the environment where it should. This means testing your requirements in a production(-like) environment where your NFR's should be met.

### Performance

Testing NFR's can be a hard process. Running a load for example. The results of a load test usually only consist user-side facing metrics like: 

- Request error rate
- Response time 

If all the test results are meeting the requirements than there is no issue. But if the response time is slower than the requirement. it can be hard to identify where the problem actually 



- Azure load testing

### Chaos

A second challenge are the reliability and scalability tests. For on premise environments, reliability and scalability are usually tested using simulated 'chaos'. This is usually done in a controlled environment where the chaos is also happening in a controlled way. Which means that the all that is occurring will be prepared and all the measure to fail over or survive the chaos are already in place.

The thing with controlled chaos is that you already know what is gonna happen and you are prepared to solve the chaos that is happening. This isn't a realistic scenario, because chaos never happens in a controlled way. For me, testing your reliability and scalability means creating real chaos and seeing how the system reacts to that. 

- Architecture chaos tests? usually simulated errors
- Usually taking a lot of time
- forgotten when architecture / code changes

- Azure Chaos Studio (preview)



## Continuous Validation

Continuous validation is integrating the validation of your NFR's into your CI/CD pipeline.

- Continuously testing your NFR's
- Integrating azure load testing with chaos studio
-    



## Strategies for Continuous Validation

- When should you run it
- Example pipeline
- 

## Conclusion

