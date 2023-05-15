import React, { useState, useEffect, useRef } from 'react';

import { Link, withRouter, Redirect } from "react-router-dom";
import { buildStyles, CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ProgressProvider from "components/general/CircularProgressBarAnimation/ProgressProvider";
import arrowhead from "assets/img/arrowhead.png";
import arrowhead_white from "assets/img/arrowhead_white.png";
import red from "assets/img/red.png";
import yellow from "assets/img/yellow.png";
import green from "assets/img/green.png";

// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Row,
    Container,
    Col,
    Collapse,
    Progress,
} from "reactstrap";

function DashboardCard(props) {
    const [systems, setSystems] = useState([]);
    const [systems_by_kashir, setSystems_by_kashir] = useState([]);
    const [systems_by_lo_kashir, setSystems_by_lo_kashir] = useState([]);
    //
    const [systems_by_lo_kashir_intipul, setSystems_by_lo_kashir_intipul] = useState([]);
    const [systems_by_lo_kashir_harigtipul, setSystems_by_lo_kashir_harigtipul] = useState([]);
    const [systems_by_lo_kashir_takalotmizdamnot, setSystems_by_lo_kashir_takalotmizdamnot] = useState([]);
    const [systems_by_lo_kashir_hhstand_intipul, setSystems_by_lo_kashir_hhstand_intipul] = useState([]);
    const [systems_by_lo_kashir_hhstand_harigtipul, setSystems_by_lo_kashir_hhstand_harigtipul] = useState([]);
    const [systems_by_lo_kashir_hhstand_takalotmizdamnot, setSystems_by_lo_kashir_hhstand_takalotmizdamnot] = useState([]);
    //
    const [collapseOpen, setcollapseOpen] = useState(false);

    const toggleCollapse = (event) => {
        setcollapseOpen(!collapseOpen);
    };

    function init() {
        let temp_systems = props.systemsonZs;
        let temp_systems_by_kashir;
        let temp_systems_by_lo_kashir;

        temp_systems_by_kashir = temp_systems.filter(system => (system.kshirot == 'כשיר'));
        temp_systems_by_lo_kashir = temp_systems.filter(system => (system.kshirot == 'לא כשיר'));

        //calculate intipul/harigtipul/takalotmizdamnot
        let temp_systems_by_lo_kashir_intipul = [];
        let temp_systems_by_lo_kashir_harigtipul = [];
        let temp_systems_by_lo_kashir_takalotmizdamnot = [];
        let temp_systems_by_lo_kashir_hhstand_intipul = [];
        let temp_systems_by_lo_kashir_hhstand_harigtipul = [];
        let temp_systems_by_lo_kashir_hhstand_takalotmizdamnot = [];
        for (let i = 0; i < temp_systems_by_lo_kashir.length; i++) {
            let is_intipul = false;
            let is_harigtipul = false;
            let is_takalotmizdamnot = false;
            let is_hhstand_intipul = false;
            let is_hhstand_harigtipul = false;
            let is_hhstand_takalotmizdamnot = false;

            for (let j = 0; j < temp_systems_by_lo_kashir[i].tipuls.length; j++) {
                if (temp_systems_by_lo_kashir[i].tipuls[j].type == 'tipul') {
                    is_intipul = true;
                    if(temp_systems_by_lo_kashir[i].tipuls[j].hh_stands){
                        is_hhstand_intipul = true;
                    }
                }
                if (temp_systems_by_lo_kashir[i].tipuls[j].type == 'harig_tipul') {
                    is_harigtipul = true;
                    if(temp_systems_by_lo_kashir[i].tipuls[j].hh_stands){
                        is_hhstand_harigtipul = true;
                    }
                }
                if (temp_systems_by_lo_kashir[i].tipuls[j].type == 'takala_mizdamenet') {
                    is_takalotmizdamnot = true;
                    if(temp_systems_by_lo_kashir[i].tipuls[j].hh_stands){
                        is_hhstand_takalotmizdamnot = true;
                    }
                }
            }
            if (is_intipul)
                temp_systems_by_lo_kashir_intipul.push(temp_systems_by_lo_kashir[i]);
            if (is_harigtipul)
                temp_systems_by_lo_kashir_harigtipul.push(temp_systems_by_lo_kashir[i]);
            if (is_takalotmizdamnot)
                temp_systems_by_lo_kashir_takalotmizdamnot.push(temp_systems_by_lo_kashir[i]);
            if (is_hhstand_intipul)
                temp_systems_by_lo_kashir_hhstand_intipul.push(temp_systems_by_lo_kashir[i]);
            if (is_hhstand_harigtipul)
                temp_systems_by_lo_kashir_hhstand_harigtipul.push(temp_systems_by_lo_kashir[i]);
            if (is_hhstand_takalotmizdamnot)
                temp_systems_by_lo_kashir_hhstand_takalotmizdamnot.push(temp_systems_by_lo_kashir[i]);
        }

        setSystems(temp_systems.length);
        setSystems_by_kashir(temp_systems_by_kashir.length);
        setSystems_by_lo_kashir(temp_systems_by_lo_kashir.length);
        setSystems_by_lo_kashir_intipul(temp_systems_by_lo_kashir_intipul.length);
        setSystems_by_lo_kashir_harigtipul(temp_systems_by_lo_kashir_harigtipul.length);
        setSystems_by_lo_kashir_takalotmizdamnot(temp_systems_by_lo_kashir_takalotmizdamnot.length);
        setSystems_by_lo_kashir_hhstand_intipul(temp_systems_by_lo_kashir_hhstand_intipul.length);
        setSystems_by_lo_kashir_hhstand_harigtipul(temp_systems_by_lo_kashir_hhstand_harigtipul.length);
        setSystems_by_lo_kashir_hhstand_takalotmizdamnot(temp_systems_by_lo_kashir_hhstand_takalotmizdamnot.length);
    }

    useEffect(() => {
        init();
    }, [props])

    return (
        systems != 0 ?
            <Col xs={12} md={3}>
                <Card style={{ boxShadow: 'rgb(123 123 123 / 20%) 0px 2px 5px 5px'}}>
                    <CardHeader style={{padding:'0px'}}>
                    <div style={{textAlign:'right'}}>
                         {props.theme == "white-content" ?
                             props.systemtype == 'allsystems' ? <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/dashboardtechpage/dividesystems/nosystemname`}><img style={{cursor: 'pointer' }} src={arrowhead} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px',marginBottom:'0px' }}>כשירות טכנולוגיות ע"ג פלטפורמות</h3></>
                             :  props.systemtype == 'dividesystems' ? <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/dashboardtechpage/mkabaz/${props.systemname}`}><img style={{cursor: 'pointer' }} src={arrowhead} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px',marginBottom:'0px' }}>כשירות {props.systemname}</h3></>
                                :  props.systemtype == 'mkabaz' ? <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/dashboardtechpage/makat`}><img style={{cursor: 'pointer' }} src={arrowhead} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px',marginBottom:'0px' }}>כשירות טכנולוגיות ע"ג פלטפורמות</h3></>
                                    :  <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px',marginBottom:'0px' }}>כשירות טכנולוגיות ע"ג פלטפורמות</h3>
                            : 
                                props.systemtype == 'allsystems' ? <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/dashboardtechpage/dividesystems`}><img style={{cursor: 'pointer' }} src={arrowhead_white} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px',marginBottom:'0px' }}>כשירות טכנולוגיות ע"ג פלטפורמות</h3></>
                                :  props.systemtype == 'dividesystems' ? <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/dashboardtechpage/mkabaz/${props.systemname}`}><img style={{cursor: 'pointer' }} src={arrowhead_white} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px',marginBottom:'0px' }}>כשירות {props.systemname}</h3></>
                                    :  props.systemtype == 'mkabaz' ? <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/dashboardtechpage/makat`}><img style={{cursor: 'pointer' }} src={arrowhead_white} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px',marginBottom:'0px' }}>כשירות טכנולוגיות ע"ג פלטפורמות</h3></>
                                        :  <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px',marginBottom:'0px' }}>כשירות טכנולוגיות ע"ג פלטפורמות</h3>
                         }
                    </div>
                    </CardHeader>
                    <CardBody style={{ textAlign: 'center', margin: 'auto', cursor: 'pointer'  }} onClick={(e) => toggleCollapse(e)}>
                        <div style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                            {(systems != 0 ? ((systems_by_kashir / systems) * 100) : 0) < 60 ?
                                <ProgressProvider valueStart={0} valueEnd={(systems != 0 ? ((systems_by_kashir / systems) * 100) : 0)}>
                                    {value => <CircularProgressbarWithChildren value={value} /*text={`${value}%`}*/ styles={{
                                        root: {},
                                        path: {
                                            stroke: `#ff2128`,
                                            strokeLinecap: 'butt',
                                            transition: 'stroke-dashoffset 0.5s ease 0s',
                                        },
                                        trail: {
                                            stroke: 'rgb(141 141 141 / 30%)',
                                            strokeLinecap: 'butt',
                                            transform: 'rotate(0.25turn)',
                                            transformOrigin: 'center center',
                                        },
                                        text: {
                                            fill: '#ff2128',
                                            fontSize: '18px',
                                        },
                                        background: {
                                            fill: '#3e98c7',
                                        },
                                    }}>
                                        <div>
                                            <h2 style={{ margin: '0px' }}>{`${value.toFixed(0)}%`}</h2>
                                        </div>
                                        <div style={{ fontSize: 12, marginTop: -2 }}>
                                            <h5 style={{ margin: '0px' }}>{systems_by_kashir + '/' + systems}</h5>
                                        </div>
                                    </CircularProgressbarWithChildren>}
                                </ProgressProvider>
                                : (systems != 0 ? ((systems_by_kashir / systems) * 100) : 0) < 80 ?
                                    <ProgressProvider valueStart={0} valueEnd={(systems != 0 ? ((systems_by_kashir / systems) * 100) : 0)}>
                                        {value => <CircularProgressbarWithChildren value={value} /*text={`${value}%`}*/ styles={{
                                            root: {},
                                            path: {
                                                stroke: `#ffca3a`,
                                                strokeLinecap: 'butt',
                                                transition: 'stroke-dashoffset 0.5s ease 0s',
                                            },
                                            trail: {
                                                stroke: 'rgb(141 141 141 / 30%)',
                                                strokeLinecap: 'butt',
                                                transform: 'rotate(0.25turn)',
                                                transformOrigin: 'center center',
                                            },
                                            text: {
                                                fill: '#ffca3a',
                                                fontSize: '18px',
                                            },
                                            background: {
                                                fill: '#3e98c7',
                                            },
                                        }}>
                                            <div>
                                                <h2 style={{ margin: '0px' }}>{`${value.toFixed(0)}%`}</h2>
                                            </div>
                                            <div style={{ fontSize: 12, marginTop: -2 }}>
                                                <h5 style={{ margin: '0px' }}>{systems_by_kashir + '/' + systems}</h5>
                                            </div>
                                        </CircularProgressbarWithChildren>}
                                    </ProgressProvider>
                                    : (systems != 0 ? ((systems_by_kashir / systems) * 100) : 0) <= 100 ?
                                        <ProgressProvider valueStart={0} valueEnd={(systems != 0 ? ((systems_by_kashir / systems) * 100) : 0)}>
                                            {value => <CircularProgressbarWithChildren value={value} /*text={`${value}%`}*/ styles={{
                                                root: {},
                                                path: {
                                                    stroke: `#8ac926`,
                                                    strokeLinecap: 'butt',
                                                    transition: 'stroke-dashoffset 0.5s ease 0s',
                                                },
                                                trail: {
                                                    stroke: 'rgb(141 141 141 / 30%)',
                                                    strokeLinecap: 'butt',
                                                    transform: 'rotate(0.25turn)',
                                                    transformOrigin: 'center center',
                                                },
                                                text: {
                                                    fill: '#8ac926',
                                                    fontSize: '18px',
                                                },
                                                background: {
                                                    fill: '#3e98c7',
                                                },
                                            }}>
                                                <div>
                                                    <h2 style={{ margin: '0px' }}>{`${value.toFixed(0)}%`}</h2>
                                                </div>
                                                <div style={{ fontSize: 12, marginTop: -2 }}>
                                                    <h5 style={{ margin: '0px' }}>{systems_by_kashir + '/' + systems}</h5>
                                                </div>
                                            </CircularProgressbarWithChildren>}
                                        </ProgressProvider>
                                        : null}
                        </div>
                        {/* מקרא לצבעים */}
                        <div style={{display: 'inline-flex', marginTop:'10px'}}>
                            <img src={green} height="20px" style={{marginLeft:'5px'}}/>
                            <p>80-100</p>

                            <img src={yellow} height="20px" style={{marginLeft:'5px', marginRight:'10px'}}/>
                            <p>60-80</p>

                            <img src={red} height="20px" style={{marginLeft:'5px', marginRight:'10px'}}/>
                            <p>0-60</p>
                        </div>

                        {collapseOpen ?
                            <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto', paddingTop: '25px' }}>
                                <h6>טכנולוגיות בטיפול: {systems_by_lo_kashir_intipul} <span style={{color:'DarkTurquoise'}}>(חלפים: {systems_by_lo_kashir_hhstand_intipul})</span></h6>
                                <Progress color="guyblue" value={(systems_by_lo_kashir != 0 ? ((systems_by_lo_kashir_intipul / systems_by_lo_kashir) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(systems_by_lo_kashir != 0 ? ((systems_by_lo_kashir_intipul / systems_by_lo_kashir) * 100) : 0).toFixed(0)}%</Progress>
                                <h6>טכנולוגיות חריגי טיפול:  {systems_by_lo_kashir_harigtipul} <span style={{color:'DarkTurquoise'}}>(חלפים: {systems_by_lo_kashir_hhstand_harigtipul})</span></h6>
                                <Progress color="guyblue" value={(systems_by_lo_kashir != 0 ? ((systems_by_lo_kashir_harigtipul / systems_by_lo_kashir) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(systems_by_lo_kashir != 0 ? ((systems_by_lo_kashir_harigtipul / systems_by_lo_kashir) * 100) : 0).toFixed(0)}%</Progress>
                                <h6>טכנולוגיות בתקלות מזדמנות: {systems_by_lo_kashir_takalotmizdamnot} <span style={{color:'DarkTurquoise'}}>(חלפים: {systems_by_lo_kashir_hhstand_takalotmizdamnot})</span></h6>
                                <Progress color="guyblue" value={(systems_by_lo_kashir != 0 ? ((systems_by_lo_kashir_takalotmizdamnot / systems_by_lo_kashir) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(systems_by_lo_kashir != 0 ? ((systems_by_lo_kashir_takalotmizdamnot / systems_by_lo_kashir) * 100) : 0).toFixed(0)}%</Progress>
                            </div>
                            : null}
                    </CardBody>
                </Card>
            </Col> : null
    );
}

export default withRouter(DashboardCard);