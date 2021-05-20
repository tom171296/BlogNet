---
title: x steps to connect a qpid dispatch router to an azure service bus
header:    
    overlay_image: /assets/images/2021/ConnectQpidToServiceBus/blogheader.jpg
    teaser: 
tagline: 
published: true
categories: [Cloud native, Integration, Open standard]
tags: [AMQP 1.0, QPID dispatch, Azure, Service bus]
---

Wondering how you can integrate a [qpid dispatch router](https://qpid.apache.org/components/dispatch-router/index.html) with [azure service bus](https://azure.microsoft.com/nl-nl/services/service-bus/)? But not sure what steps you need to take?

No problem. I've got you coverd! In my blog [building a integration platform based on an open standard](https://blognet.tech/2021/BuildingAnIntegrationPlatformBasedOnAnOpenStandard/) I introduced the qpid dispatch router, so I will skip that is this blog.

In this post, I'll help you to connect a router to an azure service bus in just X steps.

But quick note first:

Each step that is described will first describe the step in a more generic way, so it is applicable for each broker/service that supports AMQP 1.0. At the end of each step, the specific implementation for the azure service bus is described.


Let's get started:

<center><h1>Step 1: creating</h1></center> 
