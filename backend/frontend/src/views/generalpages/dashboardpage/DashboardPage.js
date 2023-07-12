import React, { useState, useEffect, useRef } from "react";

import { useParams, Link, withRouter, Redirect } from "react-router-dom";

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
import axios from "axios";
import { signin, authenticate, isAuthenticated } from "auth/index";
import PropagateLoader from "react-spinners/PropagateLoader";

import DashboardCard from "./DashboardCard";
import DashboardTechCard from "./TechnologyCards/DashboardTechCard";
import LatestUpdateDateComponent from "components/bazak/LatestUpdateDateComponent/LatestUpdateDateComponent";
//redux
import { useSelector, useDispatch } from "react-redux";
import { getCarDataFunc } from "redux/features/cardata/cardataSlice";
//
import ModularScreenPage from "../modularscreenpage/ModularScreenPage";

function DashboardPage({ match, theme }) {
	//user
	const { user } = isAuthenticated();
	//is from unit tree
	const { isfromunittree } = useParams();
	//cardatas
	const [cardatas, setCardatas] = useState([]);
	const [cartypes, setCartypes] = useState([]);
	//systems
	const [systemsonZs, setSystemsonZs] = useState([]);
	// const [sysonz, setsysonz] = useState([]);
	//spinner
	const [isdataloaded, setIsdataloaded] = useState(false);
	//redux
	const dispatch = useDispatch();
	const reduxcardata = useSelector((state) => state.cardata.value);

	async function init() {
		setIsdataloaded(false);
		filterreduxcardata();
		getSystemsonZs();
		switch (match.params.cartype) {
			case "magadal":
				await getMagadals();
				break;
			case "magad":
				await getMagads(match.params.carid);
				break;
			case "mkabaz":
				await getMkabazs(match.params.carid);
				break;
			default:
				await getMagadals();
				break;
		}
	}

	const getReduxCardDataByUnitTypeAndUnitId = async () => {
		if (reduxcardata.length == 0) {
			await dispatch(getCarDataFunc(user));
		}
	};

	const filterreduxcardata = async () => {
		let myArrayFiltered1 = []; //filter cartype
		switch (match.params.cartype) {
			case "magadal":
				myArrayFiltered1 = reduxcardata;
				break;
			case "magad":
				myArrayFiltered1 = reduxcardata.filter((el) => {
					return match.params.carid === el.magadal;
				});
				break;
			case "mkabaz":
				myArrayFiltered1 = reduxcardata.filter((el) => {
					return match.params.carid === el.magad;
				});
				break;
		}

		let myArrayFiltered2 = []; //filter cartype

		switch (match.params.unittype) {
			case "admin":
				myArrayFiltered2 = myArrayFiltered1;
				break;
			case "general":
				myArrayFiltered2 = myArrayFiltered1;
				break;
			case "pikod":
				myArrayFiltered2 = myArrayFiltered1.filter((el) => {
					return match.params.unitid === el.pikod;
				});
				break;
			case "ogda":
				myArrayFiltered2 = myArrayFiltered1.filter((el) => {
					return match.params.unitid === el.ogda;
				});
				break;
			case "hativa":
				myArrayFiltered2 = myArrayFiltered1.filter((el) => {
					return match.params.unitid === el.hativa;
				});
				break;
			case "gdod":
				myArrayFiltered2 = myArrayFiltered1.filter((el) => {
					return match.params.unitid === el.gdod;
				});
				break;
		}

		let myArrayFiltered3 = []; //filter ismushbat

		myArrayFiltered3 = myArrayFiltered2.filter((el) => {
			return "מושבת" != el.status && "מיועד להשבתה" != el.status;
		});

		setCardatas(myArrayFiltered3);
		setIsdataloaded(true);
	};

	const getSystemsonZs = async () => {
		await axios
			.get(`http://localhost:8000/api/systemsonz`)
			.then((response) => {
				let data = response.data.filter((system)=>{
					let cardata = reduxcardata.filter((cardata) =>system.carnumber == cardata.carnumber);
					if(cardata.length>0){
						return(true);
					}else{
						return(false);
					}
			})
			setSystemsonZs(data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// const getsysoz = async () => {
	// 	await axios
	// 		.get(`http://localhost:8000/api/systemonz_mashbit`)
	// 		.then((response) => {
	// 			console.log(response.data);
	// 			setsysonz(response.data);
	// 		})
	// 		.catch((error) => {
	// 			console.log(error);
	// 		});
	// };

	const getMagadals = async () => {
		await axios
			.get(`http://localhost:8000/api/magadal`)
			.then((response) => {
				setCartypes(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const getMagads = async (magadalid) => {
		let tempmagadalsmagads = [];
		if (magadalid != undefined) {
			await axios
				.get(`http://localhost:8000/api/magad/magadsbymagadal/${magadalid}`)
				.then((response) => {
					for (let j = 0; j < response.data.length; j++)
						tempmagadalsmagads.push(response.data[j]);
				})
				.catch((error) => {
					console.log(error);
				});
			setCartypes(tempmagadalsmagads);
		}
	};

	const getMkabazs = async (magadid) => {
		let tempmagadmkabazs = [];
		if (magadid != undefined) {
			await axios
				.get(`http://localhost:8000/api/mkabaz/mkabazsbymagad/${magadid}`)
				.then((response) => {
					for (let j = 0; j < response.data.length; j++)
						tempmagadmkabazs.push(response.data[j]);
				})
				.catch((error) => {
					console.log(error);
				});
			setCartypes(tempmagadmkabazs);
		}
	};

	useEffect(() => {
		if (reduxcardata.length > 0) {
			init();
		}
	}, [match]);

	useEffect(() => {
		if (reduxcardata.length > 0 && isdataloaded == false) {
			init();
		}
	}, [reduxcardata]);

	useEffect(() => {
		getReduxCardDataByUnitTypeAndUnitId();
		// getsysoz();
	}, []);

	return !isdataloaded ? (
		<div style={{ width: "50%", marginTop: "30%" }}>
			<PropagateLoader color={"#ff4650"} loading={true} size={25} />
		</div>
	) : user.mainscreenid &&
	  user.mainscreenid != null &&
	  isfromunittree == "false" ? (
		<>
			<ModularScreenPage screenid={user.mainscreenid} theme={theme} />
		</>
	) : (
		<div>
			<Row>
				{match.params.cartype == "magadal" ? (
					<DashboardTechCard
						theme={theme}
						systemtype="allsystems"
						systemsonZs={systemsonZs}
						cardatas={cardatas.filter(
							(cardata) => {
								let systems = systemsonZs.filter((system) => system.kshirot == "לא כשיר").map((system) =>{return system.carnumber});
								for(let i=0;i<systems.length;i++){
								   if(cardata.carnumber == systems[i]){
									return true;
								   }
								}
								return false;
							}
						)}
					/>
				) : null}
				{cartypes.map((cartype, i) =>
					cartype ? (
						<DashboardCard
							theme={theme}
							// systemsonz={systemsonZs}
							match={match}
							cartype={cartype}
							cardatas={cardatas}
						/>
					) : null
				)}
			</Row>
			<Row>
				<Col xs={12} md={3} style={{ textAlign: "right" }}>
					<LatestUpdateDateComponent
						cardatas={cardatas}
						isdataloaded={isdataloaded}
					/>
				</Col>
				<Col xs={12} md={6}></Col>
				<Col xs={12} md={3}>
					<Link
						to={`/zminotpage/${match.params.unittype}/${match.params.unitid}/${match.params.cartype}/${match.params.carid}/false`}
					>
						<button className="btn-new-blue">טבלת זמינות</button>
					</Link>
				</Col>
			</Row>
		</div>
	);
}

export default withRouter(DashboardPage);
