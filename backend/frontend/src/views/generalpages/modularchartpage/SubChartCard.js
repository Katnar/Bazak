import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter, Redirect } from "react-router-dom";
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Container,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Alert,
    Spinner,
    Label,
    Col,
    Modal,
    ModalBody,
    CardFooter,
    Progress
} from "reactstrap";
import axios from 'axios';
import history from 'history.js'
import { signin, authenticate, isAuthenticated } from 'auth/index';
import { produce } from 'immer'
import { generate } from 'shortid'
import { toast } from "react-toastify";
import { buildStyles, CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ProgressProvider from "components/general/CircularProgressBarAnimation/ProgressProvider";
import editpic from "assets/img/edit.png";
import deletepic from "assets/img/delete.png";
import arrowhead from "assets/img/arrowhead.png";
import arrowhead_white from "assets/img/arrowhead_white.png";
import red from "assets/img/red.png";
import yellow from "assets/img/yellow.png";
import green from "assets/img/green.png";

const SubChartCard = (props) => { //instate - zamin/kashir
    const [cardata_by_chart, setCardata_by_chart] = useState(0)
    const [cardata_by_chart_instate, setCardata_by_chart_instate] = useState(0)
    const [cardata_by_chart_not_instate, setCardata_by_chart_not_instate] = useState(0)
    //
    const [cardata_by_chart_intipul, setCardata_by_chart_intipul] = useState(0)
    const [cardata_by_chart_harigtipul, setCardata_by_chart_harigtipul] = useState(0)
    const [cardata_by_chart_takalotmizdamnot, setCardata_by_chart_takalotmizdamnot] = useState(0)
    const [cardata_by_chart_hhstand_intipul, setCardata_by_chart_hhstand_intipul] = useState(0)
    const [cardata_by_chart_hhstand_harigtipul, setCardata_by_chart_hhstand_harigtipul] = useState(0)
    const [cardata_by_chart_hhstand_takalotmizdamnot, setCardata_by_chart_hhstand_takalotmizdamnot] = useState(0)
    //
    const [collapseOpen, setcollapseOpen] = useState(false);

    const toggleCollapse = (event) => {
        setcollapseOpen(!collapseOpen);
    };

    function init() {
        let temp_cardata_by_chart;
        let temp_cardata_by_chart_instate;
        let temp_cardata_by_chart_not_instate;

        temp_cardata_by_chart = props.cardatas;
        
        //filter by chartdata
        if (props.chart.units && props.chart.units.length > 0) {
            let temp_cardata_by_chart_copy3 = []
            for (let i = 0; i < props.chart.units.length; i++) {
                let lastKey = Object.keys(props.chart.units[i]).pop();
                let lastValue = props.chart.units[i][Object.keys(props.chart.units[i]).pop()]
                let temp = [];
                for(let j=0;j<lastValue.length;j++){
                    temp = temp.concat(temp_cardata_by_chart.filter(cardata => ((cardata[lastKey] == lastValue[j]))));
                }
                temp_cardata_by_chart_copy3 = temp_cardata_by_chart_copy3.concat(temp);//theres duplicates
            }
            temp_cardata_by_chart = [...new Set(temp_cardata_by_chart_copy3)]; // removes duplicates
        }

        if (props.chart.tenetree && props.chart.tenetree != undefined) {
            let temp_cardata_by_chart_copy4 = []
            let temp = [];
            let lastKey = Object.keys(props.chart.tenetree).pop();
            let lastValue = props.chart.tenetree[lastKey]
            temp = temp.concat(temp_cardata_by_chart.filter(cardata => ((cardata[lastKey] == lastValue))));
            temp_cardata_by_chart_copy4 = temp_cardata_by_chart_copy4.concat(temp);//theres duplicates
            temp_cardata_by_chart = [...new Set(temp_cardata_by_chart_copy4)];// removes duplicates
        }

        let temp_cardata_by_chart_copy1 = []
        for (let i = 0; i < props.chart.stand.length; i++) {
            let temp = temp_cardata_by_chart.filter(cardata => ((cardata.stand == props.chart.stand[i])));
            temp_cardata_by_chart_copy1 = temp_cardata_by_chart_copy1.concat(temp)
        }
        temp_cardata_by_chart = temp_cardata_by_chart_copy1;

        let temp_cardata_by_chart_copy2 = []
        for (let i = 0; i < props.chart.status.length; i++) {
            let temp = temp_cardata_by_chart.filter(cardata => ((cardata.status == props.chart.status[i])));
            temp_cardata_by_chart_copy2 = temp_cardata_by_chart_copy2.concat(temp)
        }
        temp_cardata_by_chart = temp_cardata_by_chart_copy2;

        //filter by zamin/kashir
        if (props.theme == 'white-content') {
            temp_cardata_by_chart_instate = temp_cardata_by_chart.filter(cardata => ((cardata.zminot == 'זמין')));
            temp_cardata_by_chart_not_instate = temp_cardata_by_chart.filter(cardata => ((cardata.zminot != 'זמין')));
        }
        else {
            temp_cardata_by_chart_instate = temp_cardata_by_chart.filter(cardata => ((cardata.kshirot == 'כשיר')));
            temp_cardata_by_chart_not_instate = temp_cardata_by_chart.filter(cardata => ((cardata.kshirot != 'כשיר')));
        }

        //calculate intipul/harigtipul/takalotmizdamnot/hhstand
        let temp_cardata_by_chart_intipul = [];
        let temp_cardata_by_chart_harigtipul = [];
        let temp_cardata_by_chart_takalotmizdamnot = [];
        let temp_cardata_by_chart_hhstand_intipul = [];
        let temp_cardata_by_chart_hhstand_harigtipul = [];
        let temp_cardata_by_chart_hhstand_takalotmizdamnot = [];
        for (let i = 0; i < temp_cardata_by_chart_not_instate.length; i++) {
            let is_intipul = false;
            let is_harigtipul = false;
            let is_takalotmizdamnot = false;
            let is_hhstand_intipul = false;
            let is_hhstand_harigtipul = false;
            let is_hhstand_takalotmizdamnot = false;

            for (let j = 0; j < temp_cardata_by_chart_not_instate[i].tipuls.length; j++) {
                if (temp_cardata_by_chart_not_instate[i].tipuls[j].type == 'tipul') {
                    is_intipul = true;
                    if(temp_cardata_by_chart_not_instate[i].tipuls[j].hh_stands){
                        is_hhstand_intipul = true;
                    }
                }
                if (temp_cardata_by_chart_not_instate[i].tipuls[j].type == 'harig_tipul') {
                    is_harigtipul = true;
                    if(temp_cardata_by_chart_not_instate[i].tipuls[j].hh_stands){
                        is_hhstand_harigtipul = true;
                    }
                }
                if (temp_cardata_by_chart_not_instate[i].tipuls[j].type == 'takala_mizdamenet') {
                    is_takalotmizdamnot = true;
                    if(temp_cardata_by_chart_not_instate[i].tipuls[j].hh_stands){
                        is_hhstand_takalotmizdamnot = true;
                    }
                }
            }
            if (is_intipul)
                temp_cardata_by_chart_intipul.push(temp_cardata_by_chart_not_instate[i])
            if (is_harigtipul)
                temp_cardata_by_chart_harigtipul.push(temp_cardata_by_chart_not_instate[i])
            if (is_takalotmizdamnot)
                temp_cardata_by_chart_takalotmizdamnot.push(temp_cardata_by_chart_not_instate[i])
            if (is_hhstand_intipul)
                temp_cardata_by_chart_hhstand_intipul.push(temp_cardata_by_chart_not_instate[i])
            if (is_hhstand_harigtipul)
                temp_cardata_by_chart_hhstand_harigtipul.push(temp_cardata_by_chart_not_instate[i])
            if (is_hhstand_takalotmizdamnot)
                temp_cardata_by_chart_hhstand_takalotmizdamnot.push(temp_cardata_by_chart_not_instate[i])
        }

        setCardata_by_chart(temp_cardata_by_chart.length)
        setCardata_by_chart_instate(temp_cardata_by_chart_instate.length)
        setCardata_by_chart_not_instate(temp_cardata_by_chart_not_instate.length)

        setCardata_by_chart_intipul(temp_cardata_by_chart_intipul.length);
        setCardata_by_chart_harigtipul(temp_cardata_by_chart_harigtipul.length);
        setCardata_by_chart_takalotmizdamnot(temp_cardata_by_chart_takalotmizdamnot.length);
        setCardata_by_chart_hhstand_intipul(temp_cardata_by_chart_hhstand_intipul.length);
        setCardata_by_chart_hhstand_harigtipul(temp_cardata_by_chart_hhstand_harigtipul.length);
        setCardata_by_chart_hhstand_takalotmizdamnot(temp_cardata_by_chart_hhstand_takalotmizdamnot.length);
    }

    useEffect(() => {
        init();
    }, [props])

    return (
        cardata_by_chart != 0 ?
            <div style={{ width: `${100 / 4}%`, paddingLeft: '15px', paddingRight: '15px' }}>
                <Card style={{ boxShadow: 'rgb(123 123 123 / 20%) 0px 2px 5px 5px' }}>
                    <CardHeader style={{ padding: '0px' }}>
                        <div style={{ textAlign: 'right' }}>
                            {props.theme == "white-content" ?
                                Object.keys(props.chart.tenetree).pop() == 'magadal' ? <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/modularchartpage/${props.match.params.chartid}/magad/${props.chart.tenetree[Object.keys(props.chart.tenetree).pop()]}`}><img style={{ cursor: 'pointer' }} src={arrowhead} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px', marginBottom: '0px' }}>זמינות {props.chart.name}</h3></>
                                    : Object.keys(props.chart.tenetree).pop() == 'magad' ? <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/modularchartpage/${props.match.params.chartid}/mkabaz/${props.chart.tenetree[Object.keys(props.chart.tenetree).pop()]}`}><img style={{ cursor: 'pointer' }} src={arrowhead} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px', marginBottom: '0px' }}>זמינות {props.chart.name}</h3></>
                                        : Object.keys(props.chart.tenetree).pop() == 'mkabaz' ? <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/modularchartpage/${props.match.params.chartid}/makat/${props.chart.tenetree[Object.keys(props.chart.tenetree).pop()]}`}><img style={{ cursor: 'pointer' }} src={arrowhead} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px', marginBottom: '0px' }}>זמינות {props.chart.name}</h3></>
                                            : <h3 style={{ textAlign: 'center', fontWeight: 'bold', margin: '0px' }}>זמינות {props.chart.name}</h3>

                                : Object.keys(props.chart.tenetree).pop() == 'magadal' ? <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/modularchartpage/${props.match.params.chartid}/magad/${props.chart.tenetree[Object.keys(props.chart.tenetree).pop()]}`}><img style={{ cursor: 'pointer' }} src={arrowhead_white} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px', marginBottom: '0px' }}>כשירות {props.chart.name}</h3></>
                                    : Object.keys(props.chart.tenetree).pop() == 'magad' ? <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/modularchartpage/${props.match.params.chartid}/mkabaz/${props.chart.tenetree[Object.keys(props.chart.tenetree).pop()]}`}><img style={{ cursor: 'pointer' }} src={arrowhead_white} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px', marginBottom: '0px' }}>כשירות {props.chart.name}</h3></>
                                        : Object.keys(props.chart.tenetree).pop() == 'mkabaz' ? <><Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/modularchartpage/${props.match.params.chartid}/makat/${props.chart.tenetree[Object.keys(props.chart.tenetree).pop()]}`}><img style={{ cursor: 'pointer' }} src={arrowhead_white} height='40px'></img></Link><h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '-40px', marginBottom: '0px' }}>כשירות {props.chart.name}</h3></>
                                            : <h3 style={{ textAlign: 'center', fontWeight: 'bold', margin: '0px' }}>כשירות {props.chart.name}</h3>}
                        </div>
                    </CardHeader>
                    <CardBody style={{ textAlign: 'center', margin: 'auto', cursor: 'pointer'}} onClick={(e) => toggleCollapse(e)}>
                        <div style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                            {(cardata_by_chart != 0 ? ((cardata_by_chart_instate / cardata_by_chart) * 100) : 0) <= props.chart.redcolor ?
                                <ProgressProvider valueStart={0} valueEnd={(cardata_by_chart != 0 ? ((cardata_by_chart_instate / cardata_by_chart) * 100) : 0)}>
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
                                            <h5 style={{ margin: '0px' }}>{cardata_by_chart_instate + '/' + cardata_by_chart}</h5>
                                        </div>
                                    </CircularProgressbarWithChildren>}
                                </ProgressProvider>
                                : (cardata_by_chart != 0 ? ((cardata_by_chart_instate / cardata_by_chart) * 100) : 0) <= props.chart.yellowcolor  ?
                                    <ProgressProvider valueStart={0} valueEnd={(cardata_by_chart != 0 ? ((cardata_by_chart_instate / cardata_by_chart) * 100) : 0)}>
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
                                                <h5 style={{ margin: '0px' }}>{cardata_by_chart_instate + '/' + cardata_by_chart}</h5>
                                            </div>
                                        </CircularProgressbarWithChildren>}
                                    </ProgressProvider>
                                    : (cardata_by_chart != 0 ? ((cardata_by_chart_instate / cardata_by_chart) * 100) : 0) <= 100 ?
                                        <ProgressProvider valueStart={0} valueEnd={(cardata_by_chart != 0 ? ((cardata_by_chart_instate / cardata_by_chart) * 100) : 0)}>
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
                                                    <h5 style={{ margin: '0px' }}>{cardata_by_chart_instate + '/' + cardata_by_chart}</h5>
                                                </div>
                                            </CircularProgressbarWithChildren>}
                                        </ProgressProvider>
                                        : null}
                        </div>
                       {/* מקרא לצבעים */}
                       <div style={{display: 'inline-flex', marginTop:'10px'}}>
                            {props.chart.yellowcolor !=0 ?
                            <>
                            <img src={green} height="20px" style={{marginLeft:'5px'}}/>
                            <p>{props.chart.yellowcolor}-100</p>
                            </>
                            :
                            <>
                            <img src={green} height="20px" style={{marginLeft:'5px'}}/>
                            <p>{props.chart.redcolor}-100</p>
                            </>} 
                            {props.chart.yellowcolor !=0 ?
                            <>
                            <img src={yellow} height="20px" style={{marginLeft:'5px', marginRight:'10px'}}/>
                            <p>{props.chart.redcolor}-{props.chart.yellowcolor}</p>
                            </>
                            :null}
                            {props.chart.redcolor !=0 ?
                            <>
                            <img src={red} height="20px" style={{marginLeft:'5px', marginRight:'10px'}}/>
                            <p>0-{props.chart.redcolor}</p>
                            </>
                            :null}
                        </div>
                        <div style={{textAlign: 'left', marginTop: `-${1.5*(props.chart.stand.length+1)}rem`,marginBottom:'1rem'}}>
                            {props.chart.stand.map(stand =>(
                                <h4 style={{marginBottom:'0px'}}>
                                    {stand}
                                </h4>
                            ))}
                        </div>

                        {collapseOpen ?
                            <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto', paddingTop: '25px' }}>
                            <h6>{props.chart.name} בטיפול: {cardata_by_chart_intipul} <span style={{color:'DarkTurquoise'}}>חלפים: {cardata_by_chart_hhstand_intipul})</span></h6>
                            <Progress color="guyblue" value={(cardata_by_chart_not_instate != 0 ? ((cardata_by_chart_intipul / cardata_by_chart_not_instate) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_chart_not_instate != 0 ? ((cardata_by_chart_intipul / cardata_by_chart_not_instate) * 100) : 0).toFixed(0)}%</Progress>
                            <h6>{props.chart.name} חריגי טיפול:  {cardata_by_chart_harigtipul} <span style={{color:'DarkTurquoise'}}>(חלפים: {cardata_by_chart_hhstand_harigtipul})</span></h6>
                            <Progress color="guyblue" value={(cardata_by_chart_not_instate != 0 ? ((cardata_by_chart_harigtipul / cardata_by_chart_not_instate) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_chart_not_instate != 0 ? ((cardata_by_chart_harigtipul / cardata_by_chart_not_instate) * 100) : 0).toFixed(0)}%</Progress>
                            <h6>{props.chart.name} בתקלות מזדמנות: {cardata_by_chart_takalotmizdamnot} <span style={{color:'DarkTurquoise'}}>(חלפים: {cardata_by_chart_hhstand_takalotmizdamnot})</span></h6>
                            <Progress color="guyblue" value={(cardata_by_chart_not_instate != 0 ? ((cardata_by_chart_takalotmizdamnot / cardata_by_chart_not_instate) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_chart_not_instate != 0 ? ((cardata_by_chart_takalotmizdamnot / cardata_by_chart_not_instate) * 100) : 0).toFixed(0)}%</Progress>
                            </div>
                            : null}
                    </CardBody>
                </Card>
            </div> : null
    );
}
export default withRouter(SubChartCard);;