---
title: Secret management in .NET core with Hashicorp Vault
header:
    overlay_image: ../../assets/images/blogheader.jpg
tagline: This blog will give an introduction into secretmanagement and how you can use Hashicorp Vault with .Net Core 
published: true
categories: [Security, Secrets]
tags: [.NET Core, Vault]
---


Almost every application uses secrets to access secured parts of the software landscape. A secret can be something like a client secret, database credentials or other sensitive data. I think that almost everyone can relate to me when I say that keeping secrets in config files with the rest of your code base is a very "easy" solution for keeping your secrets. A sentence that I have heared a lot when it comes to keeping secrets in your code base is:

> 'Why not, the only persons that can access our code base is our team self.'

This was something that I told myself too, but keeping your secrets in configuration files doens't only mean that they are stored in the repository. Deploying software means putting your code in a place where it can run including all the configuration files that are necesarry to run your software. So when you deploy software to a test, acceptance and production environment means three more places of where your secrets are stored.

Software that is deployed is vulnerable for hacking attempts and you can try as hard as you can, but hackers will eventually be able to access your environment and have access to all of your secrets. In this way, they immediatly have access to your database or other secured parts of your software landscape.

There are many best practices that can prevent hackers to get access to your environment, but what if they get through en get access to your environment? In this blog I will tell you the basics of  secret management in .Net Core using [Hashicorp Vault](https://www.vaultproject.io/).


At first we have to deploy Vault. For development purposes Vault has a 'dev' server mode which doesn't require additional settings.This blog won't go into all the settings that are required for setting up Vault, this blog will fully focus on the use of Vault in .Net Core.

To make it easy for you I created a [demo project](https://github.com/tom171296/SecretManagement-NetCore-Vault) where I placed a docker file that you can use to start a Vault instance in dev mode.



    - policies
    - authorization
- Statische secrets .Net Core
- Dynamische secrets (Database)


