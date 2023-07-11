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
	const fillterd_data = useRef({});
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
			fillterd_data.current.filter = false;
			await getMkabazs();
			await systemsByMkabaz();

			try {
				if (fillterd_data.current.system && fillterd_data.current.mkabaz) {
					setCardatas(
						reduxcardata.filter((cardata) => {
							let systems = fillterd_data.current.system
								.filter(
									(system) =>
										system.systemType ==
											systemtypes.filter(
												(systype) => systype.name == match.params.systemname
											)[0]._id && system.kshirot == "לא כשיר"
								)
								.map((system) => {
									return system.carnumber;
								});
							for (let i = 0; i < systems.length; i++) {
								if (cardata.carnumber == systems[i]) {
									return true;
								}
							}
							return false;
						})
					);
					setIsdataloaded(false);
					const check = () =>
						fillterd_data.current.mkabaz.filter((mkabaz) => {
							let tmp = fillterd_data.current.system.map((sys) => {
								if (sys.mkabaz == mkabaz.name) {
									return mkabaz;
								}
							});
							if (tmp.includes(mkabaz)) {
								return mkabaz;
							}
						});
					setMkabazs(check());
					setIsdataloaded(true);
					fillterd_data.current.filter = true;
					if (mkabazs.length < 0) {
						setMkabazs(check());
						fillterd_data.current.filter = true;
						setIsdataloaded(true);
					}
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			await getSystemsonZs();
			setIsdataloaded(true);
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
				let systems = response.data.map((system) => {
					const dt = cardatas.filter(
						(cardata) => cardata.carnumber == system.carnumber
					);
					if (dt.length > 0) {
						system.mkabaz = dt[0].mkabaz_data[0].name;
						return system;
					}
				});
				systems = systems.filter((system)=> system != undefined);
				if (systems.length > 0) {
					let data = systems.filter(
						(system) =>
							system.systemType ==
							systemtypes.filter(
								(systype) => systype.name == match.params.systemname
							)[0]._id
					);
					fillterd_data.current.system = data;
					setSystemsonZs(data);
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
				fillterd_data.current.systemsonz = response.data;
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
				fillterd_data.current.mkabaz = response.data;
				setMkabazs(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const unitTypeByUserRole = () => {
		if (isAuthenticated().user.role === "0") {
            return "admin";
        }
        if (isAuthenticated().user.role === "1") {
            return "gdod";
        }
        if (isAuthenticated().user.role === "2") {
            return "hativa";
        }
        if (isAuthenticated().user.role === "3") {
            return "ogda";
        }
        if (isAuthenticated().user.role === "4") {
            return "pikod";
        }
		if (isAuthenticated().user.role === "5") {
            return "general";
        }
    }
	const unitIdByUserRole = () => {
		if (isAuthenticated().user.role === "0") {
            return "0";
        }
        if (isAuthenticated().user.role === "1") {
            return isAuthenticated().user.gdodid;
        }
        if (isAuthenticated().user.role === "2") {
             return isAuthenticated().user.hativaid;
        }
        if (isAuthenticated().user.role === "3") {
             return isAuthenticated().user.ogdaid;
        }
        if (isAuthenticated().user.role === "4") {
             return isAuthenticated().user.pikodid;
        }
		if (isAuthenticated().user.role === "5") {
             return "5";
        }
    }

	 async function HierarchyCheck(targetUnitId, targetUnitType) {
		 return hierarchyCheck(targetUnitId, targetUnitType);
	
		async function getTargetParentId(targetUnitId, targetUnitType) {
			try {
				let response = await axios.get(`http://localhost:8000/api/${targetUnitType}/${targetUnitId}`)
				if (targetUnitType == 'gdod') {
					return response.data.hativa;
				}
				if (targetUnitType == 'hativa') {
					return response.data.ogda;
				}
				if (targetUnitType == 'ogda') {
					return response.data.pikod;
				}
			} catch {
				console.log("error in HierarchyCheck");
			}
		}
	
		async function hierarchyCheck(targetUnitId, targetUnitType) {
			if (isAuthenticated().user.role == '0' || isAuthenticated().user.role == '5') {
				return true;
			}
			if (targetUnitId == unitIdByUserRole() && targetUnitType == unitTypeByUserRole()) {
				return true;
			} else {
				if (targetUnitType != 'pikod') {
					targetUnitId = await getTargetParentId(targetUnitId, targetUnitType);
					if (targetUnitType == 'gdod') {
						targetUnitType = 'hativa';
					}
					else {
						if (targetUnitType == 'hativa') {
							targetUnitType = 'ogda';
						}
						else {
							if (targetUnitType == 'ogda') {
								targetUnitType = 'pikod';
							}
						}
					}
					return hierarchyCheck(targetUnitId, targetUnitType);
				} else {
					return false;
				}
			}
		}
	}

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

	return !isdataloaded && !fillterd_data.current.filter ? (
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
									cardatas={ cardatas.filter(async (cardata) => {
										let systems = systemsonZs
											.filter(
												(system) =>
													system.systemType == systemtype._id &&
													system.kshirot == "לא כשיר"
											)
											.map((system) => {
												return system.carnumber;
											});
										for (let i = 0; i < systems.length; i++) {
											if (cardata.carnumber == systems[i]) {
							                    await HierarchyCheck(cardata.gdod, "gdod")
												return true;
											}
										}
										return false;
									})}
								/>
							) : null
					  )
					: match.params.systemtype == "mkabaz"
					? mkabazs.map((mkabaz, i) =>
							mkabaz ? (
								<>
									<DashboardTechCard
										theme={theme}
										systemtype={match.params.systemtype}
										systemid={
											systemtypes.filter(
												(systype) => systype.name == match.params.systemname
											)[0]._id
										}
										systemtypename={match.params.systemname}
										systemname={mkabaz.name}
										systemsonZs={fillterd_data.current.system}
										cardatas={cardatas}
									/>
								</>
							) : null
					  )
					: null}
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
						to={`/zminotpage/${unitTypeByUserRole()}/${unitIdByUserRole()}/magadal/0/false`}
					>
						<button className="btn-new-blue">טבלת זמינות</button>
					</Link>
				</Col>
			</Row>
		</div>
	);
}

export default withRouter(DashboardPage);
