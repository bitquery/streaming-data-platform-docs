---
sidebar_position: 2
---

# Components

The Components are the heavy-lifters of the app and contain the code snippets for the functionality.

## Homepage
The code for the Home component includes the following:

-   Imports of necessary modules such as React, useState, useEffect, Container, Row, Col, Card, and Button from the React Bootstrap library, as well as axios for API requests.
-   Declaration of the oauth_token constant to store the Bitquery API key.
-   The Home function that renders the homepage of the application.
-   The useState hook is used to declare two states, balances and loading. The balances state is initialized as an empty array, and the loading state is initialized as true.
-   The fetchdata function is declared, which is an asynchronous function that sends a GraphQL query request to the Bitquery API to get data related to NFT balances. If the API request is successful, the balances state is updated with the response data. If there is an error, the loading state is set to false.
-   The useEffect hook is used to run the fetchdata function only once when the component is mounted.
-   The return statement renders the homepage of the application, which includes a container with two rows. The first row includes a welcome message and the second row includes a heading for NFT art. The next container includes a spinner or a row of BalanceCard components depending on the loading state. The BalanceCard component displays the balance information for each NFT.

1.  Import CSS style file:



`import '../../pages/style.css';` 

This imports the CSS file "style.css" from the "pages" directory.

2.  Import libraries and components:



```JSX
import { useState, useEffect, React } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import axios from 'axios';
```

This imports the following components and libraries:

-   "useState", "useEffect", and "React" from the "react" library
-   "Container", "Row", and "Col" from the "react-bootstrap" library
-   "Card" and "Button" from the "react-bootstrap" library
-   "axios" library

3.  Set API OAuth Token:



`const oauth_token = 'YOUR KEY'` 

This sets a constant variable "oauth_token" to the Bitquery API OAuth Token.

4.  Define function to fetch data from API:



`const fetchdata = async () => {
  // Code to fetch data
};` 

This function uses axios to send a post request to the Bitquery API to retrieve data about the balances of a specific Ethereum address.

5.  Define state variables:



`const [balances, setBalances] = useState([]);
const [loading, setLoading] = useState(true);` 

These variables define the state of the component. The "balances" variable is initialized as an empty array, and the "loading" variable is set to true. These variables are used to display a loading spinner while the data is being fetched from the API.

6.  Use useEffect to call fetchdata function:



`useEffect(() => {
  fetchdata();
}, []);` 

This calls the "fetchdata" function when the component mounts for the first time.

7.  Return JSX:


```JSX
return (
  <div className="project-background">
    {/* Code to render the page */}
  </div>
);
```

This returns the JSX that defines the component's appearance and functionality.

8.  Render JSX:



```JSX <Container className="project-section">
  <Row>
    <Col md={7}>
      {/* Code to render name and title */}
    </Col>
  </Row>
  <h1 className="nametext" style={{ textAlign: "center" }}>My NFT Art</h1>
  <Container className="project-section">
    {/* Code to display balances or loading spinner */}
  </Container>
</Container>
```

This renders the JSX that defines the layout of the component. It includes a container with a row and column for the name and title, as well as a container for displaying the balances or loading spinner.

9.  Define BalanceCard component:



`function BalanceCard({ balance }) {
  // Code to render balance information
}` 

This component takes in a "balance" prop and renders information about the balance, including the currency name, address, amount, and ID.

10.  Export Home component as default:



`export default Home;` 

This exports the "Home" component as the default export for the file.

