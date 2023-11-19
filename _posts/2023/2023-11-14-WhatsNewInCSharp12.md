---
title: What's new in C# 12, a developer's perspective
header:    
    teaser: 
excerpt: Get a glimpse of the new language features in C# 12
published: true
tags: [.NET, C#, .NET CORE]
cover-img: ../../assets/images/2023/CSharp12/C#_header.jpg
thumbnail-img: ../../assets/images/2023/CSharp12/C#_header.jpg
share-img: ../../ssets/images/2023/CSharp12/C#_header.jpg
---

# Whats new in C# 12
As we delve into the latest iteration of the C# programming language, version 12, one might find that while there isn't an array of groundbreaking features that immediately catch the eye, there's a notable emphasis on refining and enhancing the language's existing capabilities. C# 12 introduces a series of improvements aimed at making the language more consistent, streamlining syntax, and addressing specific use cases. In this exploration, we'll navigate through these enhancements, acknowledging that some features may feel tailor-made for Microsoft's internal development needs but have been generously made public.

While the absence of flashy, headline-grabbing features may seem unremarkable at first glance, the real magic lies in the meticulous attention to detail. These updates contribute to a more coherent and streamlined programming experience, fostering consistency and reducing friction in various aspects of C# development. Let's embark on a journey through the nuanced landscape of C# 12, where the devil is in the details, and the enhancements subtly reshape the language's terrain.


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

### Default lambda parameters
The introduction of default parameters in C# 12 revolutionizes lambda expressions, providing a powerful feature previously reserved for traditional functions. This enhancement, exemplified by assigning default values to parameters, particularly shines in minimal APIs. Now, lambda expressions empower concise, customizable functionality, offering a seamless blend of brevity and flexibility in the development of streamlined, efficient minimalistic APIs.

## Alias any type
Aliases are a way to create a new name for an types (class, delegated, interfaces, records and structs). This can be particularly useful when dealing with complex or lengthy type names, enhancing code readability and conciseness. This worked acceptably well as it provided a means to introduce non-conflicting names in cases where a normal named pulled in from using_directives might be ambiguous, and it allowed a way to provide a simpler name when dealing with complex generic types. Prior to C# 12, pointer types, array types and tuple types couldn't use an alias. With the introduction of alias any type, this limitation is removed, allowing the use of aliases for any type.

### Behavior
The behavior of alias any type is the same as the behavior of alias type. The only difference is that you can now use aliases for pointer types, array types and tuple types. Both of the next examples weren't possible before C# 12.

```csharp
using Point3d = (int x, int y, int z);
using arrayType = int[];
```

The usage of an alias any type uses the `new` keyword. For example the given aliases in the last example can be created as follows.

```csharp
Point3d point = new(10, 10, 30); // explicit via type
var point = new Point3d(10, 10, 30); // explicit via `constructor`
```
### Destruction
These aliases can also be used in a destruction statement. This means that you can use the alias to deconstruct a tuple or array.

```csharp
var (a,b,c) = new Point3d(10, 10, 30); // deconstruct tuple
```

### Alias type
The introduction of alias any type in C# 12 eliminates the previous restrictions on using aliases for pointer types, array types, and tuple types. This enhancement promotes consistency across the language, enabling developers to create simpler and more readable code by introducing non-conflicting names for various types. The behavior remains consistent with alias type, and with the new capability, developers can now utilize aliases for all types, fostering better code organization and conciseness.

## Experimental attribute
The Experimental attribute serves as a marker in programming languages indicating that a particular feature or functionality is in an experimental or pre-release state. When applied to code elements like classes, methods, or properties, this attribute signals to developers that the associated code is not yet finalized or fully supported. It provides a clear indication that the marked feature may undergo changes or refinements in future releases, encouraging developers to use it cautiously and be aware of potential updates or deprecations.

### Behavior
With the release of C# 12, the Experimental attribute is now available for use in C# code. This attribute can be applied to classes, methods, properties, and other code elements, and it can be used to mark experimental features or functionality.

```csharp
[Experimental(diagnosticId: "diagnosticId", UrlFormat = "http://google.com")]
```
The `DiagnosticID` is required. This ID is used by the compiler to report the use of the experimental feature. The `UrlFormat` is optional. This URL is used to provide more information about the experimental feature. You can link it for example to your github issue or an Azure devops feature that addresses the experimental feature.

### Experimental attribute
The Experimental attribute in C# 12 serves as a useful tool for both platform engineers and package developers to clearly designate experimental features. As the landscape of software development evolves, this feature enables exploration of new functionalities while ensuring awareness of potential updates. In C# 12, the Experimental attribute facilitates an adaptable development approach, catering to the dynamic nature of modern software engineering across various contexts.

## Inline arrays
The .NET team is always looking on how they can improve performance. With the introduction to inline arrays, they created a way to create an array of a fixed size in a `struct type`. As a developer, you probally won't ever use this feature, it is mainly added for the .NET runtime team to get more performance out of the runtime.

### Behavior
The creation of an inline array is as follows:

```csharp
[System.Runtime.CompilerServices.InlineArray(10)] // Attribute
public struct InlineArray
{
    private string _element0;
    private int test; // will generate an error
}
```

The attribute has one parameter. This parameter is the size of the array. The size of the array is fixed and can't be changed. The size of the array is also the number of elements that are created in the struct. An struct that is decorated with the inline array attribute can only have one instance field. The type of the field is the type of the array created. 

Inializing an inline array is done by using the `new` keyword. The size of the array is determined by the attribute. The array can be filled like a normal array. Make sure you don't go out of bounds, this will generate a runtime exception.

```csharp
var array = new InlineArray();
for (int i = 0; i < 10; i++) // can't be longer than the size of the array, will generate a runtime exception
{
    array[i] = i.ToString();
}
```

### Inline arrays
The introduction of inline arrays in C# 12 reflects the .NET team's commitment to optimizing runtime performance. This feature allows for the creation of fixed-size arrays within a struct type. While this capability may not be extensively utilized by developers in their day-to-day coding, it serves as a specialized tool primarily designed to enhance the performance of the .NET runtime.

## Interceptors
An interceptor is a method that can declaratively substitute a call to an interceptable method with a call to itself at compile time. This substitution occurs by having the interceptor declare the source locations of the calls that it intercepts. 

With the release of C# 12, interceptors are available as preview feature. This means that you have to enable the preview feature in your project file. This can be done by adding the following line to your project file.
```xml
<LangVersion>preview</LangVersion>
<Features>InterceptorsPreview</Features>
```

The second step that you need to do to use an interceptor is create the attribute. The preview feature is added to the language, but the attribute itself isn't available to use yet. So you have to create it yourself

```csharp
namespace System.Runtime.CompilerServices;
[AttributeUsage(AttributeTargets.Method)]
public sealed class InterceptsLocationAttribute(string filePath, int line, int character) : Attribute
{
}
```

### Behavior
The behavior of an interceptor is that it can intercept a call to a method. This means that you can replace the call to a method with a call to another method. This is done by using the `InterceptsLocationAttribute` attribute. This attribute is used to mark the method that intercepts the call. The attribute has three parameters. The first parameter is the file path of the method that is intercepted. The second parameter is the line number of the method that is intercepted. The third parameter is the character position of the method that is intercepted.

So lets say we have the following class that contains a method that we want to intercept.
```csharp
namespace _8.Interceptors;

public class InterceptTest
{
    public void PrintStuff(string stuff) // Method we want to intercept
    {
        Console.WriteLine(stuff);
    }
}
```

And the following using of the method:
```csharp
using _8.Interceptors;
new InterceptTest().PrintStuff("Hello, World!");
```

Intercepting a method is done at the location it is used. This means that we have to intercept the call that is done to `PrintStuff("Hello, World!")`. To do this, the attribute has the following signature in use:
```csharp
public static class Interception
{
    [InterceptsLocation(
        filePath: @"absoluthePath/SomeClass.cs", // Path to the file that contains the method invocation that is intercepted
        line: 4, // Line number of the method invocation that is intercepted
        character: 21 // Character position of the method invocation that is intercepted
    )]
    public static void InterceptMethod(this InterceptTest interceptTest, string param){
        Console.WriteLine($"Intercepted: {param}");
    }
}
```

The use of the attribute will give the following error: `The 'interceptors' experimental feature is not enabled in this namespace. Add '<InterceptorsPreviewNamespaces>$(InterceptorsPreviewNamespaces);Interceptors</InterceptorsPreviewNamespaces>' to your project.`. This error is shown because the namespace of the attribute isn't enabled for the interceptors preview feature. To enable the namespace, you have to add the following line to your project file.

```xml
<InterceptorsPreviewNamespaces>$(InterceptorsPreviewNamespaces);Interceptors</InterceptorsPreviewNamespaces>
```
Running the example code will intercept the call to the `PrintStuff` method and will print the following output:
```
Intercepted: Hello, World!
```

### Interceptors
Interceptors in C# constitute a specialized feature, intricately designed to be employed by Microsoft and developers intricately working with source generators. Primarily used for advanced scenarios, interceptors play a key role in code interception within the context of source compilation modification. Specifically integrated into source generators, interceptors substitute calls to interceptable methods, offering a nuanced approach to code manipulation. While not intended for widespread adoption, this feature caters to the precise needs of developers engaged in deep customization, emphasizing its role within specialized development and source code generation.

## Conclusion
C# 12 introduces several noteworthy features that enhance the language's expressiveness and flexibility. Primary constructors provide a concise and consistent way to declare constructors for classes and structs, streamlining code and improving readability. However, developers should be mindful of the implicit transformations of parameters into private fields, which may introduce abstraction and "magic" that could affect predictability.

Collection expressions address the verbosity associated with various collection types, offering a concise and consistent syntax. The spread operator further enhances flexibility by allowing the insertion of elements from one collection into another. These improvements simplify the creation of collection-like values, making code more readable and efficient.

Ref readonly parameters refine the distinction between methods that modify data and those that only read it. While not introducing new functionality, this feature enhances code clarity, especially in APIs where explicit read-only behavior is crucial.

Default lambda parameters extend the power of lambda expressions by allowing the definition of default values for parameters. This addition, previously available only in traditional functions, contributes to the development of more concise and customizable functionality, particularly in minimal APIs.

The introduction of alias any type eliminates previous restrictions on using aliases for pointer types, array types, and tuple types. This enhancement promotes consistency across the language, enabling developers to create simpler and more readable code by introducing non-conflicting names for various types.

The Experimental attribute serves as a valuable marker for experimental or pre-release features, providing transparency and signaling potential updates or deprecations. This attribute facilitates an adaptable development approach, enabling exploration of new functionalities while ensuring awareness of potential changes.

Inline arrays, a performance-focused feature designed to create fixed-size arrays within a struct type. While developers may not frequently use this feature, it aligns with the .NET team's focus on optimizing runtime performance. Inline arrays cater to specific scenarios, showcasing C#'s commitment to refinement for both general and specialized use cases.

Finally, the preview feature of interceptors provides a specialized tool for code interception within the context of source compilation modification. While not intended for widespread use, interceptors offer a nuanced approach to code manipulation, catering to the specific needs of developers engaged in deep customization and source code generation.

C# 12, with its diverse set of features, continues to evolve the language, addressing both common development challenges and specialized scenarios, empowering developers with enhanced tools and capabilities.