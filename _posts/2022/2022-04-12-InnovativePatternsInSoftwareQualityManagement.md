---
title: Innovative patterns in software quality management
header:    
    teaser: /assets/images/2022/InnovativePatternsInSoftwareQualityManagement/blogheader.png
tagline: Setting the next step in software quality management
published: true
categories: [Software development, CI/CD, Software quality management]
tags: [Production testing, Software development pipeline]
---

*This is the first blog in a series about innovative patterns in software quality management. In this blog I will give you an introduction into testing software in production. Each next blog will zoom in into a specific part of the software development pipeline that touched by the idea of testing software in production.*

The software development pipeline tradionally consists of the following steps:
- Building/running tests via a CI/CD pipeline;
- Deploying your software to a test environment;
- Testing your software;
- Deploying your software to an acceptance/staging environment;
- Doing acceptance testing;
- Deploying and releasing your software to production.

This process is developed in the years in which we ran our software on physical machines. There we had to be sure that our software worked as expected before we deployed it to the next stage. This process usually took a lot of time and effort.

# Need for speed
The current world of software development is demanding more and more speed each day. As a company you have to be able to deliver software faster than the competition. Building software faster will result in getting keeping customers satisfied and attracting new customers. That means more income. 

Building and releasing software faster should not result in more bugs in the software, because there is nothing more irritating for a customer as a not working product. If a customer notices and suffers under a lot of bugs, he will not be happy and might go to the competition. That is why we still need to have a process that ensures that our software is working as expected. 

Many organisations do not use the possibilities offered by the cloud to speed up this process. Making full use of the cloud opens many doors for you and your organization. In my eyes the next step in software development is getting rid of your test and acceptance environment and start **testing your software in production!**. In this blog and the rest of the serie I will introduce you in all the posibilities that the cloud offers.

# Testing in production
If you read this than I haven't scared you with the crazy idea of testing software in production (TIP), great! I will explain why and what I mean with this because it isn't as radical as you might think.

TIP is a software development practice in which new code changes are tested on live user traffic rather than in a staging environment. It is one of the testing practices found in continous delivery. This means that new features are deployed on the production environment without first deploying it to a staging or any other environment.

As a team or organization you should strive for TIP to take the next step in software development, because:
-  Using TIP will **increase the quality** of your software. You have to be sure that your software works before releasing it and TIP will help you to make sure that the software works in production. 
- Deploying software immediatly to production will **increase the speed** of your process. No more staging environments where acceptance testing is done but immediatly delivery and feedback from the people who are actually gonna work with your product. 
- It will **decrease your costs**. The initial investment of setting up for TIP is more expensive than sticking to the status quo. But on the long term TIP will decrease your costs because you no longer have different environments that you have to host and perform operations on.

In short, every organization that wants to take the next step in software quality management should adopt TIP and break up with their 'old' staging environment.

# Break up letter
Dear staging, I can't do this anymore. It's not me, it's you. 

## You're expensive
"You're to expensive. Everything that you need is double. I have to buy everything twice to keep you satisfied. You're not only expensive in your needs but also in your livelihood. Getting your hair done, your nails, nose, eyebrows and everything else costs me a fortune."

Taking care of your staging environment costs a lot of money. Beside the double hosting costs, you have to buy your licenses at least twice (production and staging). That's not all, you have to perform operations on at least two environments. This will cost you a lot of time and money. 

Therefor, dear staging, it's best if we split up.

## I can test better
"Whenever I try to figure somehting out with you it's hard. You don't have the same characteristics or capacity than that beautiful production environment."

Testing software on your staging environment doesn't give you the confidence that it's works on production. The only thing that you can be sure of is that your functionality works. Beside testing your software, searching for a bug is most of the time also much harder in a staging environment because you don't have the same configuration or data as the production environment. This makes it hard to reproduce edge case situations that require real data.

Therefor, I know I can do better than you.

## You're not production
"Nobody cares about you. If you're not working on a friday afternoon, no one will stay in to fix that. No one will wake up in the middle of the night to take care of you if there is anything wrong."

Like described above, no one cares if your staging environment has some errors or isn't available. The only time we will fix you is when we need something tested in that environment. Therefor, why should we spend time on something we don't really care about. 

Maybe it's for the best if you just leave.

# Production testing & challenges
I hope that you got as much excited about TIP as I am. But before you get started you should realize that adopting TIP isn't a easy proces. It's a continous delivery pattern that allows you to ship new features as fast as possible but it requires a certain level of maturity from your development team(s).

Testing your software in the production environment comes with a lot of challenges. These challenges are normally mitigated because you do your acceptance testing in the staging environment. Some of these challenges are:
- Manage your test data. You don't want to pollute your production data with testing data.
- How do you make sure your customers/users do not suffer from your testing?
- Does your functionality actually lend itself for TIP?

Each next blog will touch some part of the software development pipeline where I tell you about the challenges that you will face and how you can solve them. This solutions will meanly be described and implemented using Microsoft's Azure cloud services.

# Summary
Testing in production is a software development practice that allows you to test your software in production. It is a continous delivery practice that allows you to ship new features as fast as possible but it requires a certain level of maturity from your development team(s). 
In this blogserie I will introduce you to the different stages of the software development pipeline and the challenges that you need to overcome to take the next step in software quality management.