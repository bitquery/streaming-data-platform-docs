# Use it in Your Application

You can integrate both queries and subscriptions in your application on any programming language and framework.
First you create a query or subscription in [IDE](/docs/start/first-query/), and then you embed this query
and some client code in your application. The client code depends on the programming language
and set of libraries you prefer to use, try search google on "graphql YOUR-LANGUAGE library" keyword to start with.


[IDE](/docs/start/first-query/) provides an example code templates to your queries 
on some programming languages. After you created the query, press the ```</>``` button
located to the right from the endpoint URL entry field. 
You will see the code snippet and the selection of languages and libraries to use:


![IDE code snippets](/img/ide/code_snippets.png)

Select your programming language and run the code in your application.

Note that you have to use your [OAuth key](/docs/authorisation/how-to-generate.md). [IDE](/docs/start/first-query/) automatically
substituted it for you in the code, but in production environment you may need to change it
to another one, potentially with the [paid plan](/docs/ide/paid).