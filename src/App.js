import React, { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

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
  const url='https://restcountries.com/v3.1/all';
  const [countries,setCountries] = React.useState([]);

  const fetchInfo = () => {
    return fetch(url)
    .then((res) => res.json())
    .then((data)=> setCountries(data))
  }
  useEffect(() => {
    fetchInfo();
  },[])

  const containerStyles = {
    backgroundColor: themes[theme].backgroundColor,
    color: themes[theme].color
  }
  return (
    <div style={containerStyles}>
      {showAllCountries && <Home theme={theme} setTheme={setTheme} styles={containerStyles} countries={countries}/>}
    </div>
  )
}

/*======================
#       COMPONENTS
=======================*/

//  NAVBAR
function Navbar(props)
{
  // eslint-disable-next-line
  const {theme, setTheme} = props
  function changeTheme()
  {
    setTheme((prevTheme) => prevTheme === "light" ? "dark" : "light")
  }
  return (
    <nav>
      <h2>Where in the World?</h2>
      <div className="switchTheme">
        {theme === "dark" && <FontAwesomeIcon icon={faMoon} onClick={changeTheme}/>}
        {theme === "light" && <FontAwesomeIcon icon={faSun} onClick={changeTheme}/>}
        <p>
          {theme === "light" && "Light Mode"}
          {theme === "dark" && "Dark Mode"}
        </p>
      </div>
    </nav>
  )
}

//  HOMEPAGE TO DISPLAY ALL COUNTRIES
function Home(props)
{
  const countries = props.countries;
  const headerStyles = {
    backgroundColor: themes[props.theme + 'Elements'].backgroundColor,
    color: themes[props.theme + 'Elements'].color,
    boxShadow: props.theme === "light" ? '0 3px 5px hsl(0, 0%, 52%)':''
  }
  const [region, setRegion] = React.useState('All');

  return (
  <main style={props.styles}>
    <header style={headerStyles}>
      <Navbar theme={props.theme} setTheme={props.setTheme}/>
    </header>
    <Search theme={props.theme} setRegion={setRegion}/>
    <DisplayCountries countries={countries} region={region} theme={props.theme}/>
  </main>
  )
}

//  SEARCH
function Search(props)
{
  const searchBoxStyle = {
    backgroundColor: themes[props.theme + 'Elements'].backgroundColor,
    color: themes[props.theme + 'Elements'].color,
  }
  const continents = ['Africa', 'Antarctic', 'Asia', 'Europe', 'Americas', 'Oceania'];
  function handleChange(event)
  {
    const continent = event.target.value;
    props.setRegion(continent)
  }
  return(
    <div className="search">
      <div className="inputBox">
        <label htmlFor="searchQuery"></label>
        <div className="input" style={searchBoxStyle}>
          <FontAwesomeIcon icon={faMagnifyingGlass} size = 'xl'/>
          <input 
            type="text" 
            id="searchQuery" 
            placeholder="Search for a country"
            style={searchBoxStyle}
            />
        </div>
      </div>
      <div className="filterBox">
        <select name="continents" style={searchBoxStyle} onChange={handleChange}>
          <option selected value="" disabled>Filter by Region</option>
          {
            continents.map((continent) => {
              return <option value={continent} style={searchBoxStyle}>{continent}</option>
            })
          }
        </select>
      </div>
    </div>
  )
}


//  DisplayAllCountries
function DisplayCountries(props) {
  const countryStyle = {
    backgroundColor: themes[props.theme + 'Elements'].backgroundColor,
    color: themes[props.theme + 'Elements'].color,
  }

  var countries = [];

  if (props.region === "All")
  {
    countries = props.countries
  }
  else
  {
    countries = props.countries.filter((country) => {
      return country.region === props.region;
    })
  }
  //  Loading Screen
  if (countries.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <section className="countries-grid">
      {countries.map((country) => {
        return (
          <div className="country" style={countryStyle}>
            <div className="flag">
              <img src={country.flags.png} alt={country.flags.alt}/>
            </div>
            <div className="country-content">
              <h2>{country.name.common}</h2>
              <p>Population: {country.population}</p>
              <p>Region: {country.region}</p>
              <p>Capital: {country.capital}</p>
            </div>
          </div>
        )
      })}
    </section>
  );
}