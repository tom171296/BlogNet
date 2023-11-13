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

## Collection expressions
In the dynamic landscape of C# programming, the ubiquity of collection-like values is unquestionable. These values are fundamental for data storage and exchange between components. However, the current state of affairs presents a challenge: the creation of such values involves a myriad of verbose approaches.

- **Arrays**: Initialization requires either `new Type[]` or `new[]`, introducing unnecessary verbosity.
- **Spans**: Complex constructs, including `stackalloc`, complicate the creation of spans.
- **Collection Initializers**: Syntax like `new List<T>` lacks type inference and may lead to inefficient memory reallocations.
- **Immutable Collections**: Initializing immutable collections, such as `ImmutableArray.Create(...)`, can result in unnecessary allocations and data copying.

With the introduction of collection expressions, C# 12 aims to address these issues by providing a concise and consistent syntax for the creation of collection-like values.

```csharp
int[] cSharp12 = [ 1, 2, 3, 4, 5 ]; // Collection expression
```

### Behavior
A collection expression is a concise syntax that, when evaluated, can be assigned to many different collection types. A collection expression contains a sequence of elements between `[` and `]` brackets.

Using a collection expression comes with a few rules. For example the use of the `var` keyword is no longer possible. That is because it is impossible to determine the target type when evaluating the collection expression.

```csharp
var test = [1, 2, 3, 4, 5]; // Error
int[] test = [1, 2, 3, 4, 5]; // Correct use of collection expression
```

### Spread operator
The spread operator `..` in a collection expression replaces its argument with the elements from that collection. The argument must be a collection type. What is good to know that the spread operator doesn't place a reference to the collection in the target collection but it places the elements of the collection in the target collection. This means that when you change the source collection, the target collection doesn't change.
```csharp
int[] row0 = [1, 2, 3];
int[] row1 = [4, 5, 6];
int[] row2 = [7, 8, 9];
int[] single = [..row0, ..row1, ..row2];
```

### Collection expressions
The introduction of collection expressions in C# 12 marks a significant stride in simplifying the creation of collection-like values. Addressing the verbosity associated with arrays, spans, collection initializers, and immutable collections, this feature offers a concise and consistent syntax.

The use cases for collection expressions showcase their versatility:
- Initialize Private Field: `private int[] _numbers = [ 1, 2, 3, 4, 5 ];`
- Property with Expression Body: `public int[] Numbers => [ 1, 2, 3, 4, 5 ];`
- As an input parameter: `int sum = Sum([1, 2, 3, 4, 5]);`

These examples illustrate how collection expressions streamline various scenarios, from private field initialization to enhancing the readability of properties and serving as parameters for seamless conversions.

The behavior of collection expressions, with the added spread operator .., reinforces their flexibility. While the var keyword is no longer applicable due to the need for explicit type determination, this trade-off ensures a clear and consistent syntax.

## Ref readonly parameters
In C#, parameters act as inputs to methods and are classified as either value types or reference types. **Value type** parameters transmit a copy of the data, while **reference type** parameters convey a reference to the actual data. The `ref` keyword enables explicit passing value types by reference, allowing direct modification of the original data. The `in` keyword also passes the parameter by reference but makes it read-only, preventing modification of the original data. To enhance clarity in APIs utilizing ref or in parameters, Microsoft introduced `ref readonly` parameters. This improvement aids in distinguishing methods that modify data from those that only read it.

### Behavior
So the behavior of `ref readonly` actually already exists in the `in` keyword. The reference of the desired parameter is passed in a **readonly** way to the method. This means that the method can't change the value of the parameter.

```csharp
public void refReadOnly(ref readonly int someValue)
{
    someValue = 5; // Error
}
```

### Ref readonly parameters
So with the introduction of ref readonly parameters, no real new functionality is added. This feature makes defining feature more clearly, making explicit and clear that the method can't change the value of the parameter. Personally I think this feature will be mostly used by library developers to make the API more clear.

## Default lambda parameters
Lambda expressions in C# offer concise, anonymous functions, streamlining code with a compact syntax. Using the "=>" operator, these powerful constructs simplify the creation of functions, particularly in scenarios involving delegates, LINQ queries, and asynchronous programming.

### Behavior
By default a parameter defined in a lambda is required. Normal functions in C# can have default parameters. This means that when you call a function without a value for a parameter, the default value is used. 

```csharp
var lambda = (int age) => age >= 18;
lambda(); // error, no value for age
```

With the introduction of default parameters in C# 12, it is now possible to define a default value for a parameter in a lambda. This means that when you call a lambda without a value for a parameter, the default value is used.

```csharp
var lambda = (int age = 1) => age >= 18;
lambda(); // No error, age is 1
```

// use cases for default lambda parameters


## Alias any type

## Experimental attribute

## Interceptors
