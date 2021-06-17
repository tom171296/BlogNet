---
title: 5 steps to connect a qpid dispatch router to an azure service bus
header:    
    overlay_image: /assets/images/2021/ConnectQpidToServiceBus/blogheader.jpg
    teaser: 
tagline: Wondering how you can integrate a qpid dispatch router with azure service bus?
published: false
categories: [Cloud native, Integration, Open standard]
tags: [AMQP 1.0, QPID dispatch, Azure, Service bus]
---

Wondering how you can integrate a [qpid dispatch router](https://qpid.apache.org/components/dispatch-router/index.html) with [azure service bus](https://azure.microsoft.com/nl-nl/services/service-bus/)? But not sure what steps you need to take?

No problem. I've got you covered! In my blog [building a integration platform based on an open standard](https://blognet.tech/2021/BuildingAnIntegrationPlatformBasedOnAnOpenStandard/) I introduced the qpid dispatch router, so I will skip that in this blog.

In this post, I'll help you to connect a router to an azure service bus in just 5 steps. An example implementation can be found on my [github page]().

Let's get started:

# 1. Connection to azure
To connect the router to azure you need to define a `connector` in the routers configuration file. A connector has a three different types of roles.

- `Interior`: used to connect to another interior router;
- `Edge`: used to connect to an edge router;
- `route-container`: used to connect to an external AMQP container.

Because we want to connect to an external AMQP container (Azure service bus) we need to use the `route-container` role.

Beside the type of connection that we're going to create, we need to define the host address to which the router needs to create the connection. The host address can be found in the azure service bus in the azure portal.

![alt text](../../assets/images/2021/ConnectQpidToServiceBus/hostLocation.jpg "Vault architecture")

Combining the steps above will result in the following configuration: 

```
connector {
    name: azure-servicebus-connector
    role: route-container //connect to external AMQP container
    host: {Your-hostname-here}
    port: 5672 // Default AMQP port
}
```

# 2. Securing your connection
- azure certificaat
- Router certificaat
- SSL profile


# 3. Idle timeout

# 4. Azure service bus authentication

# 5. Autolink

# What's next


