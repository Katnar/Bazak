import React, {useState, useEffect, useRef } from 'react';

import {useParams, Link, withRouter, Redirect } from "react-router-dom";

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Container,
  Col,
  Collapse,
} from "reactstrap";
import axios from 'axios';
import { signin, authenticate, isAuthenticated } from 'auth/index';
import PropagateLoader from "react-spinners/PropagateLoader";

import DashboardTechCard from './DashboardTechCard';
import LatestUpdateDateComponent from 'components/bazak/LatestUpdateDateComponent/LatestUpdateDateComponent';

function DashboardPage({ match, theme }) {
  //user
  const { user } = isAuthenticated()
  //systems
  const [systemsonZs, setSystemsonZs] = useState([]);
  const [systemtypes, setSystemtypes] = useState([]);
  //spinner
  const [isdataloaded, setIsdataloaded] = useState(false);
  //
  const [mkabazs, setMkabazs] = useState([]);

  async function init() {
    setIsdataloaded(false);
    getSystemsonZs();
    if(match.params.systemtype == 'mkabaz'){
      await getMkabazs().then(await systemsByMkabaz(match.params.systemname));
    }
    getSystemTypes();
  }

  const systemsByMkabaz = async (systemname) => {
    
    let temp_systems = systemsonZs.filter(system => (system.systemType == systemname));
    let systemArr = [];
    
    for(let i=0;i<temp_systems.length;i++){
        await axios.get(`http://localhost:8000/api/cardata/cardatabycarnumber/${temp_systems[i].carnumber}`)
        .then(response =>{
        //    for(let j=0;j<systemArr.length;j++){
        //     if(response.data.mkabaz == systemArr[j].mkabaz){
              
        //     }
        //    }
        })
        .catch((error) => {
            console.log(error);
        })
    }
  }

  const getSystemsonZs = async () => {
    await axios.get(`http://localhost:8000/api/systemsonz`)
      .then(response => {
        setSystemsonZs(response.data)
        setIsdataloaded(true);
      })
      .catch((error) => {
        console.log(error);
      })
  }

   const getSystemTypes = async () => {
        await axios.get(`http://localhost:8000/api/system`)
          .then(response => {
            setSystemtypes(response.data)
          })
          .catch((error) => {
            console.log(error);
          })
      }

   const getMkabazs = async () => {
      await axios.get(`http://localhost:8000/api/mkabaz`)
        .then(response => {
            setMkabazs(response.data)
        })
        .catch((error) => {
          console.log(error);
        })
  }

  useEffect(() => {
    init();
  }, [])

  return (
    !isdataloaded ?
      <div style={{ width: '50%', marginTop: '30%' }}>
        <PropagateLoader color={'#ff4650'} loading={true} size={25} />
      </div>
      :
        <div>
          <Row>
          {match.params.systemtype == 'dividesystems' ?
          systemtypes.map((systemtype, i) => (
            systemtype ?
               <DashboardTechCard theme={theme} systemtype={match.params.systemtype} systemname={systemtype.name} systemsonZs={systemsonZs.filter(system => (system.systemType == systemtype.name))}/>
              : null))
          :null
        //   match.params.systemtype == 'mkabaz' ?

          }
          </Row>
        </div>
  );
}

export default withRouter(DashboardPage);