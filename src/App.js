import { FormControl, Select,MenuItem } from '@material-ui/core';
import React,{useState,useEffect} from 'react';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import {Card , CardContent} from '@material-ui/core';
import Table from './Table';
import {sortData,printStat} from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";



function App() {

  const [countries,setCountries] = useState([]);
  const [country,setCountry] = useState('WorldWide');
  const [countryInfo,setCountryInfo] =useState({});
  const [tableData,setTableData]=useState([]);
  const [mapCenter,setMapCenter]=useState({lat:34.80746,lng:-40.4796});
  const [mapZoom,setMapZoom]=useState(3);
  const [casesType,setCasesType] = useState('cases');
  

  

  useEffect(async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
    .then(response => response.json())
    .then(data => {
      const sortedData = sortData(data);
      setTableData(sortedData);
      setCountries(data);
    });
  },[]);

  useEffect(async () => {

    await fetch("https://disease.sh/v3/covid-19/all")   
    .then(response => response.json())
    .then(data => {      
      setCountryInfo(data);
    } );


  },[]);

  const onChangeCountry = async (event) => {
     const countrycode = event.target.value;
     setCountry(countrycode);
     
     const url = countrycode ==="WorldWide" ?
      "https://disease.sh/v3/covid-19/all" :
      `https://disease.sh/v3/covid-19/countries/${countrycode}`

     
        await fetch(url)
        .then(response => response.json())
        .then(data => {
          setCountry(countrycode);
          setCountryInfo(data);
          countrycode ==="WorldWide" ? setMapCenter({lat:34.80746,lng:-40.4796}) : setMapCenter({lat: data.countryInfo.lat, lng : data.countryInfo.long});
          setMapZoom(4);
        } );
     };
  

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1> COVID-19 TRACKER </h1>     
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onChangeCountry}>

              <MenuItem value="WorldWide">WorldWide</MenuItem>
              {countries.map( (country) => 
                  ( <MenuItem value= {country.countryInfo.iso2}> {country.country} <img className="app__flag" src={country.countryInfo.flag} alt="flag" /> </MenuItem> )
              )} 
                    
            </Select>

          </FormControl>

        </div>
        <div className ="app__stats">
          <InfoBox
              isRed
              active={casesType==="cases"} 
              onClick={e => setCasesType("cases")}
              title="Coranavirus Cases" 
              cases={printStat(countryInfo.todayCases)} 
              total={printStat(countryInfo.cases)}              
            /> 
          <InfoBox
              
              active={casesType==="recovered"} 
              onClick={e => setCasesType("recovered")} 
              title="Recovered" 
              cases={printStat(countryInfo.todayRecovered)} 
              total={printStat(countryInfo.recovered)} 
            />  
          <InfoBox 
              isRed
              active={casesType==="deaths"} 
              onClick={e => setCasesType("deaths")}
              title="Deaths" 
              cases={printStat(countryInfo.todayDeaths)} 
              total={printStat(countryInfo.deaths)} 
            />    
        </div>

        <Map center={mapCenter}
              zoom={mapZoom}
              countries={countries}
              casesType ={casesType} />

      </div>
      <Card className="app__right">
        <CardContent>
                <h3>Live cases by Country</h3>
                  <Table countries={tableData}/>
                <h3>Worldwide New {casesType}</h3>
                  <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
      
      
    </div>
  );
}

export default App;
