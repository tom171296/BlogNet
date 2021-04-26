---
title: Building a mesh integration platform based on an open standard
header:    
    overlay_image: /assets/images/2021/HashicorpVault/blogheader.jpg
    teaser: /assets/images/2021/HashicorpVault/blogheader.jpg
tagline: Building a decentralized integration platform based on AMQP 1.0
published: false
categories: [Integration, Open standard]
tags: [Apache, QPID dispatch, AMQP 1.0]
---

Every large enterprise has the same problem. There are a lot of applications that need to communicate with eachother. But how do you do that when there is more than one cloud in which your applications are running. In this blog I will tell you about how you can build an **mesh based** integration platform that is based on the open standard **AMQP 1.0** and is able to connect different (cloud) environments together. 

**HET PROBLEEM** **iets met centralized integration platform**

# The vision
NOG VERWERKEN:
- Centralized vs Decentralized!!
- Layer 7 vs layer 4

I don't know about you guys, but the projects that I saw since I started with my job as a software developer where all very different. **The one team had it all together and where able to keep there own pants up but I also saw a lot of applications that where not able to keep there pants up by themself.** This applications were fully relying in the integration platform that they were using and even rely on the firewall to keep them safe. Building resilience applications is not as standard as you might think. 




This vision can only be succesfull if all the applications that are going to connect to the platform will be able to keep there own pants up. The vision of the platform is that it should only serve as a data transport platform. There is no functionality like retries, queues or data transformation possibilites. This means that application are self responsible for resilience data transport. 

The second part of the vision is that the platform should decouple applications from there cloud. The idea was is that an application in Azure can publish data and an application in AWS can consume the data. The doesn't sound very exciting. The thing that makes it exciting is that the publishing application doesn't have to know anything of the consuming applications. 

# Mesh network
So with the vision in mind the platform is formed. The technology that is used to build the platform is [Apache QPID dispatch routers](https://qpid.apache.org/components/dispatch-router/index.html). This is a high-performance, lightweight AMQP 1.0 message router. These software routers are forming the base of the platform. 

Each environment that should participate in the network needs to run at least two of these routers (for HA capabilities). So lets say we want to build the platform for AWS and Azure, then it would look like this. 

![PlatformBase](../assets/images/2021/IntegrationPlatform/PlatformBase.png)

These four routers will form the base of our platform. A router has a few modes where it can run in. The routers we deploy for the base of the platform are in interior mode. This mode allows a router to be part of the interior network of the platform. Interior routers establish connections with each other and automatically compute the lowest cost paths across the network. You can have up to 128 interior routers in the router network.

When a connection is established between routers, message traffic flows in both directions across that connection. Each connection has a client side (a connector) and a server side (a listener) for the purposes of connection establishment.

**Benefits of the network**

# Connecting your application
As part of the decentralized platform, each application team is going to participate in the network. 