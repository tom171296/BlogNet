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

Enterprises are typically comprised of hundres, if not thousands, of applcations that are custom built or acquired from a third party. In order to support common business processes and data sharing across applications, these applications need to be integrated. But how do you do that when there is more than one cloud in which your applications are running. In this blog I will tell you about how you can build an **mesh based** integration platform that is based on the open standard **AMQP 1.0** and is able to connect different (cloud) environments together. 

# The vision
So when I look at a typical enterprise integration platform, I think of a centralized service bus or something like that. At least there is something in a central place that handles all the integration for me. Usually this platform is managed by a team that has to serve the integration needs for an entire company. This causes the team to be fully overloaded with requests for new integrations.

One of the most important requirements in the vision is that it should be a decentralized platform. There should no longer be a team that is responsible for all the integrations within an enterprise. Integration should no longer be a single team responsibility. Each application team should be responsible for their own integration. This means a shift in the responsibilities. Where a centralized integration platform ususally focusses on OSI-layer 4 (TRANSPORT) a decentralized platform is moving that responsibilities up to layer 7 (APPLICATION). This means that each application itself is responsible for their integrations. This means keeping them safe and build-in resilience.

This can only be succesfull if all the applications that are going to connect to the platform will be able to keep there own pants up. The vision of the platform is that it should only serve as a data transport platform. There is no functionality like retries, queues or data transformation possibilites. This means that application are self responsible for resilience data transport. 

Another requirement is that the platform should decouple applications. A sender doesn't have to know where all the receivers are. 


# The platform
With this vision we are gonna build the platform. The technology that is used to build the platform is [Apache QPID dispatch routers](https://qpid.apache.org/components/dispatch-router/index.html). This is a high-performance, lightweight AMQP 1.0 message router. These software routers are forming the base of the platform. 

Each environment that should participate in the network needs to run at least two of these routers (for HA capabilities). So lets say we want to build the platform for AWS and Azure, then it would look like this. 

![PlatformBase](../assets/images/2021/IntegrationPlatform/PlatformBase.png)

These four routers will form the base of our platform. A router has a few modes where it can run in. The routers we deploy for the base of the platform are in interior mode. This mode allows a router to be part of the interior network of the platform. Interior routers establish connections with each other and automatically compute the lowest cost paths across the network. You can have up to 128 interior routers in the router network.

When a connection is established between routers, message traffic flows in both directions across that connection. Each connection has a client side (a connector) and a server side (a listener) for the purposes of connection establishment.

The QPID-dispatch routers support two types of routing messages. Each type of routing comes with properties that differ from the other type. The two different types of routing are message routing and linked routing.

## Message routing

## Linked routing

- Message-base routing vs Linked-base routing

**Benefits of the network**
## Challenges


# Supporting patterns

# Connecting your application
As part of the decentralized platform, each application team is going to participate in the network. 

# Whats next
Uitbreidings mogelijkheden op alle patronen en het platform