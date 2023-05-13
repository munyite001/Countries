import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const themes = {
  light: {
      backgroundColor: 'hsl(0, 0%, 98%)',
      color: 'hsl(200, 15%, 8%)'
  },
  dark: {
      backgroundColor: 'hsl(207, 26%, 17%)',
      color: 'hsl(0, 0%, 100%)'
  },
  lightElements: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    color: 'hsl(200, 15%, 8%)'
  },
  darkElements: {
    backgroundColor: 'hsl(209, 23%, 22%)',
    color: 'hsl(0, 0%, 100%)'
  }
}

export default function App()
{
  // eslint-disable-next-line
  const [showAllCountries, setShowAllCountries] = React.useState(true);
  const [theme, setTheme] = React.useState('light');

  const containerStyles = {
    backgroundColor: themes[theme].backgroundColor,
    color: themes[theme].color
  }
  return (
    <div style={containerStyles}>
      {showAllCountries && <Home theme={theme} setTheme={setTheme} styles={containerStyles}/>}
    </div>
  )
}

// COMPONENTS
function Navbar(props)
{
  // eslint-disable-next-line
  const {darkTheme, setTheme} = props
  function changeTheme()
  {
    setTheme((prevTheme) => prevTheme === "light" ? "dark" : "light")
  }
  return (
    <nav>
      <h2>Where in the World?</h2>
      <div className="switchTheme">
        {darkTheme === "dark" && <FontAwesomeIcon icon={faMoon} onClick={changeTheme}/>}
        {darkTheme === "light" && <FontAwesomeIcon icon={faSun} onClick={changeTheme}/>}
        <p>
          {darkTheme === "light" && "Light Mode"}
          {darkTheme === "dark" && "Dark Mode"}
        </p>
      </div>
    </nav>
  )
}

function Home(props)
{
  const headerStyles = {
    backgroundColor: themes[props.theme + 'Elements'].backgroundColor,
    color: themes[props.theme + 'Elements'].color,
    boxShadow: props.theme === "light" ? '0 3px 5px hsl(0, 0%, 52%)':''
  }
  return (
  <main style={props.styles}>
    <header style={headerStyles}>
      <Navbar darkTheme={props.theme} setTheme={props.setTheme}/>
    </header>
  </main>
  )
}
