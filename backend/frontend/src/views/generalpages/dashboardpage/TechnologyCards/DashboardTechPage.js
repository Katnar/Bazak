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

import DashboardTechCard from "./DashboardTechCard";
import LatestUpdateDateComponent from "components/bazak/LatestUpdateDateComponent/LatestUpdateDateComponent";
//redux
import { useSelector, useDispatch } from "react-redux";
import { getCarDataFunc } from "redux/features/cardata/cardataSlice";

function DashboardPage({ match, theme }) {
	//user
	const { user } = isAuthenticated();
	//cardatas
	const [cardatas, setCardatas] = useState([]);
	//systems
	const [systemsonZs, setSystemsonZs] = useState([]);
	const [systemtypes, setSystemtypes] = useState([]);
	//spinner
	const [isdataloaded, setIsdataloaded] = useState(false);
	//
	const [mkabazs, setMkabazs] = useState([]);
	//redux
	const dispatch = useDispatch();
	const reduxcardata = useSelector((state) => state.cardata.value);

	async function init() {
		getReduxCardDataByUnitTypeAndUnitId();
		setIsdataloaded(false);
		setCardatas(reduxcardata);
		getSystemTypes();
		if (match.params.systemtype == "mkabaz") {
			await getMkabazs();
			await systemsByMkabaz();
		}else{
			await getSystemsonZs();
		}
	}

	const getReduxCardDataByUnitTypeAndUnitId = async () => {
		if (reduxcardata.length == 0) {
			await dispatch(getCarDataFunc(user));
		}
	};

	const systemsByMkabaz = async () => {
		await axios
			.get(`http://localhost:8000/api/systemsonz`)
			.then((response) => {
				let systems = response.data.map((system)=>{
					const dt = cardatas.filter((cardata)=>
					cardata.carnumber == system.carnumber)
					if(dt.length>0){
						system.mkabaz=dt[0].mkabaz_data[0].name
						return system
					}
				})
				if(systems[0] != undefined){
					setSystemsonZs(systems);
					setIsdataloaded(true);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const getSystemsonZs = async () => {
		await axios
			.get(`http://localhost:8000/api/systemsonz`)
			.then((response) => {
				setSystemsonZs(response.data);
				setIsdataloaded(true);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const getSystemTypes = async () => {
		await axios
			.get(`http://localhost:8000/api/system`)
			.then((response) => {
				setSystemtypes(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const getMkabazs = async () => {
		await axios
			.get(`http://localhost:8000/api/mkabaz`)
			.then((response) => {
				setMkabazs(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		init();
	}, [match]);

	useEffect(() => {
		if (reduxcardata.length > 0 && isdataloaded == false) {
			init();
		}
	}, [reduxcardata]);

	useEffect(() => {
		getReduxCardDataByUnitTypeAndUnitId();
	}, []);

	return !isdataloaded ? (
		<div style={{ width: "50%", marginTop: "30%" }}>
			<PropagateLoader color={"#ff4650"} loading={true} size={25} />
		</div>
	) : (
		<div>
			<Row>
				{match.params.systemtype == "dividesystems"
					? systemtypes.map((systemtype, i) =>
							systemtype ? (
								<DashboardTechCard
									theme={theme}
									systemtype={match.params.systemtype}
									systemid={systemtype._id}
									systemname={systemtype.name}
									systemsonZs={systemsonZs.filter(
										(system) => system.systemType == systemtype._id
									)}
									cardatas={cardatas.filter(
										(cardata) => {
											let systems = systemsonZs.filter((system) => system.systemType == systemtype._id && system.kshirot == "לא כשיר").map((system) =>{return system.carnumber});
											for(let i=0;i<systems.length;i++){
											   if(cardata.carnumber == systems[i]){
												return true;
											   }
											}
											return false;
										}
									)}
								/>
							) : null
					  )
					: match.params.systemtype == "mkabaz"
					?  mkabazs.map((mkabaz, i) =>
							mkabaz ? (
								<DashboardTechCard
									theme={theme}
									systemtype={match.params.systemtype}
									systemid={systemtypes.filter((systype)=> systype.name == match.params.systemname)[0]._id}
									systemtypename={match.params.systemname}
									systemname={mkabaz.name}
									systemsonZs={systemsonZs.filter((system) => system.systemType == systemtypes.filter((systype)=> systype.name == match.params.systemname)[0]._id)}
									cardatas={cardatas.filter(
										(cardata) => {
											let systems = systemsonZs.filter((system) => system.systemType == systemtypes.filter((systype)=> systype.name == match.params.systemname)[0]._id && system.kshirot == "לא כשיר").map((system) =>{return system.carnumber});
											for(let i=0;i<systems.length;i++){
											   if(cardata.carnumber == systems[i]){
												return true;
											   }
											}
											return false;
										}
									)}
								/>
							) : null
					  )
					: null}
			</Row>
		</div>
	);
}

export default withRouter(DashboardPage);
