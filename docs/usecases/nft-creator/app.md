---
sidebar_position: 4
---

# App 

Finally we will write the app code and the css

### Import Statements:

```JSX
import "./App.css";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Preloader from "../src/components/Pre";
import Home from "./pages/Home.js";
import About from "./pages/About";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

import Contact from "./pages/Contact";
```
### State Variables:
```JSX
const [load, upadateLoad] = useState(true);
const [mousePosition, setMousePosition] = useState({
  x: 0,
  y: 0,
});
```
### useEffect Hooks:
```JSX
useEffect(() => {
  const mouseMove = (e) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  window.addEventListener("mousemove", mouseMove);

  return () => {
    window.removeEventListener("mousemove", mouseMove);
  };
}, []);

const variants = {
  default: {
    x: mousePosition.x - 16,
    y: mousePosition.y - 16,
  },
};

useEffect(() => {
  const timer = setTimeout(() => {
    upadateLoad(false);
  }, 1200);

  return () => clearTimeout(timer);
}, []);
```

### Rendering
The `App` component returns a div with a className of 'App'. This div contains two child components:

-   `motion.div` component with a className of 'cursor'. This component adds an animated cursor that follows the mouse.
-   `Router` component from 'react-router-dom' that enables routing in the application. It has two child components:
    -   `Preloader` component that renders a loading screen until the application has loaded. It only renders when `load` is true.
    -   Another div with a className of 'App' and an id of 'no-scroll' or 'scroll' depending on the value of `load`. This div contains the `Routes` component from 'react-router-dom', which renders the `Home`, `About`, and `Contact` components based on their respective routes.
    
```JSX
return (
  <div className="App">
    <motion.div className="cursor" variants={variants} animate="default" />
    <Router>
      <Preloader load={load} />
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>

          <Route path="/contact" element={<Contact />}></Route>
        </Routes>
      </div>
    </Router>
  </div>
);
```


### Complete Code

```JSX
import './App.css';
import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Preloader from '../src/components/Pre'
import Home from './pages/Home.js'
import About from './pages/About'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

import Contact from './pages/Contact';

function App() {
  const [load, upadateLoad] = useState(true);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
 

  useEffect(() => {
    const mouseMove = e => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      })
    }

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    }
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      <motion.div
        className="cursor"
        variants={variants}
        animate="default"
      />
      <Router>
        <Preloader load={load} />
        <div className="App" id={load ? "no-scroll" : "scroll"}>
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/about' element={<About />}></Route>
     
            <Route path='/contact' element={<Contact />}></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
```

## CSS

Use the css file in this [Github repo.](https://github.com/divyasshree-BQ/nft-creator-portfolio/blob/main/src/pages/style.css)