**Here's the complete code:**
```JSX
 import "../../pages/style.css";

import { useState, useEffect, React } from "react";

import "../../pages/style.css";

import { Container, Row, Col } from "react-bootstrap";

import Card from "react-bootstrap/Card";

import Button from "react-bootstrap/Button";

import axios from "axios";

const oauth_token = "YOUR KEY";

function Home() {
  const [balances, setBalances] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchdata = async () => {
    // setLoading(true);

    console.log("loading", loading);

    try {
      var data = JSON.stringify({
        query:
          'query MyQuery {\n EVM(dataset: combined, network: eth) {\n BalanceUpdates(\n where: {BalanceUpdate: {Address: {is: "0xaba7161a7fb69c88e16ed9f455ce62b791ee4d03"}}, Currency: {Fungible: false}}\n limit: {count: 50}\n orderBy: {descendingByField: "balance"}\n ) {\n Currency {\n Name\n SmartContract\n }\n balance: sum(of: BalanceUpdate_Amount)\n BalanceUpdate {\n URI\n Address\n Id\n }\n }\n }\n}\n',

        variables: "{}",
      });

      var config = {
        method: "post",

        url: "https://streaming.bitquery.io/graphql",

        headers: {
          "Content-Type": "application/json",

          "X-API-KEY": oauth_token,
        },

        data: data,
      };

      const response = await axios(config);

      // setLoading(false);

      console.log("response", response);

      setBalances(response?.data?.data?.EVM?.BalanceUpdates);
    } catch (error) {
      setLoading(false);

      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once the response is received
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="project-background">
      <Container className="project-section">
        <Row>
          <Col md={7}>
            <h2 className="headtext">
              Hello <span className="wave">👋 </span>
            </h2>

            <h2 className="nametext">I'm Bitquery</h2>

            <h3 className="nametext-h3">NFT Creator</h3>
          </Col>
        </Row>

        <h1 className="nametext" style={{ textAlign: "center" }}>
          My NFT Art
        </h1>

        <Container className="project-section">
          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <Row className="justify-content-center">
              {balances.map((balance) => (
                <Col
                  key={`${balance.BalanceUpdate.Id}-${balance.balance}`}
                  md={4}
                >
                  <div className="project-card">
                    <div className="project-card-view">
                      <img
                        src={require("../../Assets/BAYC.svg").default}
                        className="project-card-image"
                      />

                      {/* <div className="project-card-content"> */}

                      {/* </div> */}

                      <BalanceCard balance={balance} />

                      <a
                        href="https://opensea.io/"
                        className="project-card-button"
                        target="_blank"
                      >
                        Buy now
                      </a>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </Container>
    </div>
  );
}

function BalanceCard({ balance }) {
  const { BalanceUpdate, balance: amount, Currency } = balance;

  const { Address, URI, Id } = BalanceUpdate;

  const { Name: CurrencyName } = Currency;

  return (
    <div className="project-card project-section">
      <Card className="project-card-view">
        <Card.Title
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#03dac6",
          }}
        >
          {CurrencyName}
        </Card.Title>

        <p>Address: {Address}</p>

        <p>Amount: {amount}</p>

        <p>ID: {Id}</p>

        <Button
          className="view-btn"
          variant="primary"
          href={URI}
          target="_blank"
        >
          View URI
        </Button>
      </Card>
    </div>
  );
}

export default Home;

```


## About Page

### Import Statements

The `Aboutpage` component imports the following libraries and modules:



`import React from 'react'
import '../../pages/style.css';
import { Container, Row, Col } from 'react-bootstrap'` 

-   `React`: The `react` library is the main dependency of React that is required to use JSX and create React components.
-   `style.css`: A custom stylesheet for the about page.
-   `Container`, `Row`, and `Col`: The `react-bootstrap` library is a set of pre-designed React components that are styled using Bootstrap. `Container`, `Row`, and `Col` are components that are used to structure the layout of the page.

### About Page Content

The `Aboutpage` component renders the following content:


```JSX
<div className='aboutpagebackground'>
  <Container>
    <Row className='textbackground'>
      <Col md={7}>
        <h3 className='aboutmetext'>About <span>Me</span></h3>
        <p className='aboutdetails'>
           Bitquery is a blockchain data company that provides realtime and archive blockchain data
        </p>
        <ul className='skilllist'>
          <Row>
            <h3>Skills</h3>
            <Col md={7}>
              <li>Solidity</li>
              <li>GraphQL</li>
              <li>Canva</li>
              <li>Python</li>
            </Col>
            <Col md={5}>
              <li>Graphic Design</li>
              <li>Adobe Illustrator</li>
              <li>Adobe Photoshop</li>
              <li>Material-ui</li>
              <li>Git/Github</li>
            </Col>
          </Row>
        </ul>
      </Col>
    </Row>
  </Container>
</div> 
```
#### 1. `aboutpagebackground`

The `aboutpagebackground` class is used to style the background of the page.

#### 2. `Container`, `Row`, and `Col`

`Container`, `Row`, and `Col` are components from the `react-bootstrap` library. They are used to structure the layout of the page.

#### 3. `aboutmetext`

The `aboutmetext` class is used to style the header of the section.

#### 4. `aboutdetails`

The `aboutdetails` class is used to style the text that describes the developer.

#### 5. `skilllist`

The `skilllist` class is used to style the unordered list that displays the developer's skills.

#### 6. `Solidity`, `GraphQL`, `Canva`, `Python`, `Graphic Design`, `Adobe Illustrator`, `Adobe Photoshop`, `Material-ui`, and `Git/Github`

These are list items that display the developer's skills. They are styled using the `Col` component from `react-bootstrap`.

### Export Statement

The `Aboutpage` component is exported using the `export default` statement:

`export default Aboutpage` 

This allows other modules to import and use the `Aboutpage` component.


## Contact Page


The `Contactpage` component is a React functional component that renders the Contact Us page of a website. It includes a header, a paragraph of text, and a link to the Telegram channel where users can get in touch with the website's team.

### Import Statements


```JSX
import React from 'react';
import '../../pages/style.css';
import { Container } from 'react-bootstrap'; 
```

This component uses `React` to create the component, `style.css` for custom styling, and `Container` component from `react-bootstrap` to create a responsive container.

### Contactpage Component



```JSX
function Contactpage() {
  return (
    <div className='contactbackground'>
      <Container>
        <h2 className='contacthead'>Get In Touch</h2>
        <p className='contactpara'>
          Contact us on Telegram <a href="https://t.me/Bloxy_info">https://t.me/Bloxy_info</a></p>

        <span></span>

      </Container>
    </div>
  )
}

### Export Statement

export default Contactpage;
```

