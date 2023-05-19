import React, { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faMagnifyingGlass, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';

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
  const [singleCountry, setSingleCountry] = React.useState({});
  const [theme, setTheme] = React.useState('light');
  const url='https://restcountries.com/v3.1/all';
  const [countries,setCountries] = React.useState([]);

  const fetchInfo = async () => {
      const res = await fetch(url);
      const data = await res.json();
      return setCountries(data);
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
      {showAllCountries 
      && 
      <Home 
        theme={theme} 
        setTheme={setTheme} 
        styles={containerStyles} 
        countries={countries}
        showAllCountries={setShowAllCountries}
        setSingleCountry={setSingleCountry}
      />}
      {!showAllCountries
      &&
      <SingleState
        countries={countries}
        setShowAllCountries={setShowAllCountries}
        country={singleCountry}
        theme={theme} 
        setTheme={setTheme} 
        styles={containerStyles}/>
      }
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
    boxShadow: props.theme === "light" ? '0 2px 3px hsl(0, 0%, 52%)':''
  }
  const [region, setRegion] = React.useState('All');
  const [filteredCountry, setFilteredCountry] = React.useState('')
  return (
  <main style={props.styles}>
    <header style={headerStyles}>
      <Navbar theme={props.theme} setTheme={props.setTheme}/>
    </header>
    <Search 
      theme={props.theme} 
      setRegion={setRegion} 
      setFilteredCountry={setFilteredCountry}
    />
    <DisplayCountries 
      countries={countries} 
      region={region} 
      theme={props.theme} 
      filteredCountry={filteredCountry}
      showAllCountries={props.showAllCountries}
      setSingleCountry={props.setSingleCountry}
    />
  </main>
  )
}

//  SEARCH
function Search(props)
{
  const searchBoxStyle = {
    backgroundColor: themes[props.theme + 'Elements'].backgroundColor,
    color: themes[props.theme + 'Elements'].color,
    boxShadow: props.theme === "light" ? '0 0 1px 1px hsl(0, 0%, 70%)':''
  }
  const continents = ['Africa', 'Antarctic', 'Asia', 'Europe', 'Americas', 'Oceania'];
  function changeRegion(event)
  {
    const continent = event.target.value;
    props.setRegion(continent)
  }
  function filterCountry(event)
  {
    const country = event.target.value;
    props.setFilteredCountry(country);
  }
  return(
    <div className="search">
      <div className="inputBox">
        <label htmlFor="searchQuery"></label>
        <div className="input" style={searchBoxStyle}>
          <FontAwesomeIcon icon={faMagnifyingGlass} size = 'xl' className="icon"/>
          <input
            type="text"
            id="searchQuery"
            placeholder="Search for a country"
            onChange={filterCountry}
            />
        </div>
      </div>
      <div className="filterBox">
        <select name="continents" style={searchBoxStyle} onChange={changeRegion}>
          <option selected value="" disabled>Filter by Region</option>
          {
            continents.map((continent) => {
              return ( 
              <option value={continent} key={continent} style={searchBoxStyle}>
                {continent}
              </option>)
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
    boxShadow: props.theme === "light" ? '0 0 1px 1px hsl(0, 0%, 70%)':''
  }

  var countries = [];

  if (props.region === "All")
  {
    countries = props.countries
  }
  else if (props.region !== "All")
  {
    countries = props.countries.filter((country) => {
      return country.region === props.region;
    })
  }

  if (props.filteredCountry !== '')
  {
    countries = props.countries.filter((country) => {
      return country.name.common.toLowerCase().includes(props.filteredCountry);
    })
  }
  //  Loading Screen
  if (countries.length === 0) {
    return <p>Loading...</p>;
  }

  function handleClickCountry(country)
  {
    props.showAllCountries((prev) => !prev);
    props.setSingleCountry(country);
  }

  return (
    <section className="countries-grid">
      {countries.map((country) => {
        return (
          <div onClick={()=>{handleClickCountry(country)}} className="country" style={countryStyle}>
            <div className="flag">
              <img src={country.flags.png} alt={country.flags.alt}/>
            </div>
            <div className="country-content">
              <h2>{country.name.common}</h2>
              <p><strong>Population</strong>: {country.population.toLocaleString()}</p>
              <p><strong>Region</strong>: {country.region}</p>
              <p><strong>Capital</strong>: {country.capital}</p>
            </div>
          </div>
        )
      })}
    </section>
  );
}

function SingleState(props)
{
  const elementStyles = {
    backgroundColor: themes[props.theme + 'Elements'].backgroundColor,
    color: themes[props.theme + 'Elements'].color,
    boxShadow: props.theme === "light" ? '0 2px 3px hsl(0, 0%, 52%)':''
  }

  const tagStyle = {
    backgroundColor: themes[props.theme + 'Elements'].backgroundColor,
    color: themes[props.theme + 'Elements'].color,
    boxShadow: props.theme === "light" ? '0 0 3px hsl(0, 0%, 52%)':''
  }

  function handleClick()
  {
    props.setShowAllCountries(true);
  }
  return (
    <main>
      <header style={elementStyles}>
        <Navbar theme={props.theme} setTheme={props.setTheme}/>
      </header>
      <div className="btn-container-sr">
        <button style={elementStyles} onClick={handleClick}>
          <FontAwesomeIcon icon={faArrowLeftLong} />
          back
          </button>
      </div>
      <div className="single-country-container">
        <div className="flag-container">
          <img src={props.country.flags.png} alt={props.country.flags.alt}/>
        </div>
        <div className="text-container">
          <h2>{props.country.name.common}</h2>
          <div className="grid-2">
            <div>
              <p>
                Native Name: 
                <span>
                  {props.country.name.nativeName[Object.keys(props.country.name.nativeName)[0]].common}
                </span>
              </p>
              <p>
                Population:
                <span>
                  {props.country.population.toLocaleString()}
                </span>
              </p>
              <p>
                Region:
                <span>
                  {props.country.region}
                </span> 
              </p>
              <p>
                Sub Region:
                <span>
                  {props.country.subregion}
                </span>
              </p>
              <p>
                Capital:
                <span>
                  {props.country.capital[0]}
                </span> 
              </p>
            </div>
            <div>
              <p>
                Top Level Domain:
                <span>
                  {props.country.tld[0]}
                </span> 
              </p>
              <p>
                Currencies:
                <span>
                  {Object.keys(props.country.currencies)[0]}
                </span> 
              </p>
              <p>
                Region:
                <span>
                  {props.country.region}
                </span> 
              </p>
              <p>
                Sub Region:
                <span>
                  {props.country.subregion}
                </span> 
              </p>
              <p>
                Capital:
                <span>
                  {props.country.capital[0]}
                </span> 
              </p>
            </div>
          </div>
          <div className="borders">
            <p>Border Countries: </p>
            <div className="border-country-tags">
              {props.country.borders && props.countries
                .filter((cont) => props.country.borders.includes(cont.fifa))
                .map((bor) => (
                <div style={tagStyle}>
                  {bor.name.common}
                </div>
              ))}
              {!props.country.borders && "Unknown"}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}