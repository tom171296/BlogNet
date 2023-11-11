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

# Whats new in C# 12



## Primary constructors
Primary constructors for classes are created to make the signature of a record and class more consistent. They are a new way to declare a constructor for a class or struct.
```csharp
public class Person(string name){ } // Primary constructor
```

### Behavior

The behavior of these parameters differs from record types. You can see that in the naming convention of the parameters. All parameters are in scope throughout the class or struct declaration but aren't available to be accessed from the outside. Which means they behave like normal constructor parameters. For example, in the code snippet below, an instance of the class A is created but when you try to access the properties x and y, you will get an error.
```csharp
var person = new Person("Tom");
person.name // error, name is not a known property 
```
To make the values available outside of the scope of the declaration, you can assign them to fields or properties. When the parameter of the primary constructor is used in a function, a private field will be created.
```csharp
public class Person(string name) // Primary constructor
{ 
    public string Name { get; } = name; // Property initializer

    public void SayHello() {
        name = "Some person name"; // change private field
        Console.WriteLine($"Hello, {name}"); // access private field, 'Some person name'
        Console.WriteLine($"Hello, {Name}"); // access property, 'initial Person constructor value'
    } 
} 
```
### Creating more constructors

When you use a primary constructor and you want to introduce a second constructor, you are **required** to use the primary constructor in the second constructor. This is done by using the this keyword. Parameters that are used in the second constructor are not available in the scope of the class or struct declaration.

```csharp
public class Person(string firstname, string lastname) // Primary constructor
{ 
    public string FullName { get; } = $"{firstname} {secondCtorLastname}"; // Error on secondCtorLastname

    public Person(string secondCtorLastname) : this("Tom", secondCtorLastname) // Call primary constructor
    {
    }
}
```

### Inheritance

It is possible to inherit from a class that has a primary constructor. It isn't required that the derived class has a primary constructor. The derived class can use the 'normal' syntax for a constructor or it can use a primary constructor as well.
```csharp
public class SubPerson : Person
{
    public SubPerson(string lastname) : base("", lastname) // Call base constructor
    {
    }
}
```
```csharp
public class SubPerson(string lastname) : Person("", lastname) {} // with primary constructor
```

### Serialization / Deserialization
Serializing a class with a primary constructor in C# is a straightforward process, and it leverages the default behavior of JSON serialization. When you have a class with a primary constructor, the public properties defined within that class are automatically serialized to the JSON object during the serialization process.

Consider the person example 
```csharp
public class Person(string name)
{
    public string FullName { get; set; } = name;
}
```

When you serialize an instance of the Person class, the resulting JSON object will contain the FullName property, as shown in the following example:
```csharp
var person = new Person("Tom van den Berg");

var json = JsonSerializer.Serialize(person);
Console.WriteLine(json); // {"FullName":"Tom van den Berg"}

var personSerialized = JsonSerializer.Deserialize<Person>(json); // Error
Console.WriteLine(personSerialized.FullName);
```

What is interesting is to note that while the default JSON serialization of a class with a primary constructor is seamless, deserialization requires additional consideration. If you attempt to deserialize the JSON string obtained from the previous example back into a Person object, you may encounter a runtime error with the message:
`Unhandled exception. System.InvalidOperationException: Each parameter in the deserialization constructor on type 'PrimayConstructor.Person' must bind to an object property or field on deserialization. Each parameter name must match with a property or field on the object.`

The error says `each parameter in the deserialization constructor on type 'PrimaryConstructor.Person' must bind to an object property or field deserialization.` In the example we actually see that there is just one parameter that binds to an property. The only difference is that the name of the constructor parameter differs from the property name. To fix this issue, the parameter name of the primary constructor must match the property name. The following example shows the correct way to deserialize the JSON string back into a Person object:
```csharp
public class Person(string fullname) // Casing doesn't have to match
{
    public string FullName { get; set; } = fullname;
}
```


### Primary constructors

In conclusion, primary constructors in C# offer a concise and consistent way to declare constructors for classes and structs, reducing boilerplate code and making the syntax more streamlined. By providing a shorthand notation for constructor parameters directly in the class or struct declaration, they enhance code readability and maintainability.

However, this brevity comes with a trade-off, as primary constructors introduce a level of abstraction and "magic" under the hood. The parameters declared in the primary constructor are implicitly transformed into private fields, which can impact the predictability of the code for developers unfamiliar with this feature.

While primary constructors are advantageous for scenarios such as dependency injection, where a straightforward initialization is desired, they may not be suitable for situations that require more complex checks or logic during object creation. In cases where additional validation or manipulation is needed, the traditional constructor syntax might be more appropriate.

In summary, primary constructors provide a valuable tool for certain use cases by simplifying the syntax and reducing redundancy, but developers should carefully consider their application, especially when dealing with more intricate object creation scenarios.

### Collection expressions

### Optional parameters in lambda expressions
