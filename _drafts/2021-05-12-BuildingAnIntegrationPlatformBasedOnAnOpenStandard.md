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

Enterprises are typically comprised of hundres, if not thousands, of applications that are custom built or acquired from a third party. In order to support common business processes and data sharing across applications, these applications need to be integrated. But how do you do that when there is more than one cloud in which your applications are running. In this blog I will tell you about how you can build an **mesh based** integration platform that is based on the open standard **AMQP 1.0** and is able to connect different (cloud) environments together. 

# The vision
So when I look at a typical enterprise integration platform, I think of a centralized service bus or something like that. At least there is something in a central place that handles all the integration for me. Usually this platform is managed by a team that has to serve the integration needs for an entire company. This causes the team to be fully overloaded with requests for new integrations.

What if we can build a decentralized platform. There should no longe be a team that is responsible for all the integrations within an enterprise. Integration should no longer be a single team responsibility. Each application team should be responsible for their own integration. This means a shift in the responsibilities. Where a centralized integration platform ususally focusses on OSI-layer 4 (transport) a decentralized platform is moving that responsibilities up to layer 7 (application). This means that each application itself is responsible for their integrations and making sure that they happen the way that they want.

Thus a decentralized platform with which the team can manage integrations with other applications itself. We need to build a platform that should decouple applications as well. he sending application doens't necesarrily know what application ends up retrieving it, but it can be assured that the application that is receiving the information is interested in the information. When an application sends information, it doesn't randomly add the information to any channel available. It adds the information to a channel whose specific purpose is to communicate that sort of information. Channels are logical addresses in the messaging system.

Keeping in mind that in 2021 the amount of data that is being processed by applications is increasing more and more. Data gets a more important place in the IT world. The platform should be scalable to be able to process constantly getting bigger amounts of data. Sending more data over the platform should not result in a slower data flow. The platform should be smart enough to route high volume data in a way that it takes the shortest, less utilized route.

In short, the way I see this platform is that it has to be a decentralized platform, where every team can handle their own integration. At the same time, applications should be loosely coupled by the platform and should even be allowed to run in a whole different (cloud) environment. The platform is going to connect them and knows what application is interested in which data. The amount of data that is processed by the platform should not play a role. The solution should be able to scale on demand and above all should not slow down the more data is being processed. 

# QPID dispatch router
With this vision we are gonna build the platform. The technology that is used to build the platform is [Apache QPID dispatch routers](https://qpid.apache.org/components/dispatch-router/index.html). This is a high-performance, lightweight AMQP 1.0 message router. These software routers are forming the base of the platform. 

Each environment that should participate in the network needs to run at least two of these routers (for HA capabilities). So lets say we want to build the platform for AWS and Azure, then it would look like this. 

![PlatformBase](../assets/images/2021/IntegrationPlatform/PlatformBase.png)

These four routers will form the base of our platform. A router has a few modes where it can run in. The routers we deploy for the base of the platform are in interior mode. This mode allows a router to be part of the interior network of the platform. Interior routers establish connections with each other and automatically compute the lowest cost paths across the network. You can have up to 128 interior routers in the router network.

When a connection is established between routers, message traffic flows in both directions across that connection. Each connection has a client side (a connector) and a server side (a listener) for the purposes of connection establishment.

The QPID-dispatch routers support two types of routing messages. Each type of routing comes with properties that differ from the other type. The two different types of routing are message routing and linked routing.

## AMQP


## Message routing
With message routing the logic of transport is handled within the network. A message that is published on a channel 

## Linked routing

- Message-base routing vs Linked-base routing

**Benefits of the network**
## Challenges


# Supporting patterns

# Connecting your application
As part of the decentralized platform, each application team is going to participate in the network. 

# Whats next
Uitbreidings mogelijkheden op alle patronen en het platform