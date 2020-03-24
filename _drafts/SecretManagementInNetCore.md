---
title: Secret management in .NET core with Hashicorp Vault 
published: false
categories: [Security, Secrets]
tags: [NET Core, Vault]
---
Almost every application uses secrets to access secured parts of the software landscape. A secret can be something like a client secret or database credentials. I think that almost everyone can relate to me when I say that keeping secrets in config files with the rest of your code base is a very "easy" solution for keeping your secrets. A sentence that I have heared a lot when it comes to keeping secrets in your code base is:
> Why not, the only persons that can access our code base is our team self.