## Header Component


### State

The Header component has two states: `expand` and `navColour`.

-   `expand` is a boolean state that determines whether the navigation menu is expanded or not. The default value is `false`.
-   `navColour` is a boolean state that determines whether the navigation bar is in a sticky position or not. The default value is `false`.
### Functions

The Header component has one function: `scrollHandler()`. This function listens for a scroll event and updates the `navColour` state based on the scroll position. If the scroll position is greater than or equal to 20, `navColour` is set to `true` and the navigation bar becomes sticky.

```
import React from 'react';
import Header from './Header';

function App() {
  return (
    <div>
      <Header />
      {/* Rest of the app */}
    </div>
  );
}

export default App;
```

 ### JSX
-   A `Navbar` component that includes the logo and navigation links. The `fixed` prop is set to "top" and the `expand` prop is set to "md" to make the navbar responsive for mobile devices. The `expanded` prop is set to the value of `expand`. The `className` prop is set to "sticky" when `navColour` is `true` and "navbar" otherwise.
-   A `Navbar.Brand` component that displays the logo. The `as` prop is set to a `Link` component that redirects the user to the home page when clicked.
-   A `Navbar.Toggle` component that displays the toggle button for mobile devices. The `className` prop is set to "navbar-toggler". When the button is clicked, `expand` state is updated to either `false` or "expanded".
-   A `Navbar.Collapse` component that contains the navigation links. The `id` prop is set to "responsive-navbar-nav". The `className` prop is set to "responsive-navbar". The `Nav` component contains `Nav.Item` components that display the navigation links. The `as` prop is set to a `Link` component that redirects the user to the corresponding page when clicked. When a link is clicked, `expand` state is updated to `false`.

```JSX
<Navbar
  expanded={expand}
  fixed="top"
  expand="md"
  className={navColour ? "sticky" : "navbar"}
>
  <Navbar.Brand className="logotext" as={Link} to="/">
    <div className="logo"></div>
  </Navbar.Brand>

  <Navbar.Toggle
    className="navbar-toggler"
    aria-controls="responsive-navbar-nav"
    onClick={() => {
      updateExpanded(expand ? false : "expanded");
    }}
  >
    <span></span>

    <span></span>

    <span></span>
  </Navbar.Toggle>

  <Navbar.Collapse id="responsive-navbar-nav" className="responsive-navbar">
    <Nav className="ms-auto" defaultActiveKey="#home">
      <Nav.Item>
        <Nav.Link as={Link} to="/" onClick={() => updateExpanded(false)}>
          {" "}
          Home{" "}
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link as={Link} to="/about" onClick={() => updateExpanded(false)}>
          About
        </Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link as={Link} to="/contact" onClick={() => updateExpanded(false)}>
          Contact
        </Nav.Link>
      </Nav.Item>
    </Nav>
  </Navbar.Collapse>
</Navbar>;
```

### Complete Code

```JSX
import React, { useState } from "react";

import { Button } from "react-bootstrap";

import Nav from "react-bootstrap/Nav";

import Navbar from "react-bootstrap/Navbar";

import { Link } from "react-router-dom";

import "../../pages/style.css";

function Header() {
  const [expand, updateExpanded] = useState(false);

  const [navColour, updateNavbar] = useState(false);

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

  window.addEventListener("scroll", scrollHandler);

  return (
    <Navbar
      expanded={expand}
      fixed="top"
      expand="md"
      className={navColour ? "sticky" : "navbar"}
    >
      <Navbar.Brand className="logotext" as={Link} to="/">
        <div className="logo"></div>
      </Navbar.Brand>

      <Navbar.Toggle
        className="navbar-toggler"
        aria-controls="responsive-navbar-nav"
        onClick={() => {
          updateExpanded(expand ? false : "expanded");
        }}
      >
        <span></span>

        <span></span>

        <span></span>
      </Navbar.Toggle>

      <Navbar.Collapse id="responsive-navbar-nav" className="responsive-navbar">
        <Nav className="ms-auto" defaultActiveKey="#home">
          <Nav.Item>
            <Nav.Link as={Link} to="/" onClick={() => updateExpanded(false)}>
              {" "}
              Home{" "}
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              as={Link}
              to="/about"
              onClick={() => updateExpanded(false)}
            >
              About
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link
              as={Link}
              to="/contact"
              onClick={() => updateExpanded(false)}
            >
              Contact
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;

```

## Preload 

This component can be used to display a preloader animation or graphic while other content is being loaded, and then hide the preloader once the content is ready. The parent component that uses this "Pre" component can pass a value of true or false to the "load" prop, depending on whether content is currently being loaded or not.

```JSX
import React from "react";
function Pre(props) {
  return <div id={props.load ? "preloader" : "preloader-none"}></div>;
}

export default Pre;
```