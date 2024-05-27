# OLAP

We use OLAP system to optimize performance and provide a highly efficient system.

**OLAP (Online Analytical Processing)** is the backbone for many Business Intelligence (BI) applications. It is a powerful technology for data discovery, including capabilities for limitless reporting, viewing, complex analytical calculations, and predictive “what if” scenario (budget, forecast) planning.

Unlike relational databases, OLAP tools do not store individual transaction records in two-dimensional, row-by-column format, like a worksheet. Instead, they use multidimensional database structures — known as **_Cubes_** in OLAP terminology — to store arrays of consolidated information.[[1]](https://olap.com/olap-definition/)

## Bitquery Architechture

Let’s understand how we built our infrastructure to enable scalable analytical processing. In the simplest form, we are using [Clickhouse](https://clickhouse.tech/) (An OLAP database) at our data warehouse and built a GraphQL layer on top of it, and glued them together using a library called [Activecube](https://github.com/bitquery/activecube), which we have written from scratch and open-sourced. This library transforms GraphQL queries to Clickhouse queries.

![Bitquery architecture ](https://bitquery.io/blog/blockchain-intelligence-system//image.jpeg)

Now, Let’s dig deep and learn how our system works and its capabilities.

### Cube

We store blockchain data in cubes. [_Cube_](https://en.wikipedia.org/wiki/OLAP_cube) is a shorthand for _multidimensional dataset_, given that data can have an arbitrary number of [_dimensions_](https://en.wikipedia.org/wiki/Dimension_%28data_warehouse%29)_._ A cube is not a “cube” in the strict mathematical sense, as all the sides are not necessarily equal. To analyze more complex data, we create hypercubes using multiple cubes.

![bitquery cube](https://bitquery.io/blog/blockchain-intelligence-system//image-1.jpeg)

In our case, a typical cube contains dimensions, filters, and metrics. Let me break this down for you.

Check out the [following GraphQL query](https://explorer.bitquery.io/graphql/gH9DfsZBDC), which provides DEX trades for USDT/WETH pair on Uniswap DEX. As you can see, it contains multiple attributes.

-   Dataset (Ethereum in this case)
-   DexTrades (Cube name)
-   Filters (Exchange name, Base currency, Quote currency, etc.)
-   Dimensions (Time interval, Base currency, Quote currency)
-   Metrics (Base amount, Traders count, Quote price, etc..)

let’s understand them one by one.

![Dextrades api](https://bitquery.io/blog/blockchain-intelligence-system//image-2.jpeg)

### Dimensions

Dimensions are defined in the GraphQL schema and have multiple attributes. And Attributes are like sub-dimensions which helps in getting specific data or performing aggregations. Attributes can be multi-level.

![Dimensions](https://bitquery.io/blog/blockchain-intelligence-system//image-3.jpeg)

**Attributes** have **functions** to enable aggregation. Note, What we call **functions**, Graphql specifications call them **attributes**, but we add special meaning to it.

In the above example, **day** has function **count**, so it’s helping in aggregating every five days. You can multiple functions enabling different functionality throughout our schema.

So as I said before, **functions** do not exist on Graphql specification, but we added them to make our queries programmatical, this enhances the capabilities of our queries because we provide a lot of functions and continuously add new functions to enable new functionalities. This is the way we map GraphQL with analytics and add programming capabilities to our queries.

### Metrics

Metrics look similar to Dimensions, however, they behave differently. For example, metrics are usually numerics and they calculate maximum, minimum, and other mathematic functions.

![ Metrics](https://bitquery.io/blog/blockchain-intelligence-system//image-4.jpeg)

### **Dataset and Filters**

Datasets are types of data such as Ethereum and Binance smart chain, both are Ethereum type datasets because they are similar types of blockchains. Filters help in adding scope and range to queries.