import React, { useState, useEffect, useRef } from "react";
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
} from "reactstrap";
import axios from "axios";
import history from "history.js";
import { signin, authenticate, isAuthenticated } from "auth/index";
import { produce } from "immer";
import { generate } from "shortid";
import { toast } from "react-toastify";
import deletepic from "assets/img/delete.png";
import warning_sign from "assets/img/warning_sign.svg"

const TechFormModalDelete = (props) => {
	const { user } = isAuthenticated();
	//systemsonZ
	const [systemsonZ, setSystemsonZ] = useState([{}]);

	const loadsystemsonZ = async () => {
		await axios
			.get(`http://localhost:8000/api/systemsonzbycarnumber/${props.carnumber}`)
			.then((response2) => {
				let tempsystemsonZ = response2.data;
				for (let i = 0; i < tempsystemsonZ.length; i++) {
					if (tempsystemsonZ[i].latest_recalibration_date)
						tempsystemsonZ[i].latest_recalibration_date = tempsystemsonZ[
							i
						].latest_recalibration_date.slice(0, 10);
				}
				setSystemsonZ(tempsystemsonZ);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const clickSubmit = (event) => {
		DeleteCarDatasUnits();
	};

	async function DeleteCarDatasUnits() {
		var tempsystemonZ = { ...systemsonZ };
		let tempsystemonZId;
		for (let i = 0; i < systemsonZ.length; i++) {
			if (i == props.index) {
				tempsystemonZId = tempsystemonZ[i]._id;
				await axios.delete(
					`http://localhost:8000/api/systemsonz/${tempsystemonZId}`
				);
			}
		}

		toast.success(`מערכת נמחקה בהצלחה`);
		props.ToggleForModal();
	}

	function init() {
		loadsystemsonZ();
	}

	useEffect(() => {
		if (props.isOpen == true) init();
		else {
			setSystemsonZ({});
		}
	}, [props.isOpen]);

	return (
		<Modal
			style={{
				minHeight: "100%",
				maxHeight: "100%",
				minWidth: "30em",
				maxWidth: "30em",
				justifyContent: "center",
				alignSelf: "center",
				margin: "0px",
				margin: "auto",
				direction: "rtl",
			}}
			isOpen={props.isOpen}
			centered
			fullscreen
			scrollable
			size=""
			toggle={props.Toggle}
		>
			<ModalBody style={{padding: "0px"}}>
				<Card style={{marginBottom: "0px",marginTop: "20px"}}>
				<img src={warning_sign} style={{height:'60px', alignSelf: "center", marginBottom:'-20px'}}></img>
					<CardHeader style={{ direction: "rtl" }}>
						<CardTitle
							tag="h3"
							style={{
								direction: "rtl",
								textAlign: "center",
								fontWeight: "bold",
								marginBottom: "-20px"
							}}
						>
							מחיקת מערכת
						</CardTitle>
						{/*headline*/}
					</CardHeader>
					<CardBody style={{ direction: "rtl" }}>
						<Container>
							<div style={{ textAlign: "center"}}>
								<h4 style={{marginBottom:'-5px'}}>האם אתה בטוח שברצונך למחוק את מערכת זו?</h4>
								<h4>פעולה זו תוביל למחיקה לצמיתות של מערכת זו</h4>
								<div
									style={{
										display: "flex",
										paddingTop: "0px",
										justifyContent: "space-between",
									}}
								>
									<button
										className="btn-new-delete"
										onClick={() => {
											props.exit();
										}}
									>
										בטל
									</button>
									<button style={{backgroundColor:'red'}} className="btn-new-delete" onClick={clickSubmit}>
										כן, מחק
									</button>
								</div>
							</div>
						</Container>
					</CardBody>
				</Card>
			</ModalBody>
		</Modal>
	);
};
export default withRouter(TechFormModalDelete);
