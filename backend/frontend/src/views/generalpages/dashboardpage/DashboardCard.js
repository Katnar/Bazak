import React, { useState, useEffect, useRef } from "react";

import { Link, withRouter, Redirect } from "react-router-dom";
import {
	buildStyles,
	CircularProgressbar,
	CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
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
import axios from "axios";

function DashboardCard(props) { //instate - zamin/kashir
    const [cardata_by_cartype, setCardata_by_cartype] = useState(0)
    const [cardata_by_cartype_instate, setCardata_by_cartype_instate] = useState(0)
    const [cardata_by_cartype_not_instate, setCardata_by_cartype_not_instate] = useState(0)
    //
    const [cardata_by_cartype_intipul, setCardata_by_cartype_intipul] = useState(0)
    const [cardata_by_cartype_harigtipul, setCardata_by_cartype_harigtipul] = useState(0)
    const [cardata_by_cartype_takalotmizdamnot, setCardata_by_cartype_takalotmizdamnot] = useState(0)
    const [cardata_by_cartype_hhstand_intipul, setCardata_by_cartype_hhstand_intipul] = useState(0)
    const [cardata_by_cartype_hhstand_harigtipul, setCardata_by_cartype_hhstand_harigtipul] = useState(0)
    const [cardata_by_cartype_hhstand_takalotmizdamnot, setCardata_by_cartype_hhstand_takalotmizdamnot] = useState(0)
    const [cardata_by_cartype_system_mooshbat, setCardata_by_cartype_system_mooshbat] = useState(0)
    const [cardata_by_cartype_systemonz, setCardata_by_cartype_systemonz] = useState(0)
    const [cardata_by_cartype_systemonz_hh, setCardata_by_cartype_systemonz_hh] = useState(0)
    //
    const [collapseOpen, setcollapseOpen] = useState(false);

	const toggleCollapse = (event) => {
		setcollapseOpen(!collapseOpen);
	};

	function init() {
		let temp_cardata_by_cartype;
		let temp_cardata_by_cartype_instate;
		let temp_cardata_by_cartype_not_instate;

		if (props.theme == "white-content") {
			switch (props.match.params.cartype) {
				case "magadal":
					temp_cardata_by_cartype = props.cardatas.filter(
						(cardata) =>
							cardata.stand == "סדיר" && cardata.magadal == props.cartype._id
					);
					break;
				case "magad":
					temp_cardata_by_cartype = props.cardatas.filter(
						(cardata) =>
							cardata.stand == "סדיר" && cardata.magad == props.cartype._id
					);
					break;
				case "mkabaz":
					temp_cardata_by_cartype = props.cardatas.filter(
						(cardata) =>
							cardata.stand == "סדיר" && cardata.mkabaz == props.cartype._id
					);
					break;
				default:
					temp_cardata_by_cartype = props.cardatas.filter(
						(cardata) =>
							cardata.stand == "סדיר" && cardata.magadal == props.cartype._id
					);
					break;
			}
			temp_cardata_by_cartype_instate = temp_cardata_by_cartype.filter(
				(cardata) => cardata.stand == "סדיר" && cardata.zminot == "זמין"
			);
			temp_cardata_by_cartype_not_instate = temp_cardata_by_cartype.filter(
				(cardata) => cardata.stand == "סדיר" && cardata.zminot != "זמין"
			);
		} else {
			switch (props.match.params.cartype) {
				case "magadal":
					temp_cardata_by_cartype = props.cardatas.filter(
						(cardata) => cardata.magadal == props.cartype._id
					);
					break;
				case "magad":
					temp_cardata_by_cartype = props.cardatas.filter(
						(cardata) => cardata.magad == props.cartype._id
					);
					break;
				case "mkabaz":
					temp_cardata_by_cartype = props.cardatas.filter(
						(cardata) => cardata.mkabaz == props.cartype._id
					);
					break;
				default:
					temp_cardata_by_cartype = props.cardatas.filter(
						(cardata) => cardata.magadal == props.cartype._id
					);
					break;
			}
			temp_cardata_by_cartype_instate = temp_cardata_by_cartype.filter(
				(cardata) => cardata.kshirot == "כשיר"
			);
			temp_cardata_by_cartype_not_instate = temp_cardata_by_cartype.filter(
				(cardata) => cardata.kshirot != "כשיר"
			);
		}

        //calculate intipul/harigtipul/takalotmizdamnot/hhstand
        let temp_cardata_by_cartype_intipul = [];
        let temp_cardata_by_cartype_harigtipul = [];
        let temp_cardata_by_cartype_takalotmizdamnot = [];
        let temp_cardata_by_cartype_systemonz = [];
        let temp_cardata_by_cartype_systemonz_mooshbat = 0;
        let temp_cardata_by_cartype_hhstand_intipul = [];
        let temp_cardata_by_cartype_hhstand_harigtipul = [];
        let temp_cardata_by_cartype_hhstand_takalotmizdamnot = [];
        let temp_system_hh = [];
        let unique = [];
        let unique1 = [];

        for (let i = 0; i < temp_cardata_by_cartype_not_instate.length; i++) {
            let is_intipul = false;
            let is_harigtipul = false;
            let is_takalotmizdamnot = false;
            let is_hhstand_intipul = false;
            let is_hhstand_harigtipul = false;
            let is_hhstand_takalotmizdamnot = false;
            let is_system_hh_multival = false;

            for (let j = 0; j < temp_cardata_by_cartype_not_instate[i].tipuls.length; j++) {
                if (temp_cardata_by_cartype_not_instate[i].tipuls[j].type == 'tipul') {
                    is_intipul = true;
                    if(temp_cardata_by_cartype_not_instate[i].tipuls[j].hh_stands){
                        is_hhstand_intipul = true;
                    }
                }
                if (temp_cardata_by_cartype_not_instate[i].tipuls[j].type == 'harig_tipul') {
                    is_harigtipul = true;
                    if(temp_cardata_by_cartype_not_instate[i].tipuls[j].hh_stands){
                        is_hhstand_harigtipul = true;
                    }
                }
                if (temp_cardata_by_cartype_not_instate[i].tipuls[j].type == 'takala_mizdamenet') {
                    is_takalotmizdamnot = true;
                    if(temp_cardata_by_cartype_not_instate[i].tipuls[j].hh_stands){
                        is_hhstand_takalotmizdamnot = true;
                    }
                }
            }

            if (is_intipul)
                temp_cardata_by_cartype_intipul.push(temp_cardata_by_cartype_not_instate[i])
            if (is_harigtipul)
                temp_cardata_by_cartype_harigtipul.push(temp_cardata_by_cartype_not_instate[i])
            if (is_takalotmizdamnot)
                temp_cardata_by_cartype_takalotmizdamnot.push(temp_cardata_by_cartype_not_instate[i])
            if (is_hhstand_intipul)
                temp_cardata_by_cartype_hhstand_intipul.push(temp_cardata_by_cartype_not_instate[i])
            if (is_hhstand_harigtipul)
                temp_cardata_by_cartype_hhstand_harigtipul.push(temp_cardata_by_cartype_not_instate[i])
            if (is_hhstand_takalotmizdamnot)
                temp_cardata_by_cartype_hhstand_takalotmizdamnot.push(temp_cardata_by_cartype_not_instate[i])
        
            const sys = props.systemsonz;
            sys.map((item) =>{
                if(item.carnumber == temp_cardata_by_cartype_not_instate[i].carnumber && item.mashbit[0].mashbit == true){
                    if(item.kshirot != "כשיר"){
                        temp_cardata_by_cartype_systemonz.push(temp_cardata_by_cartype_not_instate[i]);
                    }
                }
            });
            unique = [...new Map(temp_cardata_by_cartype_systemonz.map((m) => [m.carnumber,m])).values(),];
            const fl = sys.filter((item) => item.carnumber == temp_cardata_by_cartype_not_instate[i].carnumber && item.mashbit[0].mashbit == true);
            unique1 = [...new Map(fl.map((m) => [m.carnumber,m])).values()];
            temp_cardata_by_cartype_systemonz_mooshbat = unique1.length;
            sys.map((item) => {
                try{
                    if(item.carnumber == temp_cardata_by_cartype_not_instate[i].carnumber){
                        let temp = [];
                        temp.push(item.tipuls.map((m) => m.hh_stands.map((a) => a.missing_makat_2)).flat());
                        temp[0] = temp[0].reduce((acc,cv) => Number(acc) + Number(cv), 0);
                        temp_system_hh.push(temp);
                    }
                } catch(error){

                }
            });
            if(temp_system_hh != false){
                if(temp_system_hh.length > 1){
                    is_system_hh_multival = true;
                }
            }
        }

			const sys = props.systemsonz;
			// console.log(props.systemsonz);
			// console.log(temp_cardata_by_cartype_not_instate[i]);
			sys.map((item) => {
				if (
					item.carnumber == temp_cardata_by_cartype_not_instate[i].carnumber &&
					item.mashbit[0].mashbit == true
				) {
					// console.log(item);
					if (item.kshirot != "כשיר") {
						temp_cardata_by_cartype_systemoz.push(
							temp_cardata_by_cartype_not_instate[i]
						);
					}
				}
			});
			unique = [
				...new Map(
					temp_cardata_by_cartype_systemoz.map((m) => [m.carnumber, m])
				).values(),
			];
			// console.log(unique);
			const fl = sys.filter(
				(item) =>
					item.carnumber == temp_cardata_by_cartype_not_instate[i].carnumber &&
					item.mashbit[0].mashbit == true
			);
			unique1 = [...new Map(fl.map((m) => [m.carnumber, m])).values()];
			// console.log(unique1);
			temp_cardata_by_cartype_systemoz_mooshbat = unique1.length;
			sys.map((item) => {
				try {
					if (
						item.carnumber == temp_cardata_by_cartype_not_instate[i].carnumber
					) {
						temp_system_hh.push(
							item.tipuls
								.map((m) => m.hh_stands.map((a) => a.missing_makat_2))
								.flat()
						);
					}

        setCardata_by_cartype_intipul(temp_cardata_by_cartype_intipul.length);
        setCardata_by_cartype_harigtipul(temp_cardata_by_cartype_harigtipul.length);
        setCardata_by_cartype_takalotmizdamnot(temp_cardata_by_cartype_takalotmizdamnot.length);
        setCardata_by_cartype_hhstand_intipul(temp_cardata_by_cartype_hhstand_intipul.length);
        setCardata_by_cartype_hhstand_harigtipul(temp_cardata_by_cartype_hhstand_harigtipul.length);
        setCardata_by_cartype_hhstand_takalotmizdamnot(temp_cardata_by_cartype_hhstand_takalotmizdamnot.length);
        setCardata_by_cartype_systemonz(unique.length);
        setCardata_by_cartype_system_mooshbat(temp_cardata_by_cartype_systemonz_mooshbat);
        setCardata_by_cartype_systemonz_hh(!temp_system_hh ? 0 : temp_system_hh.length > 1 ? temp_system_hh.reduce((acc,cv) => Number(acc) + Number(cv), 0) : temp_system_hh.length == 0 ? 0 : temp_system_hh[0]);
    }

		setCardata_by_cartype(temp_cardata_by_cartype.length);
		setCardata_by_cartype_instate(temp_cardata_by_cartype_instate.length);
		setCardata_by_cartype_not_instate(
			temp_cardata_by_cartype_not_instate.length
		);

		setCardata_by_cartype_intipul(temp_cardata_by_cartype_intipul.length);
		setCardata_by_cartype_harigtipul(temp_cardata_by_cartype_harigtipul.length);
		setCardata_by_cartype_takalotmizdamnot(
			temp_cardata_by_cartype_takalotmizdamnot.length
		);
		setCardata_by_cartype_hhstand_intipul(
			temp_cardata_by_cartype_hhstand_intipul.length
		);
		setCardata_by_cartype_hhstand_harigtipul(
			temp_cardata_by_cartype_hhstand_harigtipul.length
		);
		setCardata_by_cartype_hhstand_takalotmizdamnot(
			temp_cardata_by_cartype_hhstand_takalotmizdamnot.length
		);
		// console.log(temp_cardata_by_cartype_systemoz);
		setCardata_by_cartype_systemonz(unique.length);
		setCardata_by_cartype_system_mooshbat(
			temp_cardata_by_cartype_systemoz_mooshbat
		);
		setCardata_by_cartype_systemonz__hh(
			!temp_system_hh 
				? 0
				: temp_system_hh.length > 1
				? temp_system_hh.reduce((acc, cv) => Number(acc) + Number(cv), 0)
				: temp_system_hh[0]
		);
	}

	// const getsystemashbit = async () => {
	// 	await axios
	// 	.get(`http://localhost:8000/api/systems
	// }s

	useEffect(() => {
		init();
	}, [props]);

	return cardata_by_cartype != 0 ? (
		<Col xs={12} md={3}>
			<Card style={{ boxShadow: "rgb(123 123 123 / 20%) 0px 2px 5px 5px" }}>
				<CardHeader style={{ padding: "0px" }}>
					<div style={{ textAlign: "right" }}>
						{props.theme == "white-content" ? (
							props.match.params.cartype == "magadal" ? (
								<>
									<Link
										style={{ textDecoration: "none", color: "inherit" }}
										to={`/dashboard/${props.match.params.unittype}/${props.match.params.unitid}/magad/${props.cartype._id}/true`}
									>
										<img
											style={{ cursor: "pointer" }}
											src={arrowhead}
											height="40px"
										></img>
									</Link>
									<h3
										style={{
											textAlign: "center",
											fontWeight: "bold",
											marginTop: "-40px",
											marginBottom: "0px",
										}}
									>
										זמינות {props.cartype.name}
									</h3>
								</>
							) : props.match.params.cartype == "magad" ? (
								<>
									<Link
										style={{ textDecoration: "none", color: "inherit" }}
										to={`/dashboard/${props.match.params.unittype}/${props.match.params.unitid}/mkabaz/${props.cartype._id}/true`}
									>
										<img
											style={{ cursor: "pointer" }}
											src={arrowhead}
											height="40px"
										></img>
									</Link>
									<h3
										style={{
											textAlign: "center",
											fontWeight: "bold",
											marginTop: "-40px",
											marginBottom: "0px",
										}}
									>
										זמינות {props.cartype.name}
									</h3>
								</>
							) : (
								<h3
									style={{
										textAlign: "center",
										fontWeight: "bold",
										margin: "0px",
									}}
								>
									זמינות {props.cartype.name}
								</h3>
							)
						) : props.match.params.cartype == "magadal" ? (
							<>
								<Link
									style={{ textDecoration: "none", color: "inherit" }}
									to={`/dashboard/${props.match.params.unittype}/${props.match.params.unitid}/magad/${props.cartype._id}/true`}
								>
									<img
										style={{ cursor: "pointer" }}
										src={arrowhead_white}
										height="40px"
									></img>
								</Link>
								<h3
									style={{
										textAlign: "center",
										fontWeight: "bold",
										marginTop: "-40px",
										marginBottom: "0px",
									}}
								>
									כשירות {props.cartype.name}
								</h3>
							</>
						) : props.match.params.cartype == "magad" ? (
							<>
								<Link
									style={{ textDecoration: "none", color: "inherit" }}
									to={`/dashboard/${props.match.params.unittype}/${props.match.params.unitid}/mkabaz/${props.cartype._id}/true`}
								>
									<img
										style={{ cursor: "pointer" }}
										src={arrowhead_white}
										height="40px"
									></img>
								</Link>
								<h3
									style={{
										textAlign: "center",
										fontWeight: "bold",
										marginTop: "-40px",
										marginBottom: "0px",
									}}
								>
									כשירות {props.cartype.name}
								</h3>
							</>
						) : (
							<h3
								style={{
									textAlign: "center",
									fontWeight: "bold",
									margin: "0px",
								}}
							>
								כשירות {props.cartype.name}
							</h3>
						)}
					</div>
				</CardHeader>
				<CardBody
					style={{ textAlign: "center", margin: "auto", cursor: "pointer" }}
					onClick={(e) => toggleCollapse(e)}
				>
					<div
						style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}
					>
						{(cardata_by_cartype != 0
							? (cardata_by_cartype_instate / cardata_by_cartype) * 100
							: 0) < 60 ? (
							<ProgressProvider
								valueStart={0}
								valueEnd={
									cardata_by_cartype != 0
										? (cardata_by_cartype_instate / cardata_by_cartype) * 100
										: 0
								}
							>
								{(value) => (
									<CircularProgressbarWithChildren
										value={value}
										/*text={`${value}%`}*/ styles={{
											root: {},
											path: {
												stroke: `#ff2128`,
												strokeLinecap: "butt",
												transition: "stroke-dashoffset 0.5s ease 0s",
											},
											trail: {
												stroke: "rgb(141 141 141 / 30%)",
												strokeLinecap: "butt",
												transform: "rotate(0.25turn)",
												transformOrigin: "center center",
											},
											text: {
												fill: "#ff2128",
												fontSize: "18px",
											},
											background: {
												fill: "#3e98c7",
											},
										}}
									>
										<div>
											<h2 style={{ margin: "0px" }}>{`${value.toFixed(
												0
											)}%`}</h2>
										</div>
										<div style={{ fontSize: 12, marginTop: -2 }}>
											<h5 style={{ margin: "0px" }}>
												{cardata_by_cartype_instate + "/" + cardata_by_cartype}
											</h5>
										</div>
									</CircularProgressbarWithChildren>
								)}
							</ProgressProvider>
						) : (cardata_by_cartype != 0
								? (cardata_by_cartype_instate / cardata_by_cartype) * 100
								: 0) < 80 ? (
							<ProgressProvider
								valueStart={0}
								valueEnd={
									cardata_by_cartype != 0
										? (cardata_by_cartype_instate / cardata_by_cartype) * 100
										: 0
								}
							>
								{(value) => (
									<CircularProgressbarWithChildren
										value={value}
										/*text={`${value}%`}*/ styles={{
											root: {},
											path: {
												stroke: `#ffca3a`,
												strokeLinecap: "butt",
												transition: "stroke-dashoffset 0.5s ease 0s",
											},
											trail: {
												stroke: "rgb(141 141 141 / 30%)",
												strokeLinecap: "butt",
												transform: "rotate(0.25turn)",
												transformOrigin: "center center",
											},
											text: {
												fill: "#ffca3a",
												fontSize: "18px",
											},
											background: {
												fill: "#3e98c7",
											},
										}}
									>
										<div>
											<h2 style={{ margin: "0px" }}>{`${value.toFixed(
												0
											)}%`}</h2>
										</div>
										<div style={{ fontSize: 12, marginTop: -2 }}>
											<h5 style={{ margin: "0px" }}>
												{cardata_by_cartype_instate + "/" + cardata_by_cartype}
											</h5>
										</div>
									</CircularProgressbarWithChildren>
								)}
							</ProgressProvider>
						) : (cardata_by_cartype != 0
								? (cardata_by_cartype_instate / cardata_by_cartype) * 100
								: 0) <= 100 ? (
							<ProgressProvider
								valueStart={0}
								valueEnd={
									cardata_by_cartype != 0
										? (cardata_by_cartype_instate / cardata_by_cartype) * 100
										: 0
								}
							>
								{(value) => (
									<CircularProgressbarWithChildren
										value={value}
										/*text={`${value}%`}*/ styles={{
											root: {},
											path: {
												stroke: `#8ac926`,
												strokeLinecap: "butt",
												transition: "stroke-dashoffset 0.5s ease 0s",
											},
											trail: {
												stroke: "rgb(141 141 141 / 30%)",
												strokeLinecap: "butt",
												transform: "rotate(0.25turn)",
												transformOrigin: "center center",
											},
											text: {
												fill: "#8ac926",
												fontSize: "18px",
											},
											background: {
												fill: "#3e98c7",
											},
										}}
									>
										<div>
											<h2 style={{ margin: "0px" }}>{`${value.toFixed(
												0
											)}%`}</h2>
										</div>
										<div style={{ fontSize: 12, marginTop: -2 }}>
											<h5 style={{ margin: "0px" }}>
												{cardata_by_cartype_instate + "/" + cardata_by_cartype}
											</h5>
										</div>
									</CircularProgressbarWithChildren>
								)}
							</ProgressProvider>
						) : null}
					</div>
					{/* מקרא לצבעים */}
					<div style={{ display: "inline-flex", marginTop: "10px" }}>
						<img src={green} height="20px" style={{ marginLeft: "5px" }} />
						<p>80-100</p>

						<img
							src={yellow}
							height="20px"
							style={{ marginLeft: "5px", marginRight: "10px" }}
						/>
						<p>60-80</p>

                        {collapseOpen ?
                            <div style={{ width: '80%', marginLeft: 'auto', marginRight: 'auto', paddingTop: '25px' }}>
                                <h6>{props.cartype.name} בטיפול: {cardata_by_cartype_intipul} <span style={{color:'DarkTurquoise'}}>(חלפים: {cardata_by_cartype_hhstand_intipul})</span></h6>
                                <Progress color="guyblue" value={(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_intipul / cardata_by_cartype_not_instate) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_intipul / cardata_by_cartype_not_instate) * 100) : 0).toFixed(0)}%</Progress>
                                <h6>{props.cartype.name} חריגי טיפול:  {cardata_by_cartype_harigtipul} <span style={{color:'DarkTurquoise'}}>(חלפים: {cardata_by_cartype_hhstand_harigtipul})</span></h6>
                                <Progress color="guyblue" value={(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_harigtipul / cardata_by_cartype_not_instate) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_harigtipul / cardata_by_cartype_not_instate) * 100) : 0).toFixed(0)}%</Progress>
                                <h6>{props.cartype.name} בתקלות מזדמנות: {cardata_by_cartype_takalotmizdamnot} <span style={{color:'DarkTurquoise'}}>(חלפים: {cardata_by_cartype_hhstand_takalotmizdamnot})</span></h6>
                                <Progress color="guyblue" value={(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_takalotmizdamnot / cardata_by_cartype_not_instate) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{(cardata_by_cartype_not_instate != 0 ? ((cardata_by_cartype_takalotmizdamnot / cardata_by_cartype_not_instate) * 100) : 0).toFixed(0)}%</Progress>
                                <h6>{props.cartype.name} אי כשירות מערכת: {" "} {cardata_by_cartype_system_mooshbat}{" "} <span style={{color:'DarkTurquoise'}}>(חלפים: {cardata_by_cartype_systemonz_hh})</span></h6>
                                <Progress color="guyblue" value={(cardata_by_cartype_systemonz != 0 ? ((cardata_by_cartype_system_mooshbat / cardata_by_cartype_systemonz) * 100) : 0)} style={{ height: '10px', marginBottom: '8px' }}>{" "}{(cardata_by_cartype_systemonz != 0 ? ((cardata_by_cartype_system_mooshbat / cardata_by_cartype_systemonz) * 100) : 0).toFixed(0)}%</Progress>
                            </div>
                            : null}
                    </CardBody>
                </Card>
            </Col> : null
    );
}

export default withRouter(DashboardCard);
