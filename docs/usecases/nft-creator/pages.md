---
sidebar_position: 3
title: "NFT Portfolio Tracker Pages"
description: "Create React pages for an NFT creator portfolio that loads holdings and metadata from Bitquery NFT GraphQL APIs. See examples in the Bitquery IDE."
---
# Pages

## About Page

The About page is a React functional component that renders the Header and Aboutpage components. 

```JSX
import React from 'react'
import Header from '../components/Header/Header'
import Aboutpage from '../components/Aboutpage/Aboutpage'

function About() {
  return (
    <div>
      <Header />
      <Aboutpage />
    </div>
  )
}

export default About
```

## Contact Page
It imports two components from the '../components' folder - Contactpage and Header.

```JSX
import React from 'react'
import Contactpage from '../components/Contactpage/Contactpage'
import Header from '../components/Header/Header'

function Contact() {
  return (
    <div>
      <Header />
      <Contactpage />
    </div>
  )
}

export default Contact
```

## Home Page

The component imports the necessary modules from React and the application's internal components: Header and Homepage.

```JSX
import React from 'react'
import Header from '../components/Header/Header'
import Homepage from '../components/Homepage/Homepage'

function Home() {
  return (
    <div>
      <Header />
      <Homepage />
    </div>
  )
}

export default Home
```
