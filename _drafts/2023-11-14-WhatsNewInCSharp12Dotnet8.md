---
title: 
header:    
    teaser: 
excerpt: 
published: false
tags: []
cover-img: /assets/img/path.jpg
thumbnail-img: /assets/img/thumb.png
share-img: /assets/img/path.jpg
---

Hey there, fellow developers! We've got some exciting news to share. .NET 8 and C# 12 are here, and they're shaking things up in the software development world. In this blog, we're going to take a casual stroll through the new language features in C# 12 and explore the impactful changes that .NET 8 brings to the table.

But here's the deal – we're not going to get too technical or formal. This is a laid-back chat about the cool stuff you can do with these new tools. We're going to break it down and see how these updates can make your coding life more fun, efficient, and productive.

So, grab a coffee, get comfy, and join us as we dive into the world of .NET 8 and C# 12. It's going to be a blast, and we promise, no boring jargon here!

## What's new in C# 12?
First up, we'll be exploring the world of C# 12, where we'll uncover some fantastic enhancements. We'll break down the concept of **Primary constructors** and see how they simplify object initialization and reduce boilerplate code. Then, we'll dig into the world of **Collection expressions**, exploring how they allow for more expressive and efficient collection initialization. And to top it off, we'll discuss the introduction of **Optional parameters in lambda expressions**, a feature that offers newfound flexibility in your code.

### Primary constructors
Primary constructors for classes are created to make the signature of a record and class more consistent. They are a new way to declare a constructor for a class or struct.
```csharp
public class A(int x, string y) { }
```
The behavior of these parameters differs from record types. You can see that in the naming convention of the parameters. All parameters are in scope throughout the class or struct declaration but aren't available to be accessed from the outside. For example, in the code snippet below, an instance of the class A is created but when you try to access the properties x and y, you will get an error.
```csharp
public void Test() 
{
    var aClass = new A(1, "test");
    var accessA = aClass.x; // error
}
```
To make the values available outside of the scope of the declaration, you can assign them to fields or properties.
```csharp
public class A(int x, string y) 
{
    public int X { get; } = x;
    public string Y { get; } = y;
}
```

When you use a primary constructor and you want to introduce a second constructor, you are required to use the primary constructor in the second constructor. This is done by using the this keyword. Parameters that are used in the second constructor are not available in the scope of the class or struct declaration.

```csharp
public class A(int x, string y) 
{
    public int Foo => foo; // error
    public A(int foo) : this(foo, string.Empty) { }
}
```




-- JSON SERIALIZATION / DESERIALIZATION
=default behaviour for primary constructors
<!-- There are circumstances in which constructors do not run. For example, `default(StructType)` will produce an instance of `StructType` without running any of its constructors. In those cases, despite no constructor being invoked (Section [§9.2.5](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/variables#925-value-parameters), all captured constructor parameters of that struct-type come into existence when the instance is created, and are all initialized with the default value for their respective types. -->
= 

### Collection expressions

### Optional parameters in lambda expressions



## What's New in .NET 8?
Moving on to .NET 8, we'll uncover some remarkable additions and improvements. We'll start by diving into **Read-only properties**, which enable you to create more secure and maintainable code. Then, we'll unveil the world of **Non-public members**, a feature that enhances encapsulation and code organization.

Next, we'll explore **Time abstraction**, a topic that can drastically improve how you work with time-related functions in your applications. We'll also delve into **Data validation**, a critical aspect of robust software, and see how .NET 8 makes it easier than ever.

Lastly, we'll examine **Performance improvements**, as speed and efficiency are always a developer's best friends.
 
### Read only properties
### Non-public members

### Time abstraction

### Data validation

### Performance improvements

