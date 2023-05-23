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
	ButtonGroup,
} from "reactstrap";
import axios from "axios";
import history from "history.js";
import { signin, authenticate, isAuthenticated } from "auth/index";
import { produce } from "immer";
import { generate } from "shortid";
import { toast } from "react-toastify";
import Select from "components/general/Select/AnimatedSelect";
import deletepic from "assets/img/delete.png";
import savepic from "assets/img/save.png";
import editpic from "assets/img/write.png";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import TechFormModalDelete from "./TechFormModalDelete";

const CarDataFormModal = (props) => {
	const { user } = isAuthenticated();
	//cardata
	const [cardata, setCarData] = useState({});
	const [finalspecialkeytwo, setFinalSpecialKeytwo] = useState([]);
	//technology
	const [technologies, setTechnologies] = useState([]);
	//units
	const [gdods, setGdods] = useState([]);
	const [hativas, setHativas] = useState([]);
	const [ogdas, setOgdas] = useState([]);
	const [pikods, setPikods] = useState([]);
	//cartypes
	const [makats, setMakats] = useState([]);
	const [mkabazs, setMkabazs] = useState([]);
	const [magads, setMagads] = useState([]);
	const [magadals, setMagadals] = useState([]);
	//new 18.8.22
	const [isgdodsadir, setIsgdodsadir] = useState(true);
	//tipuls
	const [tipuls, setTipuls] = useState([]);
	//systems
	const [systems, setSystems] = useState([]);
	const [takalaopen, setTakalaopen] = useState(false);
	//formdelete
	const [istechformdeleteopen, setIstechformdeleteopen] = useState(false);
	const [deleteId, setDeleteId] = useState();
	const [deleteIndex, setDeleteIndex] = useState();

	const loadcardata = async () => {
		await axios
			.get(`http://localhost:8000/api/cardata/${props.cardataid}`)
			.then(async (response) => {
				let tempcardata = response.data[0];
				if (tempcardata.latest_recalibration_date)
					tempcardata.latest_recalibration_date =
						tempcardata.latest_recalibration_date.slice(0, 10);
				setCarData(tempcardata);
				for (let x = 0; x < tempcardata.tipuls.length; x++) {
					tempcardata.tipuls[x] = { ...tempcardata.tipuls[x], errorType: "Z" };
				}
				setFinalSpecialKeytwo(tempcardata.tipuls);
				await axios
					.get(
						`http://localhost:8000/api/systemsonzbycarnumber/${tempcardata.carnumber}`
					)
					.then((response1) => {
						let tempsystemonZ = response1.data;
						if (tempsystemonZ.length > 0) {
							let tempfinalspecialkeytwo = [];
							let tempTechnologies = [];
							getTipultypes();
							for (let i = 0; i < tempsystemonZ.length; i++) {
								let temp = { ...tempsystemonZ[i] };
								delete temp._id;
								delete temp.tipuls;
								delete temp.createdAt;
								delete temp.updatedAt;
								delete temp.expected_repair;
								delete temp.takala_info;
								tempTechnologies.push(temp);
								for (let j = 0; j < tempsystemonZ[i].tipuls.length; j++) {
									if (tempsystemonZ[i].kshirot == "לא כשיר") {
										tempsystemonZ[i].tipuls[j] = {
											...tempsystemonZ[i].tipuls[j],
											errorType: "technology",
											systemType: tempsystemonZ[i].systemType,
										};
										tempfinalspecialkeytwo.push(tempsystemonZ[i].tipuls[j]);
									}
								}
								if (tempcardata.expected_repair == "") {
									tempcardata.expected_repair =
										tempsystemonZ[i].expected_repair;
								}
								if (tempcardata.takala_info == "") {
									tempcardata.takala_info = tempsystemonZ[i].takala_info;
								}
							}
							let arr = tempcardata.tipuls.concat(tempfinalspecialkeytwo);
							setFinalSpecialKeytwo(arr);
							setTechnologies(tempTechnologies);
							setCarData(tempcardata);
						}
					});

				//new 18.8.22
				if (tempcardata.gdod) {
					axios
						.get(`http://localhost:8000/api/gdod/${tempcardata.gdod}`)
						.then((response) => {
							if (/*response.data.sadir &&*/ response.data.sadir == "לא סדיר") {
								setIsgdodsadir(false);
							} else {
								setIsgdodsadir(true);
							}
						})
						.catch((error) => {
							console.log(error);
						});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const fixnewcardataunitsbyunittype = async () => {
		let tempcardata = {};
		if (props.unittype == "pikod") {
			tempcardata.pikod = props.unitid;
		} else if (props.unittype == "ogda") {
			tempcardata.ogda = props.unitid;
			let response = await axios.get(
				`http://localhost:8000/api/ogda/${props.unitid}`
			);
			tempcardata.pikod = response.data.pikod;
		} else if (props.unittype == "hativa") {
			tempcardata.hativa = props.unitid;
			let response1 = await axios.get(
				`http://localhost:8000/api/hativa/${props.unitid}`
			);
			tempcardata.ogda = response1.data.ogda;
			let response = await axios.get(
				`http://localhost:8000/api/ogda/${tempcardata.ogda}`
			);
			tempcardata.pikod = response.data.pikod;
		} else if (props.unittype == "gdod") {
			tempcardata.gdod = props.unitid;
			let response2 = await axios.get(
				`http://localhost:8000/api/gdod/${props.unitid}`
			);
			tempcardata.hativa = response2.data.hativa;
			let response1 = await axios.get(
				`http://localhost:8000/api/hativa/${tempcardata.hativa}`
			);
			tempcardata.ogda = response1.data.ogda;
			let response = await axios.get(
				`http://localhost:8000/api/ogda/${tempcardata.ogda}`
			);
			tempcardata.pikod = response.data.pikod;
		}
		setCarData(tempcardata);
	};

	function ToggleDelete(t, index) {
		setDeleteId(t.id);
		setDeleteIndex(index);
		setIstechformdeleteopen(!istechformdeleteopen);
	}
	function ToggleForModalDelete(evt) {
		let tempfinalspecialkeytwo = [...finalspecialkeytwo];
		for (let j = 0; j < finalspecialkeytwo.length; j++) {
			if (
				tempfinalspecialkeytwo[j].systemType ==
				technologies[deleteIndex].systemType
			) {
				tempfinalspecialkeytwo.splice(j, 1);
			}
		}
		setFinalSpecialKeytwo(tempfinalspecialkeytwo);
		toast.info(
			"בעקבות עדכון כשירות מערכת על גבי הכלי, סיבות אי הזמינות עודכנו בהתאם"
		);

		setTechnologies((currentSpec) =>
			currentSpec.filter((x) => x.id !== deleteId)
		);
		setIstechformdeleteopen(!istechformdeleteopen);
	}
	function toggleexitmodaldel(evt) {
		setIstechformdeleteopen(!istechformdeleteopen);
	}

	const getTipultypes = async () => {
		await axios
			.get(`http://localhost:8000/api/tipul`)
			.then((response) => {
				setTipuls(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const getSystemstomakats = async (makatId) => {
		let tempsystems = [];
		await axios
			.get(`http://localhost:8000/api/systemstomakatByMakatId/${makatId}`)
			.then((response) => {
				for (let i = 0; i < response.data.length; i++) {
					axios
						.get(
							`http://localhost:8000/api/system/${response.data[i].systemId}`
						)
						.then((response2) => {
							tempsystems.push(response2.data);
						});
				}

				for (let i = 0; i < technologies.length; i++) {
					// technologeies is the tempsystems that are attached to this makat
					let flag = true;
					for (let j = 0; j < tempsystems.length; j++) {
						if (technologies[i].systemType == tempsystems[j].name) {
							//current system on makat vs all the tempsystems from the new dropdown list
							console.log(technologies[i].systemType, tempsystems[j].name);
							flag = false;
						}
					}
					if (flag == true) {
						setTechnologies([]);
					}
				}
				setSystems(tempsystems);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const getMagadals = async () => {
		await axios
			.get(`http://localhost:8000/api/magadal`)
			.then((response) => {
				setMagadals(response.data);
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
			setMagads(tempmagadalsmagads);
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
			setMkabazs(tempmagadmkabazs);
		}
	};

	const getMakats = async (mkabazid) => {
		let tempmkabazmakats = [];
		if (mkabazid != undefined) {
			await axios
				.get(`http://localhost:8000/api/makat/makatsbymkabaz/${mkabazid}`)
				.then((response) => {
					for (let j = 0; j < response.data.length; j++)
						tempmkabazmakats.push(response.data[j]);
				})
				.catch((error) => {
					console.log(error);
				});
			setMakats(tempmkabazmakats);
		}
	};

	const loadPikods = async () => {
		await axios
			.get("http://localhost:8000/api/pikod")
			.then((response) => {
				setPikods(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const loadOgdas = async (pikodid) => {
		let temppikodogdas = [];
		await axios
			.post("http://localhost:8000/api/ogda/ogdasbypikodid", { pikod: pikodid })
			.then((response) => {
				for (let j = 0; j < response.data.length; j++)
					temppikodogdas.push(response.data[j]);
			})
			.catch((error) => {
				console.log(error);
			});
		setOgdas(temppikodogdas);
	};

	const loadHativas = async (ogdaid) => {
		let tempogdahativas = [];
		await axios
			.post("http://localhost:8000/api/hativa/hativasbyogdaid", {
				ogda: ogdaid,
			})
			.then((response) => {
				for (let j = 0; j < response.data.length; j++)
					tempogdahativas.push(response.data[j]);
			})
			.catch((error) => {
				console.log(error);
			});
		setHativas(tempogdahativas);
	};

	const loadGdods = async (hativaid) => {
		let temphativasgdods = [];
		await axios
			.post("http://localhost:8000/api/gdod/gdodsbyhativaid", {
				hativa: hativaid,
			})
			.then((response) => {
				for (let j = 0; j < response.data.length; j++)
					temphativasgdods.push(response.data[j]);
			})
			.catch((error) => {
				console.log(error);
			});
		setGdods(temphativasgdods);
	};

	function handleChange(evt) {
		const value = evt.target.value;
		if (value != "בחר") {
			if (evt.target.name == "status" && value == "מושבת") {
				toast.error("העברת סטטוס הכלי למושבת משמעותה השבתת הכלי לגמרי");
			}
			if (evt.target.name == "status" && value == "עצור") {
				toast.error("העברת סטטוס הכלי לעצור משמעותה עצירת הכלי לגמרי");
			}
			setCarData({ ...cardata, [evt.target.name]: value });
			if (evt.target.name == "expected_repair") {
				if (value == "מעל 72 שעות") {
					setCarData({
						...cardata,
						zminot: "לא זמין",
						kshirot: "לא כשיר",
						[evt.target.name]: value,
					});
					toast.info(
						"שים לב, צפי תיקון עודכן למעל 72 שעות, זמינות וכשירות הכלי עודכנו ללא זמין ולא כשיר"
					);
				}
			}
		}
	}

	async function CheckCarnumberAndSetFormdata() {
		let carnumber = cardata.carnumber;
		if (carnumber != "") {
			let response = await axios.get(
				`http://localhost:8000/api/cardata/cardatabycarnumber/${carnumber}`
			);
			if (response.data.length > 0) {
				//צ' קיים במערכת
				if (
					!response.data[0].gdod ||
					(response.data[0].gdod == null && !response.data[0].hativa) ||
					(response.data[0].hativa == null && !response.data[0].ogda) ||
					(response.data[0].ogda == null && !response.data[0].pikod) ||
					response.data[0].pikod == null
				) {
					let tempcardata = response.data[0];
					tempcardata.gdod = cardata.gdod;
					tempcardata.hativa = cardata.hativa;
					tempcardata.ogda = cardata.ogda;
					tempcardata.pikod = cardata.pikod;
				}
				setCarData(response.data[0]);
				toast.success("נתוני הצ' נטענו לטופס");
			} else {
				setCarData({ ...cardata, carnumber: carnumber });
			}
		} else {
			setCarData({ ...cardata, carnumber: carnumber });
		}
	}

	function handleChange2(selectedOption, name) {
		if (!(selectedOption.value == "בחר"))
			setCarData({ ...cardata, [name]: selectedOption.value });
		else {
			let tempcardata = { ...cardata };
			delete tempcardata[name];
			setCarData(tempcardata);
		}
		toast.error(
			'במקרה של שינוי מק"ט, יש לבדוק אם המערכות שעל הצ יכולות להיות על המק"ט החדש'
		);
	}

	const clickSubmit = (event) => {
		CheckFormData();
	};

	const CheckFormData = () => {
		//check for stuff isnt empty -> specially cartypes/units
		var flag = true;
		var ErrorReason = "";

		if (cardata.carnumber == undefined || cardata.carnumber == "") {
			ErrorReason += ", שדה חסר צ'";
			flag = false;
		} else {
			var isTechnology = false;
			if (cardata.magadal == "magadal04") {
				//change to the magadal of technologies in the database in army
				isTechnology = true;
			}
			if (isTechnology == false) {
				for (var i = 0; i < cardata.carnumber.length; i++) {
					if (cardata.carnumber[i] == "-") {
						ErrorReason += ", מספר צ' לא יכול להכיל את התו -";
						flag = false;
					}
				}
			} else {
				if (
					makats.some((makat) =>
						cardata.carnumber.includes(makat._id.replace(/0/g, ""))
					) == false
				) {
					for (var i = 0; i < cardata.carnumber.length; i++) {
						if (cardata.carnumber[i] == "-") {
							ErrorReason += ", מספר צ' לא יכול להכיל את התו -";
							flag = false;
						}
					}
				}
			}
		}

		if (
			cardata.pikod == undefined ||
			cardata.pikod == "" ||
			cardata.ogda == undefined ||
			cardata.ogda == "" ||
			cardata.hativa == undefined ||
			cardata.hativa == "" ||
			cardata.gdod == undefined ||
			cardata.gdod == ""
		) {
			ErrorReason += ", פרטי יחידה לא מלאים";
			flag = false;
		}

		if (
			cardata.magadal == undefined ||
			cardata.magadal == "" ||
			cardata.magad == undefined ||
			cardata.magad == "" ||
			cardata.mkabaz == undefined ||
			cardata.mkabaz == "" ||
			cardata.makat == undefined ||
			cardata.makat == ""
		) {
			ErrorReason += ", פרטי סוג הכלי לא מלאים";
			flag = false;
		}

		if (
			cardata.zminot == undefined ||
			cardata.zminot == "" ||
			cardata.kshirot == undefined ||
			cardata.kshirot == ""
		) {
			ErrorReason += ",חובה להזין האם הכלי זמין/כשיר";
			flag = false;
		}

		if (
			cardata.expected_repair == "מעל 72 שעות" &&
			(cardata.zminot == "זמין" || cardata.kshirot == "כשיר")
		) {
			ErrorReason +=
				",שים לב, צפי תיקון עודכן למעל 72 שעות, זמינות וכשירות הכלי עודכנו ללא זמין ולא כשיר";
			flag = false;
		}

		if (cardata.zminot == "לא זמין" || cardata.kshirot == "לא כשיר") {
			if (finalspecialkeytwo.length == 0) {
				ErrorReason += ",חובה להזין את סיבת אי-הזמינות/אי-הכשירות";
				flag = false;
			}

			for (let i = 0; i < finalspecialkeytwo.length; i++) {
				if (
					finalspecialkeytwo[i].errorType == undefined ||
					finalspecialkeytwo[i].errorType == ""
				) {
					ErrorReason +=
						"בסיבות אי זמינות - חובה להזין האם התקלה בצ' או במערכת, ";
					flag = false;
				}
				if (
					finalspecialkeytwo[i].errorType == "technology" &&
					(finalspecialkeytwo[i].systemType == undefined ||
						finalspecialkeytwo[i].systemType == "")
				) {
					ErrorReason +=
						"בסיבות אי זמינות - אם התקלה במערכת יש להזין באיזו מערכת, ";
					flag = false;
				}
				if (finalspecialkeytwo[i].type == "tipul") {
					if (!finalspecialkeytwo[i].tipul) {
						ErrorReason += ",בטיפול - חובה להזין סוג טיפול";
						flag = false;
					}
					if (!finalspecialkeytwo[i].tipul_entry_date) {
						ErrorReason += ",בטיפול - חובה להזין תאריך כניסה לטיפול";
						flag = false;
					}
					if (!finalspecialkeytwo[i].mikum_tipul) {
						ErrorReason += ",בטיפול - חובה להזין מיקום הטיפול";
						flag = false;
					}
				}
				if (finalspecialkeytwo[i].type == "harig_tipul") {
					if (!finalspecialkeytwo[i].harig_tipul) {
						ErrorReason += ",בחריג טיפול - חובה להזין חריג טיפול";
						flag = false;
					}
					if (!finalspecialkeytwo[i].harig_tipul_date) {
						ErrorReason += ",בחריג טיפול - חובה להזין תאריך חריגת טיפול";
						flag = false;
					}
				}
				if (finalspecialkeytwo[i].type == "takala_mizdamenet") {
					if (!finalspecialkeytwo[i].takala_mizdamenet) {
						ErrorReason += ",בתקלה מזדמנת - חובה להזין תקלה מזדמנת";
						flag = false;
					}
					if (!finalspecialkeytwo[i].takala_mizdamenet_date) {
						ErrorReason += ",בתקלה מזדמנת - חובה להזין תאריך תקלה מזמנת";
						flag = false;
					}
				}
				if (finalspecialkeytwo[i].hh_stands) {
					for (let j = 0; j < finalspecialkeytwo[i].hh_stands.length; j++) {
						if (!finalspecialkeytwo[i].hh_stands[j].missing_makat_1) {
							ErrorReason += ',בעומד על ח"ח - חובה להזין מק"ט חסר';
							flag = false;
						}
						if (!finalspecialkeytwo[i].hh_stands[j].missing_makat_2) {
							ErrorReason += ',בעומד על ח"ח - חובה להזין כמות';
							flag = false;
						}
					}
				}
			}
		}
		if (
			cardata.kshirot == "לא כשיר" ||
			cardata.zminot == "לא זמין" ||
			takalaopen
		) {
			if (
				cardata.expected_repair == undefined ||
				cardata.expected_repair == ""
			) {
				ErrorReason += "חובה להזין צפי תיקון";
				flag = false;
			}
		}

		for (let j = 0; j < technologies.length; j++) {
			console.log(technologies[j]);
			if (
				technologies[j].systemType == undefined ||
				technologies[j].systemType == ""
			) {
				ErrorReason += " ,יש להגדיר סוג מערכת לכל המערכות שעל הכלי";
				flag = false;
			}
			if (
				technologies[j].kshirot == undefined ||
				technologies[j].kshirot == ""
			) {
				ErrorReason += " ,יש להגדיר כשירות לכל המערכות שעל הכלי";
				flag = false;
			}
			let noerror = false;
			// console.log(finalspecialkeytwo);
			// console.log(finalspecialkeytwo.length);
			if (finalspecialkeytwo.length > 0) {
				for (let y = 0; y < finalspecialkeytwo.length; y++) {
					if (technologies[j].kshirot == "לא כשיר") {
						if (
							finalspecialkeytwo[y].systemType == technologies[j].systemType
						) {
							noerror = true;
						}
					} else {
						noerror = true;
					}
				}
			} else {
				noerror = true;
			}
			console.log(noerror);
			if (noerror == false) {
				ErrorReason +=
					" ,במקרה שמערכת על כלי לא כשירה חובה להזין סיבת אי זמינות";
				flag = false;
			}
		}

		if (flag == true) {
			console.log(cardata.expected_repair);

			if (props.cardataid != undefined) {
				UpdateCarData();
			} else {
				CreateCarData();
			}
		} else {
			toast.error(ErrorReason);
		}
	};

	async function CreateCarData() {
		let response = await axios.get(
			`http://localhost:8000/api/cardata/cardatabycarnumber/${cardata.carnumber}`
		);
		if (response.data.length > 0) {
			if (
				!response.data[0].gdod ||
				(response.data[0].gdod == null && !response.data[0].hativa) ||
				(response.data[0].hativa == null && !response.data[0].ogda) ||
				(response.data[0].ogda == null && !response.data[0].pikod) ||
				response.data[0].pikod == null
			) {
				//update cardata
				var tempcardataid = response.data[0]._id;
				let tempcardata = { ...cardata };
				if (tempcardata.zminot == "זמין" && tempcardata.kshirot == "כשיר") {
					tempcardata.tipuls = [];
					tempcardata.takala_info = "";
					tempcardata.expected_repair = "";
				} else {
					tempcardata.tipuls = finalspecialkeytwo;
				}

				var isTechnology = false;
				var newMakat;
				if (tempcardata.magadal == "magadal04") {
					//change to the magadal of technologies in the database in army
					isTechnology = true;
				}
				if (isTechnology == true) {
					newMakat = tempcardata.makat.replace(/0/g, "");
					tempcardata.carnumber = newMakat + "-" + tempcardata.carnumber;
				}

				tempcardata.updatedBy = user.personalnumber;
				let result = await axios.put(
					`http://localhost:8000/api/cardata/${tempcardataid}`,
					tempcardata
				);
				//create archivecardata
				delete tempcardata._id;
				let result2 = await axios.post(
					`http://localhost:8000/api/archivecardata`,
					tempcardata
				);
				toast.success(`צ' עודכן בהצלחה`);
				props.ToggleForModal();
			} else {
				//find which unit car is already in.
				let cardata_unitstr = "";
				let gdod_result = await axios.get(
					`http://localhost:8000/api/gdod/${response.data[0].gdod}`
				);
				let hativa_result = await axios.get(
					`http://localhost:8000/api/hativa/${response.data[0].hativa}`
				);
				let ogda_result = await axios.get(
					`http://localhost:8000/api/ogda/${response.data[0].ogda}`
				);
				let pikod_result = await axios.get(
					`http://localhost:8000/api/pikod/${response.data[0].pikod}`
				);
				cardata_unitstr =
					pikod_result.data.name +
					"/" +
					ogda_result.data.name +
					"/" +
					hativa_result.data.name +
					"/" +
					gdod_result.data.name;
				toast.error(
					`צ' כבר שייך ליחידה - ${cardata_unitstr} לא ניתן לשנות יחידה`
				);
			}
		} else {
			//create cardata
			let tempcardata = { ...cardata };
			let tempsystemonZ = { ...technologies };
			let tempfinalspecialkeytwo = { ...finalspecialkeytwo };
			let temptipuls = [];
			tempcardata.updatedBy = user.personalnumber;
			delete tempcardata._id;
			if (tempcardata.zminot == "זמין" && tempcardata.kshirot == "כשיר") {
				tempcardata.tipuls = [];
				delete tempcardata.takala_info;
				delete tempcardata.expected_repair;
			} else {
				//for sorting tipuls between cardata and systemsonZ
				for (let j = 0; j < technologies.length; j++) {
					if (tempsystemonZ[j].kshirot == "לא כשיר") {
						for (let i = 0; i < finalspecialkeytwo.length; i++) {
							if (
								tempfinalspecialkeytwo[i].systemType ==
								tempsystemonZ[j].systemType
							) {
								let temperror = { ...tempfinalspecialkeytwo[i] };
								let tempsystem = [{ ...tempsystemonZ[j].tipuls }];
								delete temperror.errorType;
								delete temperror.systemType;
								tempfinalspecialkeytwo[i] = temperror;
								if (tempsystemonZ[j].tipuls == undefined) {
									tempsystemonZ[j] = {
										...tempsystemonZ[j],
										tipuls: tempfinalspecialkeytwo[i],
									};
								} else {
									tempsystem.push(tempfinalspecialkeytwo[i]);
									tempsystemonZ[j].tipuls = tempsystem;
								}
								tempsystemonZ[j].expected_repair = cardata.expected_repair;
								tempsystemonZ[j].takala_info = cardata.takala_info;
							}
						}
					} else {
						if (tempsystemonZ[j].tipuls) {
							tempsystemonZ[j].tipuls = [];
						}
						if (tempsystemonZ[j].expected_repair) {
							tempsystemonZ[j].expected_repair = "";
						}
						if (tempsystemonZ[j].takala_info) {
							tempsystemonZ[j].takala_info = "";
						}
					}
				}

				for (let l = 0; l < finalspecialkeytwo.length; l++) {
					if (tempfinalspecialkeytwo[l].errorType == "Z") {
						let temp = { ...finalspecialkeytwo[l] };
						delete temp.errorType;
						temptipuls.push(temp);
					}
				}
				tempcardata.tipuls = temptipuls;
				if (tempcardata.tipuls.length == 0) {
					tempcardata.expected_repair = "";
					tempcardata.takala_info = "";
				}
			}

			var isTechnology = false;
			var newMakat;
			if (tempcardata.magadal == "magadal04") {
				//change to the magadal of technologies in the database in army
				isTechnology = true;
			}
			if (isTechnology == true) {
				newMakat = tempcardata.makat.replace(/0/g, "");
				tempcardata.carnumber = newMakat + "-" + tempcardata.carnumber;
			}

			let result = await axios.post(
				`http://localhost:8000/api/cardata`,
				tempcardata
			);
			for (let x = 0; x < technologies.length; x++) {
				let result2 = await axios.post(
					`http://localhost:8000/api/systemsonz`,
					tempsystemonZ[x]
				);
			}

			toast.success(`צ' נוסף בהצלחה`);
			props.ToggleForModal();
		}
	}

	async function UpdateCarData() {
		let response = await axios.get(
			`http://localhost:8000/api/cardata/cardatabycarnumber/${cardata.carnumber}`
		);
		if (response.data[0].status == "עצור" && user.role != "0") {
			toast.error(`הכלי עצור - טרם הועברת תחקיר מפקד יחידה בגין כלי`);
		} else {
			//update cardata
			var tempcardataid = props.cardataid;
			let tempcardata = { ...cardata };
			let tempsystemonZ = { ...technologies };
			let tempfinalspecialkeytwo = { ...finalspecialkeytwo };
			let temptipuls = [];
			if (tempcardata.zminot == "זמין" && tempcardata.kshirot == "כשיר") {
				tempcardata.tipuls = [];
				tempcardata.takala_info = "";
				tempcardata.expected_repair = "";
			} else {
				//for sorting tipuls between cardata and systemsonZ
				for (let j = 0; j < technologies.length; j++) {
					if (tempsystemonZ[j].kshirot == "לא כשיר") {
						for (let i = 0; i < finalspecialkeytwo.length; i++) {
							if (
								tempfinalspecialkeytwo[i].systemType ==
								tempsystemonZ[j].systemType
							) {
								let temperror = { ...tempfinalspecialkeytwo[i] };
								let tempsystem = [{ ...tempsystemonZ[j].tipuls }];
								delete temperror.errorType;
								delete temperror.systemType;
								tempfinalspecialkeytwo[i] = temperror;
								if (tempsystemonZ[j].tipuls == undefined) {
									tempsystemonZ[j] = {
										...tempsystemonZ[j],
										tipuls: tempfinalspecialkeytwo[i],
									};
								} else {
									tempsystem.push(tempfinalspecialkeytwo[i]);
									tempsystemonZ[j].tipuls = tempsystem;
								}
								tempsystemonZ[j].expected_repair = cardata.expected_repair;
								tempsystemonZ[j].takala_info = cardata.takala_info;
							}
						}
					} else {
						if (tempsystemonZ[j].tipuls == undefined) {
							tempsystemonZ[j] = { ...tempsystemonZ[j], tipuls: [] };
						}
						if (tempsystemonZ[j].expected_repair == undefined) {
							tempsystemonZ[j] = { ...tempsystemonZ[j], expected_repair: "" };
						}
						if (tempsystemonZ[j].takala_info == undefined) {
							tempsystemonZ[j] = { ...tempsystemonZ[j], takala_info: "" };
						}
						if (tempsystemonZ[j].tipuls) {
							tempsystemonZ[j].tipuls = [];
						}
						if (tempsystemonZ[j].expected_repair) {
							tempsystemonZ[j].expected_repair = "";
						}
						if (tempsystemonZ[j].takala_info) {
							tempsystemonZ[j].takala_info = "";
						}
					}
				}

				for (let l = 0; l < finalspecialkeytwo.length; l++) {
					if (tempfinalspecialkeytwo[l].errorType == "Z") {
						let temp = { ...finalspecialkeytwo[l] };
						delete temp.errorType;
						temptipuls.push(temp);
					}
				}
				tempcardata.tipuls = temptipuls;
				if (tempcardata.tipuls.length == 0) {
					tempcardata.expected_repair = "";
					tempcardata.takala_info = "";
				}
			}

			var isTechnology = false;
			var newMakat;
			if (tempcardata.magadal == "magadal04") {
				//change im army
				isTechnology = true;
			}
			if (isTechnology == true) {
				newMakat = tempcardata.makat.replace(/0/g, "");
				tempcardata.carnumber = tempcardata.carnumber.split("-");
				tempcardata.carnumber = newMakat + "-" + tempcardata.carnumber[1];
			}
			tempcardata.updatedBy = user.personalnumber;
			let result = await axios.put(
				`http://localhost:8000/api/cardata/${tempcardataid}`,
				tempcardata
			);
			for (let x = 0; x < technologies.length; x++) {
				let result2 = await axios.put(
					`http://localhost:8000/api/systemsonz/${tempsystemonZ[x].id}`,
					tempsystemonZ[x]
				);
			}
			//create archivecardata
			delete tempcardata._id;
			tempcardata.archiveType = "1";
			let result2 = axios.post(
				`http://localhost:8000/api/archivecardata`,
				tempcardata
			);
			try {
				if (technologies.length > 0) {
					for (let x = 0; x < technologies.length; x++) {
						tempsystemonZ[x].archiveType = "2";
						let result3 = axios.post(
							`http://localhost:8000/api/archivecardata`,
							tempsystemonZ[x]
						);
					}
				}
			} catch (error) {
				console.log(error);
			}
			toast.success(`צ' עודכן בהצלחה`);
			props.ToggleForModal();
		}
	}

	function init() {
		if (props.cardataid != undefined) {
			loadcardata();
		} else {
			fixnewcardataunitsbyunittype();
		}
		getMagadals();
		loadPikods();
		getTipultypes();
	}

	useEffect(() => {
		setOgdas([]);
		loadOgdas(cardata.pikod);
	}, [cardata.pikod]);

	useEffect(() => {
		setHativas([]);
		loadHativas(cardata.ogda);
	}, [cardata.ogda]);

	useEffect(() => {
		setGdods([]);
		loadGdods(cardata.hativa);
	}, [cardata.hativa]);

	useEffect(() => {
		setMagads([]);
		getMagads(cardata.magadal);
	}, [cardata.magadal]);

	useEffect(() => {
		setMkabazs([]);
		getMkabazs(cardata.magad);
	}, [cardata.magad]);

	useEffect(() => {
		setMakats([]);
		getMakats(cardata.mkabaz);
	}, [cardata.mkabaz]);

	useEffect(() => {
		if (cardata.makat != undefined) {
			getSystemstomakats(cardata.makat);
		}
	}, [cardata.makat]);

	useEffect(() => {
		if (props.isOpen == true) {
			init();
		} else {
			setCarData({});
			setFinalSpecialKeytwo([]);
			setTechnologies([]);
			setDeleteId();
		}
	}, [props.isOpen]);

	//new 18.8.22

	useEffect(() => {
		if (cardata.gdod && cardata.gdod != undefined && cardata.gdod != null) {
			axios
				.get(`http://localhost:8000/api/gdod/${cardata.gdod}`)
				.then((response) => {
					if (/*response.data.sadir && */ response.data.sadir == "לא סדיר") {
						setIsgdodsadir(false);
					} else {
						setIsgdodsadir(true);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [cardata.gdod]);

	return (
		<>
			<TechFormModalDelete
				isOpen={istechformdeleteopen}
				carnumber={cardata.carnumber}
				index={deleteIndex}
				Toggle={ToggleDelete}
				exit={toggleexitmodaldel}
				ToggleForModal={ToggleForModalDelete}
			/>
			<Modal
				style={{
					minHeight: "100%",
					maxHeight: "100%",
					minWidth: "80%",
					maxWidth: "80%",
					justifyContent: "center",
					alignSelf: "center",
					marginTop:
						finalspecialkeytwo.length > 0
							? (finalspecialkeytwo.length * 114) / 2 + "px"
							: "auto",
					direction: "rtl",
				}}
				isOpen={props.isOpen}
				centered
				fullscreen
				scrollable
				size=""
				toggle={props.Toggle}
			>
				<ModalBody>
					<Card>
						<CardHeader style={{ direction: "rtl" }}>
							<CardTitle
								tag="h4"
								style={{
									direction: "rtl",
									textAlign: "center",
									fontWeight: "bold",
								}}
							>
								טופס זמינות כלי
							</CardTitle>
							{/*headline*/}
						</CardHeader>
						<CardBody style={{ direction: "rtl" }}>
							{user.site_permission == undefined ||
							user.site_permission == "צפייה ועריכה" ? (
								<Container>
									<Row>
										{props.cardataid ? (
											<Col
												style={{
													justifyContent: "right",
													alignContent: "right",
													textAlign: "right",
												}}
											>
												<h6 style={{}}>צ'</h6>
												<Input
													placeholder="צ'"
													type="string"
													name="carnumber"
													value={cardata.carnumber}
													onChange={handleChange}
													disabled
												/>
											</Col>
										) : (
											<Col
												style={{
													justifyContent: "right",
													alignContent: "right",
													textAlign: "right",
												}}
											>
												<Row>
													<Col xs={12} md={8}>
														<h6 style={{}}>צ'</h6>
														<Input
															placeholder="צ'"
															type="string"
															name="carnumber"
															value={cardata.carnumber}
															onChange={handleChange}
														/>
													</Col>
													<Col
														xs={12}
														md={4}
														style={{ padding: "0px", textAlign: "center" }}
													>
														<button
															className="btn-new-blue"
															style={{ margin: "0px", marginTop: "1.3rem" }}
															onClick={CheckCarnumberAndSetFormdata}
														>
															חפש
														</button>
													</Col>
												</Row>
											</Col>
										)}

										<Col
											style={{
												justifyContent: "right",
												alignContent: "right",
												textAlign: "right",
											}}
										>
											<h6 style={{}}>משפחה</h6>
											<Input
												placeholder="משפחה"
												type="string"
												name="family"
												value={cardata.family}
												onChange={handleChange}
											/>
										</Col>
										<Col
											style={{
												justifyContent: "right",
												alignContent: "right",
												textAlign: "right",
											}}
										>
											<h6 style={{}}>סטאטוס הכלי</h6>
											<Input
												placeholder="סטאטוס הכלי"
												type="select"
												name="status"
												value={cardata.status}
												onChange={handleChange}
											>
												<option value={"בחר"}>{"בחר"}</option>
												<option value={"פעיל"}>{"פעיל"}</option>
												<option value={"מושבת"}>{"מושבת"}</option>
												<option value={"מיועד להשבתה"}>{"מיועד להשבתה"}</option>
												{user.role == "0" ? (
													<option value={"עצור"}>{"עצור"}</option>
												) : null}
											</Input>
										</Col>
									</Row>

									<Row>
										{!cardata.magad &&
										(props.cardataid == undefined ||
											cardata.magadal != "magadal04") ? ( //change to the magadal of technologies in the database in army
											<Col
												style={{
													justifyContent: "right",
													alignContent: "right",
													textAlign: "right",
												}}
											>
												<h6>מאגד על</h6>
												<Select
													data={
														props.cardataid != undefined
															? magadals.filter(
																	(magadal) => magadal.name != "טכנולוגיות"
															  )
															: magadals
													}
													handleChange2={handleChange2}
													name={"magadal"}
													val={cardata.magadal ? cardata.magadal : undefined}
												/>
											</Col>
										) : (
											<Col
												style={{
													justifyContent: "right",
													alignContent: "right",
													textAlign: "right",
												}}
											>
												<h6>מאגד על</h6>
												<Select
													data={magadals}
													handleChange2={handleChange2}
													name={"magadal"}
													val={cardata.magadal ? cardata.magadal : undefined}
													isDisabled={true}
												/>
											</Col>
										)}

										{cardata.magadal && !cardata.mkabaz ? (
											<Col
												style={{
													justifyContent: "right",
													alignContent: "right",
													textAlign: "right",
												}}
											>
												<h6>מאגד</h6>
												<Select
													data={magads}
													handleChange2={handleChange2}
													name={"magad"}
													val={cardata.magad ? cardata.magad : undefined}
												/>
											</Col>
										) : (
											<Col
												style={{
													justifyContent: "right",
													alignContent: "right",
													textAlign: "right",
												}}
											>
												<h6>מאגד</h6>
												<Select
													data={magads}
													handleChange2={handleChange2}
													name={"magad"}
													val={cardata.magad ? cardata.magad : undefined}
													isDisabled={true}
												/>
											</Col>
										)}

										{cardata.magad && !cardata.makat ? (
											<Col
												style={{
													justifyContent: "right",
													alignContent: "right",
													textAlign: "right",
												}}
											>
												<h6>מקבץ</h6>
												<Select
													data={mkabazs}
													handleChange2={handleChange2}
													name={"mkabaz"}
													val={cardata.mkabaz ? cardata.mkabaz : undefined}
												/>
											</Col>
										) : (
											<Col
												style={{
													justifyContent: "right",
													alignContent: "right",
													textAlign: "right",
												}}
											>
												<h6>מקבץ</h6>
												<Select
													data={mkabazs}
													handleChange2={handleChange2}
													name={"mkabaz"}
													val={cardata.mkabaz ? cardata.mkabaz : undefined}
													isDisabled={true}
												/>
											</Col>
										)}

										{cardata.mkabaz ? (
											<Col
												style={{
													justifyContent: "right",
													alignContent: "right",
													textAlign: "right",
												}}
											>
												<h6>מק"ט</h6>
												<Select
													data={makats}
													handleChange2={handleChange2}
													name={"makat"}
													val={cardata.makat ? cardata.makat : undefined}
												/>
											</Col>
										) : (
											<Col
												style={{
													justifyContent: "right",
													alignContent: "right",
													textAlign: "right",
												}}
											>
												<h6>מק"ט</h6>
												<Select
													data={makats}
													handleChange2={handleChange2}
													name={"makat"}
													val={cardata.makat ? cardata.makat : undefined}
													isDisabled={true}
												/>
											</Col>
										)}

										{cardata.makat ? (
											<Col
												style={{
													display: "flex",
													justifyContent: "center",
													alignContent: "center",
													alignItems: "center",
												}}
											>
												{/* {console.log(systems)} */}
												{makats.map((makat, index) =>
													makat._id == cardata.makat ? makat.description : null
												)}
											</Col>
										) : (
											<Col
												style={{
													display: "flex",
													justifyContent: "center",
													alignContent: "center",
													alignItems: "center",
												}}
											></Col>
										)}
									</Row>

									<Row style={{ paddingTop: "10px" }}>
										{props.unittype == "admin" ||
										props.unittype == "general" ||
										props.unittype == "notype" ? (
											<>
												{!cardata.ogda ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>פיקוד</h6>
														<Select
															data={pikods}
															handleChange2={handleChange2}
															name={"pikod"}
															val={cardata.pikod ? cardata.pikod : undefined}
														/>
													</Col>
												) : (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>פיקוד</h6>
														<Select
															data={pikods}
															handleChange2={handleChange2}
															name={"pikod"}
															val={cardata.pikod ? cardata.pikod : undefined}
															isDisabled={true}
														/>
													</Col>
												)}
											</>
										) : null}

										{props.unittype == "admin" ||
										props.unittype == "general" ||
										props.unittype == "notype" ||
										props.unittype == "pikod" ? (
											<>
												{cardata.pikod && !cardata.hativa ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>אוגדה</h6>
														<Select
															data={ogdas}
															handleChange2={handleChange2}
															name={"ogda"}
															val={cardata.ogda ? cardata.ogda : undefined}
														/>
													</Col>
												) : (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>אוגדה</h6>
														<Select
															data={ogdas}
															handleChange2={handleChange2}
															name={"ogda"}
															val={cardata.ogda ? cardata.ogda : undefined}
															isDisabled={true}
														/>
													</Col>
												)}
											</>
										) : null}

										{props.unittype == "admin" ||
										props.unittype == "general" ||
										props.unittype == "notype" ||
										props.unittype == "pikod" ||
										props.unittype == "ogda" ? (
											<>
												{cardata.ogda && !cardata.gdod ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>חטיבה</h6>
														<Select
															data={hativas}
															handleChange2={handleChange2}
															name={"hativa"}
															val={cardata.hativa ? cardata.hativa : undefined}
														/>
													</Col>
												) : (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>חטיבה</h6>
														<Select
															data={hativas}
															handleChange2={handleChange2}
															name={"hativa"}
															val={cardata.hativa ? cardata.hativa : undefined}
															isDisabled={true}
														/>
													</Col>
												)}
											</>
										) : null}

										{props.unittype == "admin" ||
										props.unittype == "general" ||
										props.unittype == "notype" ||
										props.unittype == "pikod" ||
										props.unittype == "ogda" ||
										props.unittype == "hativa" ? (
											<>
												{cardata.hativa ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>גדוד</h6>
														<Select
															data={gdods}
															handleChange2={handleChange2}
															name={"gdod"}
															val={cardata.gdod ? cardata.gdod : undefined}
														/>
													</Col>
												) : (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>גדוד</h6>
														<Select
															data={gdods}
															handleChange2={handleChange2}
															name={"gdod"}
															val={cardata.gdod ? cardata.gdod : undefined}
															isDisabled={true}
														/>
													</Col>
												)}
											</>
										) : null}
									</Row>

									<Row>
										<Col>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<h6>פלוגה</h6>
											</div>
											<Input
												placeholder="פלוגה"
												type="string"
												name="pluga"
												value={cardata.pluga}
												onChange={handleChange}
											/>
										</Col>
										<Col>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<h6>שבצ"ק</h6>
											</div>
											<Input
												placeholder={`שבצ"ק`}
												type="string"
												name="shabzak"
												value={cardata.shabzak}
												onChange={handleChange}
											/>
										</Col>
										<Col>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<h6>מיקום בימ"ח</h6>
											</div>
											<Input
												placeholder={`מיקום בימ"ח`}
												type="string"
												name="mikum_bimh"
												value={cardata.mikum_bimh}
												onChange={handleChange}
											/>
										</Col>
										<Col>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<h6>מעמד הכלי</h6>
											</div>
											<Input
												placeholder="מעמד הכלי"
												type="select"
												name="stand"
												value={cardata.stand}
												onChange={handleChange}
											>
												<option value={"בחר"}>בחר</option>
												<option value={"סדיר"}>סדיר</option>
												<option value={"הכן"}>הכן</option>
												<option value={'הח"י'}>הח"י</option>
											</Input>
										</Col>
									</Row>

									<h4
										style={{
											direction: "rtl",
											textAlign: "center",
											fontWeight: "bold",
										}}
									>
										זמינות/כשירות
									</h4>

									<div
										style={{
											textAlign: "right",
											paddingTop: "10px",
											fontWeight: "bold",
										}}
									>
										<h6>טכנולוגיות על גבי אמל"ח</h6>
									</div>
									{cardata.makat ? (
										<button
											className="btn-new-blue"
											style={{
												position: "relative",
												padding: "11px 17px",
												borderRadius: "50%",
												display: "flex",
											}}
											onClick={() => {
												if (systems.length > 0) {
													setTechnologies((currentSpec) => [
														{
															id: generate(),
															carnumber: cardata.carnumber,
															isLocked: "false",
														},
														...currentSpec,
													]);
												} else {
													toast.error('מק"ט ריק');
												}
											}}
										>
											+
										</button>
									) : (
										<button
											className="btn-new-blue"
											style={{
												position: "relative",
												padding: "11px 17px",
												borderRadius: "50%",
												display: "flex",
											}}
											onClick={() => {
												toast.error('מק"ט ריק');
											}}
										>
											+
										</button>
									)}

									{technologies.map((t, index) => {
										return t.isLocked == "false" ? (
											<Row>
												<img
													style={{
														cursor: "pointer",
														padding: "1px",
														height: "25px",
														marginTop: "28px",
														marginLeft: "15px",
													}}
													src={savepic}
													height="15px"
													onClick={() => {
														if (t.systemType) {
															setTechnologies((currentSpec) =>
																produce(currentSpec, (v) => {
																	v[index].isLocked = "true";
																})
															);
														} else {
															toast.error(
																"על מנת לשמור מערכת יש לציין את סוג המערכת"
															);
														}
													}}
												/>
												<button
													className="btn-new-delete"
													style={{
														padding: "1px",
														height: "25px",
														marginTop: "28px",
													}}
													onClick={() => ToggleDelete(t, index)}
												>
													<img src={deletepic} height="15px"></img>
												</button>
												<Col xs={12} md={4}>
													<div>
														<p style={{ margin: "0px", float: "right" }}>
															<h6>סוג מערכת</h6>
														</p>
														<Input
															onChange={(e) => {
																const tech = e.target.value;
																let flag = false;
																if (tech != "בחר")
																	if (technologies.length > 1) {
																		for (
																			let i = 0;
																			i < technologies.length;
																			i++
																		) {
																			if (technologies[i].systemType == tech) {
																				flag = true;
																			}
																		}
																	}
																if (flag == false) {
																	setTechnologies((currentSpec) =>
																		produce(currentSpec, (v) => {
																			v[index].systemType = tech;
																		})
																	);
																	setTechnologies((currentSpec) =>
																		produce(currentSpec, (v) => {
																			v[index].isLocked = "true";
																		})
																	);
																} else {
																	toast.error("מערכת זו כבר מקושרת ל-צ' זה");
																}
															}}
															value={t.systemType ? t.systemType : "בחר"}
															type="select"
															placeholder="סוג מערכת"
														>
															<option value={"בחר"}>{"בחר"}</option>
															{systems.map((system, i) =>
																system ? (
																	<option value={system.name}>
																		{system.name}
																	</option>
																) : null
															)}
														</Input>
													</div>
												</Col>
												<Col xs={12} md={4}>
													<div>
														<p style={{ margin: "0px", float: "right" }}>
															<h6>כשירות</h6>
														</p>
														<Input
															onChange={(e) => {
																const kshirot = e.target.value;
																if (e.target.value != "בחר") {
																	setTechnologies((currentSpec) =>
																		produce(currentSpec, (v) => {
																			v[index].kshirot = kshirot;
																		})
																	);
																	if (e.target.value == "לא כשיר") {
																		let isMashbit;
																		for (let i = 0; i < systems.length; i++) {
																			if (systems[i].name == t.systemType) {
																				isMashbit = systems[i].mashbit;
																			}
																		}
																		if (isMashbit == true) {
																			setCarData({
																				...cardata,
																				zminot: "לא זמין",
																				kshirot: "לא כשיר",
																			});
																			toast.info(
																				"בעקבות עדכון כשירות מערכת זמינות וכשירות, הצ' עודכן ל-לא זמין ולא כשיר"
																			);
																		}
																		if (!isMashbit) {
																			setTakalaopen(true);
																		}
																	} else {
																		if (e.target.value == "כשיר") {
																			let isMashbit;
																			for (let i = 0; i < systems.length; i++) {
																				if (systems[i].name == t.systemType) {
																					isMashbit = systems[i].mashbit;
																				}
																			}
																			if (!isMashbit) {
																				setTakalaopen(false);
																			}
																		}
																		let tempfinalspecialkeytwo = [
																			...finalspecialkeytwo,
																		];
																		let flag = false;
																		for (
																			let j = 0;
																			j < finalspecialkeytwo.length;
																			j++
																		) {
																			if (
																				tempfinalspecialkeytwo[j].systemType ==
																				t.systemType
																			) {
																				flag = true;
																				tempfinalspecialkeytwo.splice(j, 1);
																			}
																		}
																		setFinalSpecialKeytwo(
																			tempfinalspecialkeytwo
																		);
																		if (flag == true) {
																			toast.info(
																				"בעקבות עדכון כשירות מערכת על גבי הכלי, סיבות אי הזמינות עודכנו בהתאם"
																			);
																		}
																	}
																}
															}}
															value={t.kshirot ? t.kshirot : "בחר"}
															type="select"
															placeholder="כשירות"
														>
															<option value={"בחר"}>{"בחר"}</option>
															<option value={"כשיר"}>{"כשיר"}</option>
															<option value={"לא כשיר"}>{"לא כשיר"}</option>
														</Input>
													</div>
												</Col>
											</Row>
										) : (
											<Row>
												<img
													style={{
														cursor: "pointer",
														padding: "1px",
														height: "25px",
														marginTop: "28px",
														marginLeft: "15px",
													}}
													src={editpic}
													height="15px"
													onClick={() => {
														setTechnologies((currentSpec) =>
															produce(currentSpec, (v) => {
																v[index].isLocked = "false";
															})
														);
													}}
												/>
												<Col xs={12} md={4}>
													<div>
														<p style={{ margin: "0px", float: "right" }}>
															<h6>סוג מערכת</h6>
														</p>
														<Input
															value={t.systemType ? t.systemType : "בחר"}
															type="select"
															placeholder="סוג מערכת"
															disabled
														>
															<option value={"בחר"}>{"בחר"}</option>
															{systems.map((system, i) =>
																system ? (
																	<option value={system.name}>
																		{system.name}
																	</option>
																) : null
															)}
														</Input>
													</div>
												</Col>
												<Col xs={12} md={4}>
													<div>
														<p style={{ margin: "0px", float: "right" }}>
															<h6>כשירות</h6>
														</p>
														<Input
															onChange={(e) => {
																const kshirot = e.target.value;
																if (e.target.value != "בחר")
																	setTechnologies((currentSpec) =>
																		produce(currentSpec, (v) => {
																			v[index].kshirot = kshirot;
																		})
																	);
																if (e.target.value == "לא כשיר") {
																	let isMashbit;
																	for (let i = 0; i < systems.length; i++) {
																		if (systems[i].name == t.systemType) {
																			isMashbit = systems[i].mashbit;
																		}
																	}
																	if (isMashbit == true) {
																		setCarData({
																			...cardata,
																			zminot: "לא זמין",
																			kshirot: "לא כשיר",
																		});
																		toast.info(
																			"בעקבות עדכון כשירות מערכת זמינות וכשירות, הצ' עודכן ל-לא זמין ולא כשיר"
																		);
																	}
																	if (!isMashbit) {
																		setTakalaopen(true);
																	}
																} else {
																	if (e.target.value == "כשיר") {
																		let isMashbit;
																		for (let i = 0; i < systems.length; i++) {
																			if (systems[i].name == t.systemType) {
																				isMashbit = systems[i].mashbit;
																			}
																		}
																		if (!isMashbit) {
																			setTakalaopen(false);
																		}
																	}
																	let tempfinalspecialkeytwo = [
																		...finalspecialkeytwo,
																	];
																	let flag = false;
																	for (
																		let j = 0;
																		j < finalspecialkeytwo.length;
																		j++
																	) {
																		if (tempfinalspecialkeytwo[j]) {
																			console.log(tempfinalspecialkeytwo[j]);
																			if (
																				tempfinalspecialkeytwo[j].systemType ==
																				t.systemType
																			) {
																				flag = true;
																				tempfinalspecialkeytwo.splice(j, 1);
																			}
																		}
																	}
																	setFinalSpecialKeytwo(tempfinalspecialkeytwo);
																	if (flag == true) {
																		toast.info(
																			"בעקבות עדכון כשירות מערכת על גבי הכלי, סיבות אי הזמינות עודכנו בהתאם"
																		);
																	}
																}
															}}
															value={t.kshirot ? t.kshirot : "בחר"}
															type="select"
															placeholder="כשירות"
														>
															<option value={"בחר"}>{"בחר"}</option>
															<option value={"כשיר"}>{"כשיר"}</option>
															<option value={"לא כשיר"}>{"לא כשיר"}</option>
														</Input>
													</div>
												</Col>
											</Row>
										);
									})}

									<Row>
										<Col>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<h6>זמינות</h6>
											</div>
											<Input
												style={{ border: "2px solid" }}
												placeholder="זמינות"
												type="select"
												name="zminot"
												value={cardata.zminot}
												onChange={handleChange}
											>
												<option value={"בחר"}>בחר</option>
												<option value={"זמין"}>זמין</option>
												<option value={"לא זמין"}>לא זמין</option>
											</Input>
										</Col>
										<Col>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<h6>כשירות למלחמה</h6>
											</div>
											<Input
												style={{ border: "2px solid" }}
												placeholder="כשירות למלחמה"
												type="select"
												name="kshirot"
												value={cardata.kshirot}
												onChange={handleChange}
											>
												<option value={"בחר"}>בחר</option>
												<option value={"כשיר"}>כשיר</option>
												<option value={"לא כשיר"}>לא כשיר</option>
											</Input>
										</Col>
									</Row>

									{cardata.kshirot == "לא כשיר" ||
									cardata.zminot == "לא זמין" ||
									takalaopen ? (
										<>
											{/* tipuls */}
											<div
												style={{
													textAlign: "right",
													paddingTop: "10px",
													fontWeight: "bold",
												}}
											>
												<h6>סיבות אי זמינות</h6>
											</div>

											<div>
												{finalspecialkeytwo.length == 0 ? (
													<Row>
														<Col
															style={{
																display: "flex",
																justifyContent: "center",
															}}
														>
															<Button
																style={{ width: "100px", padding: "5px" }}
																type="button"
																onClick={() => {
																	setFinalSpecialKeytwo((currentSpec) => [
																		...currentSpec,
																		{ id: generate(), type: "tipul" },
																	]);
																}}
															>
																הוסף טיפול
															</Button>
														</Col>
														<Col
															style={{
																display: "flex",
																justifyContent: "center",
															}}
														>
															<Button
																style={{ width: "100px", padding: "5px" }}
																type="button"
																onClick={() => {
																	setFinalSpecialKeytwo((currentSpec) => [
																		...currentSpec,
																		{ id: generate(), type: "harig_tipul" },
																	]);
																}}
															>
																הוסף חריגת טיפול
															</Button>
														</Col>
														<Col
															style={{
																display: "flex",
																justifyContent: "center",
															}}
														>
															<Button
																style={{ width: "100px", padding: "5px" }}
																type="button"
																onClick={() => {
																	setFinalSpecialKeytwo((currentSpec) => [
																		...currentSpec,
																		{
																			id: generate(),
																			type: "takala_mizdamenet",
																		},
																	]);
																}}
															>
																הוסף תקלה מזדמנת
															</Button>
														</Col>
													</Row>
												) : (
													finalspecialkeytwo.map((p, index) => {
														return (
															<div>
																{index == 0 ? (
																	<Row>
																		<Col
																			style={{
																				display: "flex",
																				justifyContent: "center",
																			}}
																		>
																			<Button
																				style={{
																					width: "100px",
																					padding: "5px",
																				}}
																				type="button"
																				onClick={() => {
																					setFinalSpecialKeytwo(
																						(currentSpec) => [
																							...currentSpec,
																							{ id: generate(), type: "tipul" },
																						]
																					);
																				}}
																			>
																				הוסף טיפול
																			</Button>
																		</Col>
																		<Col
																			style={{
																				display: "flex",
																				justifyContent: "center",
																			}}
																		>
																			<Button
																				style={{
																					width: "100px",
																					padding: "5px",
																				}}
																				type="button"
																				onClick={() => {
																					setFinalSpecialKeytwo(
																						(currentSpec) => [
																							...currentSpec,
																							{
																								id: generate(),
																								type: "harig_tipul",
																							},
																						]
																					);
																				}}
																			>
																				הוסף חריגת טיפול
																			</Button>
																		</Col>
																		<Col
																			style={{
																				display: "flex",
																				justifyContent: "center",
																			}}
																		>
																			<Button
																				style={{
																					width: "100px",
																					padding: "5px",
																				}}
																				type="button"
																				onClick={() => {
																					setFinalSpecialKeytwo(
																						(currentSpec) => [
																							...currentSpec,
																							{
																								id: generate(),
																								type: "takala_mizdamenet",
																							},
																						]
																					);
																				}}
																			>
																				הוסף תקלה מזדמנת
																			</Button>
																		</Col>
																	</Row>
																) : null}

																{p.type == "tipul" ? (
																	<>
																		<Row>
																			<Col xs={12} md={2}>
																				<div>
																					<p
																						style={{
																							margin: "0px",
																							float: "right",
																						}}
																					>
																						<h6>סוג כלי</h6>
																					</p>
																					<Input
																						onChange={(e) => {
																							const value = e.target.value;
																							if (value != "undefined") {
																								if (
																									value == "Z" &&
																									cardata.kshirot == "כשיר" &&
																									cardata.zminot == "זמין"
																								) {
																									toast.error(
																										"במקרה והכלי זמין וכשיר לא ניתן להזין עליו סיבות אי זמינות"
																									);
																								} else {
																									console.log(
																										technologies.map(
																											(tec) =>
																												tec.kshirot == "לא כשיר"
																										)
																									);
																									console.log(
																										technologies
																											.map(
																												(tec) =>
																													tec.kshirot ==
																													"לא כשיר"
																											)
																											.includes(true)
																									);
																									if (
																										value == "Z" ||
																										(value == "technology" &&
																											(technologies.length > 0
																												? technologies
																														.map(
																															(tec) =>
																																tec.kshirot ==
																																"לא כשיר"
																														)
																														.includes(true)
																												: technologies.length >
																												  0))
																									) {
																										setFinalSpecialKeytwo(
																											(currentSpec) =>
																												produce(
																													currentSpec,
																													(v) => {
																														v[index].errorType =
																															value;
																													}
																												)
																										);
																									} else {
																										{
																											/* text tec is kashir / not system on z */
																										}
																										if (
																											technologies
																												.map(
																													(tec) =>
																														tec.kshirot ==
																														"כשיר"
																												)
																												.includes(true)
																										) {
																											toast.error(
																												"במקרה שכל המערכות כשירות לא ניתן להזין עליהן סיבות אי זמניות"
																											);
																										} else {
																											toast.error(
																												"ל-צ' זה לא מקושרות מערכות"
																											);
																										}
																									}
																									if (value != "technology") {
																										setFinalSpecialKeytwo(
																											(currentSpec) =>
																												produce(
																													currentSpec,
																													(v) => {
																														delete v[index]
																															.systemType;
																													}
																												)
																										);
																									}
																								}
																							}
																						}}
																						value={p.errorType}
																						type="select"
																						placeholder="בחירה"
																					>
																						<option value={"undefined"}>
																							{"בחר"}
																						</option>
																						<option value={"Z"}> צ' </option>
																						<option value={"technology"}>
																							{" "}
																							מערכת{" "}
																						</option>
																					</Input>
																				</div>
																			</Col>
																			{p.errorType == "technology" ? (
																				<Col xs={12} md={2}>
																					<div>
																						<p
																							style={{
																								margin: "0px",
																								float: "right",
																							}}
																						>
																							<h6>בחר מערכת</h6>
																						</p>
																						<Input
																							onChange={(e) => {
																								const systemType =
																									e.target.value;
																								if (e.target.value != "בחר")
																									setFinalSpecialKeytwo(
																										(currentSpec) =>
																											produce(
																												currentSpec,
																												(v) => {
																													v[index].systemType =
																														systemType;
																												}
																											)
																									);
																							}}
																							value={p.systemType}
																							type="select"
																							placeholder="מערכת"
																						>
																							<option value={"בחר"}>
																								{"בחר"}
																							</option>
																							{technologies.map(
																								(technology, i) =>
																									technology.kshirot ==
																									"לא כשיר" ? (
																										<option
																											value={
																												technology.systemType
																											}
																										>
																											{technology.systemType}
																										</option>
																									) : null
																							)}
																						</Input>
																					</div>
																				</Col>
																			) : null}

																			<Col xs={12} md={3}>
																				<div>
																					<p
																						style={{
																							margin: "0px",
																							float: "right",
																						}}
																					>
																						<h6>סוג הטיפול</h6>
																					</p>
																					<Input
																						onChange={(e) => {
																							const tipul = e.target.value;
																							if (e.target.value != "בחר")
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[index].tipul = tipul;
																											}
																										)
																								);
																						}}
																						value={p.tipul}
																						type="select"
																						placeholder="סוג הטיפול"
																					>
																						<option value={"בחר"}>
																							{"בחר"}
																						</option>
																						{tipuls.map((tipul, i) =>
																							tipul ? (
																								<option value={tipul.name}>
																									{tipul.name}
																								</option>
																							) : null
																						)}
																					</Input>
																				</div>
																			</Col>
																			<Col xs={12} md={3}>
																				<div>
																					<p
																						style={{
																							margin: "0px",
																							float: "right",
																						}}
																					>
																						<h6>תאריך כניסה לטיפול</h6>
																					</p>
																					<Input
																						onChange={(e) => {
																							const tipul_entry_date =
																								e.target.value;
																							if (e.target.value != "בחר")
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[
																													index
																												].tipul_entry_date =
																													tipul_entry_date;
																											}
																										)
																								);
																						}}
																						value={p.tipul_entry_date}
																						type="date"
																						placeholder="תאריך כניסה לטיפול"
																						min="1900-01-01"
																						max="2040-01-01"
																					/>
																				</div>
																			</Col>
																			<Col xs={12} md={2}>
																				<div>
																					<p
																						style={{
																							margin: "0px",
																							float: "right",
																						}}
																					>
																						<h6>מיקום הטיפול</h6>
																					</p>
																					<Input
																						onChange={(e) => {
																							const mikum_tipul =
																								e.target.value;
																							if (e.target.value != "בחר")
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[index].mikum_tipul =
																													mikum_tipul;
																											}
																										)
																								);
																						}}
																						value={p.mikum_tipul}
																						type="select"
																						placeholder="מיקום הטיפול"
																					>
																						<option value={"בחר"}>
																							{"בחר"}
																						</option>
																						<option value={"ביחידה"}>
																							{"ביחידה"}
																						</option>
																						<option value={"אגד ארצי"}>
																							{"אגד ארצי"}
																						</option>
																						<option
																							value={`מש"א`}
																						>{`מש"א`}</option>
																						<option value={"אחזקות חוץ"}>
																							{"אחזקות חוץ"}
																						</option>
																					</Input>
																				</div>
																			</Col>
																		</Row>
																		{/* הוספת ח"ח */}
																		<Row>
																			<div>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																						marginLeft: "5px",
																						marginRight: "15px",
																						fontWeight: "bold",
																						fontSize: "15px",
																					}}
																				>
																					<h5>האם עומד על ח"ח</h5>
																				</p>
																				{p.hh_stands ? (
																					<Input
																						style={{
																							width: "18px",
																							height: "18px",
																						}}
																						id="Is_hh_stand"
																						type="checkbox"
																						onChange={(e) => {
																							if (e.target.checked == true) {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[index].hh_stands = [
																													{
																														id: generate(),
																														type: "hh_stand",
																													},
																												];
																											}
																										)
																								);
																							} else {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												delete v[index]
																													.hh_stands;
																											}
																										)
																								);
																							}
																						}}
																						checked
																					/>
																				) : (
																					<Input
																						style={{
																							width: "18px",
																							height: "18px",
																						}}
																						id="Is_hh_stand"
																						type="checkbox"
																						onChange={(e) => {
																							if (e.target.checked == true) {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[index].hh_stands = [
																													{
																														id: generate(),
																														type: "hh_stand",
																													},
																												];
																											}
																										)
																								);
																							} else {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												delete v[index]
																													.hh_stands;
																											}
																										)
																								);
																							}
																						}}
																					/>
																				)}
																			</div>
																		</Row>
																		{p.hh_stands ? (
																			<>
																				<Row>
																					<Col>
																						<Button
																							style={{
																								width: "100px",
																								padding: "5px",
																								display: "flex",
																							}}
																							type="button"
																							onClick={() => {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[index].hh_stands[
																													p.hh_stands.length
																												] = {
																													id: generate(),
																													type: "hh_stand",
																												};
																											}
																										)
																								);
																							}}
																						>
																							הוסף עומד על ח"ח
																						</Button>
																					</Col>
																				</Row>
																				{p.hh_stands.map((hh_stand, i) => {
																					return (
																						<>
																							<Row>
																								<Col xs={12} md={6}>
																									<div>
																										<p
																											style={{
																												margin: "0px",
																												float: "right",
																											}}
																										>
																											<h6>מק"ט חסר</h6>
																										</p>
																										<Input
																											onChange={(e) => {
																												const missing_makat_1 =
																													e.target.value;
																												if (
																													e.target.value !=
																													"בחר"
																												)
																													setFinalSpecialKeytwo(
																														(currentSpec) =>
																															produce(
																																currentSpec,
																																(v) => {
																																	v[
																																		index
																																	].hh_stands[
																																		i
																																	].missing_makat_1 =
																																		missing_makat_1;
																																}
																															)
																													);
																											}}
																											value={
																												p.hh_stands[i]
																													.missing_makat_1
																													? p.hh_stands[i]
																															.missing_makat_1
																													: ""
																											}
																											type="string"
																											placeholder={`מק"ט חסר`}
																										></Input>
																									</div>
																								</Col>
																								<Col xs={12} md={6}>
																									<div>
																										<p
																											style={{
																												margin: "0px",
																												float: "right",
																											}}
																										>
																											<h6>כמות</h6>
																										</p>
																										<Input
																											onChange={(e) => {
																												const missing_makat_2 =
																													e.target.value;
																												if (
																													missing_makat_2 ==
																														null ||
																													!isNaN(
																														missing_makat_2
																													)
																												)
																													setFinalSpecialKeytwo(
																														(currentSpec) =>
																															produce(
																																currentSpec,
																																(v) => {
																																	v[
																																		index
																																	].hh_stands[
																																		i
																																	].missing_makat_2 =
																																		missing_makat_2;
																																}
																															)
																													);
																											}}
																											value={
																												p.hh_stands[i]
																													.missing_makat_2
																													? p.hh_stands[i]
																															.missing_makat_2
																													: ""
																											}
																											type="string"
																											placeholder={`כמות`}
																										></Input>
																									</div>
																								</Col>
																							</Row>
																							<Button
																								style={{ display: "block" }}
																								type="button"
																								onClick={() => {
																									let newArr = JSON.parse(
																										JSON.stringify(
																											finalspecialkeytwo
																										)
																									);
																									newArr[
																										index
																									].hh_stands.splice(i, 1);
																									setFinalSpecialKeytwo(newArr);
																								}}
																							>
																								<img
																									src={deletepic}
																									height="20px"
																								></img>
																							</Button>
																						</>
																					);
																				})}
																			</>
																		) : null}
																		{/* הוספת ח"ח */}
																	</>
																) : p.type == "harig_tipul" ? (
																	<>
																		<Row>
																			<Col xs={12} md={2}>
																				<div>
																					<p
																						style={{
																							margin: "0px",
																							float: "right",
																						}}
																					>
																						<h6>סוג כלי</h6>
																					</p>
																					<Input
																						onChange={(e) => {
																							const value = e.target.value;
																							if (value != "undefined") {
																								if (
																									value == "Z" &&
																									cardata.kshirot == "כשיר" &&
																									cardata.zminot == "זמין"
																								) {
																									toast.error(
																										"במקרה והכלי זמין ושכיר לא ניתן להזין עליו סיבות אי זמניות"
																									);
																								} else {
																									// console.log(technologies.map(tec => tec.kshirot == "כשיר"))
																									// console.log(technologies.map(tec => tec.kshirot == "כשיר").includes(true))
																									if (
																										value == "Z" ||
																										(value == "technology" &&
																											(technologies.length > 0
																												? !technologies
																														.map(
																															(tec) =>
																																tec.kshirot ==
																																"כשיר"
																														)
																														.includes(true)
																												: technologies.length >
																												  0))
																									) {
																										setFinalSpecialKeytwo(
																											(currentSpec) =>
																												produce(
																													currentSpec,
																													(v) => {
																														v[index].errorType =
																															value;
																													}
																												)
																										);
																									} else {
																										{
																											/* text tec is kashir / not system on z */
																										}
																										if (
																											technologies
																												.map(
																													(tec) =>
																														tec.kshirot ==
																														"כשיר"
																												)
																												.includes(true)
																										) {
																											toast.error(
																												"במקרה שכל המערכות כשירות לא ניתן להזין עליהן סיבות אי זמניות"
																											);
																										} else {
																											toast.error(
																												"ל-צ' זה לא מקושרות מערכות"
																											);
																										}
																									}
																									if (value != "technology") {
																										setFinalSpecialKeytwo(
																											(currentSpec) =>
																												produce(
																													currentSpec,
																													(v) => {
																														delete v[index]
																															.systemType;
																													}
																												)
																										);
																									}
																								}
																							}
																						}}
																						value={p.errorType}
																						type="select"
																						placeholder="בחירה"
																					>
																						<option value={"undefined"}>
																							{"בחר"}
																						</option>
																						<option value={"Z"}> צ' </option>
																						<option value={"technology"}>
																							{" "}
																							מערכת{" "}
																						</option>
																					</Input>
																				</div>
																			</Col>
																			{p.errorType == "technology" ? (
																				<Col xs={12} md={2}>
																					<div>
																						<p
																							style={{
																								margin: "0px",
																								float: "right",
																							}}
																						>
																							<h6>בחר מערכת</h6>
																						</p>
																						<Input
																							onChange={(e) => {
																								const systemType =
																									e.target.value;
																								if (e.target.value != "בחר")
																									setFinalSpecialKeytwo(
																										(currentSpec) =>
																											produce(
																												currentSpec,
																												(v) => {
																													v[index].systemType =
																														systemType;
																												}
																											)
																									);
																							}}
																							value={p.systemType}
																							type="select"
																							placeholder="מערכת"
																						>
																							<option value={"בחר"}>
																								{"בחר"}
																							</option>
																							{technologies.map(
																								(technology, i) =>
																									technology.kshirot ==
																									"לא כשיר" ? (
																										<option
																											value={
																												technology.systemType
																											}
																										>
																											{technology.systemType}
																										</option>
																									) : null
																							)}
																						</Input>
																					</div>
																				</Col>
																			) : null}
																			<Col xs={12} md={4}>
																				<div>
																					<p
																						style={{
																							margin: "0px",
																							float: "right",
																						}}
																					>
																						<h6>חריג טיפול</h6>
																					</p>
																					<Input
																						onChange={(e) => {
																							const harig_tipul =
																								e.target.value;
																							if (e.target.value != "בחר")
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[index].harig_tipul =
																													harig_tipul;
																											}
																										)
																								);
																						}}
																						value={p.harig_tipul}
																						type="select"
																						placeholder="חריג טיפול"
																					>
																						<option value={"בחר"}>
																							{"בחר"}
																						</option>
																						{tipuls.map((tipul, i) =>
																							tipul ? (
																								<option value={tipul.name}>
																									{tipul.name}
																								</option>
																							) : null
																						)}
																					</Input>
																				</div>
																			</Col>
																			<Col xs={12} md={4}>
																				<div>
																					<p
																						style={{
																							margin: "0px",
																							float: "right",
																						}}
																					>
																						<h6>תאריך חריגת טיפול</h6>
																					</p>
																					<Input
																						onChange={(e) => {
																							const harig_tipul_date =
																								e.target.value;
																							if (e.target.value != "בחר")
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[
																													index
																												].harig_tipul_date =
																													harig_tipul_date;
																											}
																										)
																								);
																						}}
																						value={p.harig_tipul_date}
																						type="date"
																						placeholder="תאריך חריגת טיפול"
																						min="1900-01-01"
																						max="2040-01-01"
																					/>
																				</div>
																			</Col>
																		</Row>
																		{/* הוספת ח"ח ומעמל */}
																		<Row>
																			<div style={{ paddingLeft: "10px" }}>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																						marginLeft: "5px",
																						marginRight: "15px",
																						fontWeight: "bold",
																						fontSize: "15px",
																					}}
																				>
																					<h5>האם עומד על ח"ח</h5>
																				</p>
																				{p.hh_stands ? (
																					<Input
																						style={{
																							width: "18px",
																							height: "18px",
																						}}
																						id="Is_hh_stand"
																						type="checkbox"
																						onChange={(e) => {
																							if (e.target.checked == true) {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[index].hh_stands = [
																													{
																														id: generate(),
																														type: "hh_stand",
																													},
																												];
																											}
																										)
																								);
																							} else {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												delete v[index]
																													.hh_stands;
																											}
																										)
																								);
																							}
																						}}
																						checked
																					/>
																				) : (
																					<Input
																						style={{
																							width: "18px",
																							height: "18px",
																						}}
																						id="Is_hh_stand"
																						type="checkbox"
																						onChange={(e) => {
																							if (e.target.checked == true) {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[index].hh_stands = [
																													{
																														id: generate(),
																														type: "hh_stand",
																													},
																												];
																											}
																										)
																								);
																							} else {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												delete v[index]
																													.hh_stands;
																											}
																										)
																								);
																							}
																						}}
																					/>
																				)}
																			</div>
																			<div>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																						marginLeft: "5px",
																						marginRight: "15px",
																						fontWeight: "bold",
																						fontSize: "15px",
																					}}
																				>
																					<h5>האם בוצע טיפול מעמ”ל</h5>
																				</p>
																				{p.is_maamal ? (
																					<Input
																						style={{
																							width: "18px",
																							height: "18px",
																						}}
																						id="Is_maamal"
																						type="checkbox"
																						onChange={(e) => {
																							if (e.target.checked == true) {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[
																													index
																												].is_maamal = true;
																											}
																										)
																								);
																							} else {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												delete v[index]
																													.is_maamal;
																											}
																										)
																								);
																							}
																						}}
																						checked
																					/>
																				) : (
																					<Input
																						style={{
																							width: "18px",
																							height: "18px",
																						}}
																						id="Is_maamal"
																						type="checkbox"
																						onChange={(e) => {
																							if (e.target.checked == true) {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[
																													index
																												].is_maamal = true;
																											}
																										)
																								);
																							} else {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												delete v[index]
																													.is_maamal;
																											}
																										)
																								);
																							}
																						}}
																					/>
																				)}
																			</div>
																		</Row>
																		{p.hh_stands ? (
																			<>
																				<Row>
																					<Col>
																						<Button
																							style={{
																								width: "100px",
																								padding: "5px",
																								display: "flex",
																							}}
																							type="button"
																							onClick={() => {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[index].hh_stands[
																													p.hh_stands.length
																												] = {
																													id: generate(),
																													type: "hh_stand",
																												};
																											}
																										)
																								);
																							}}
																						>
																							הוסף עומד על ח"ח
																						</Button>
																					</Col>
																				</Row>
																				{p.hh_stands.map((hh_stand, i) => {
																					return (
																						<>
																							<Row>
																								<Col xs={12} md={6}>
																									<div>
																										<p
																											style={{
																												margin: "0px",
																												float: "right",
																											}}
																										>
																											<h6>מק"ט חסר</h6>
																										</p>
																										<Input
																											onChange={(e) => {
																												const missing_makat_1 =
																													e.target.value;
																												if (
																													e.target.value !=
																													"בחר"
																												)
																													setFinalSpecialKeytwo(
																														(currentSpec) =>
																															produce(
																																currentSpec,
																																(v) => {
																																	v[
																																		index
																																	].hh_stands[
																																		i
																																	].missing_makat_1 =
																																		missing_makat_1;
																																}
																															)
																													);
																											}}
																											value={
																												p.hh_stands[i]
																													.missing_makat_1
																													? p.hh_stands[i]
																															.missing_makat_1
																													: ""
																											}
																											type="string"
																											placeholder={`מק"ט חסר`}
																										></Input>
																									</div>
																								</Col>
																								<Col xs={12} md={6}>
																									<div>
																										<p
																											style={{
																												margin: "0px",
																												float: "right",
																											}}
																										>
																											<h6>כמות</h6>
																										</p>
																										<Input
																											onChange={(e) => {
																												const missing_makat_2 =
																													e.target.value;
																												if (
																													missing_makat_2 ==
																														null ||
																													!isNaN(
																														missing_makat_2
																													)
																												)
																													setFinalSpecialKeytwo(
																														(currentSpec) =>
																															produce(
																																currentSpec,
																																(v) => {
																																	v[
																																		index
																																	].hh_stands[
																																		i
																																	].missing_makat_2 =
																																		missing_makat_2;
																																}
																															)
																													);
																											}}
																											value={
																												p.hh_stands[i]
																													.missing_makat_2
																													? p.hh_stands[i]
																															.missing_makat_2
																													: ""
																											}
																											type="string"
																											placeholder={`כמות`}
																										></Input>
																									</div>
																								</Col>
																							</Row>
																							<Button
																								style={{ display: "block" }}
																								type="button"
																								onClick={() => {
																									let newArr = JSON.parse(
																										JSON.stringify(
																											finalspecialkeytwo
																										)
																									);
																									newArr[
																										index
																									].hh_stands.splice(i, 1);
																									setFinalSpecialKeytwo(newArr);
																								}}
																							>
																								<img
																									src={deletepic}
																									height="20px"
																								></img>
																							</Button>
																						</>
																					);
																				})}
																			</>
																		) : null}
																		{/* הוספת ח"ח */}
																	</>
																) : p.type == "takala_mizdamenet" ? (
																	<>
																		<Row>
																			<Col xs={12} md={2}>
																				<div>
																					<p
																						style={{
																							margin: "0px",
																							float: "right",
																						}}
																					>
																						<h6>סוג כלי</h6>
																					</p>
																					<Input
																						onChange={(e) => {
																							const value = e.target.value;
																							if (value != "undefined") {
																								if (
																									value == "Z" &&
																									cardata.kshirot == "כשיר" &&
																									cardata.zminot == "זמין"
																								) {
																									toast.error(
																										"במקרה והכלי זמין ושכיר לא ניתן להזין עליו סיבות אי זמניות"
																									);
																								} else {
																									// console.log(technologies.map(tec => tec.kshirot == "כשיר"))
																									// console.log(technologies.map(tec => tec.kshirot == "כשיר").includes(true))
																									if (
																										value == "Z" ||
																										(value == "technology" &&
																											(technologies.length > 0
																												? !technologies
																														.map(
																															(tec) =>
																																tec.kshirot ==
																																"כשיר"
																														)
																														.includes(true)
																												: technologies.length >
																												  0))
																									) {
																										setFinalSpecialKeytwo(
																											(currentSpec) =>
																												produce(
																													currentSpec,
																													(v) => {
																														v[index].errorType =
																															value;
																													}
																												)
																										);
																									} else {
																										{
																											/* text tec is kashir / not system on z */
																										}
																										if (
																											technologies
																												.map(
																													(tec) =>
																														tec.kshirot ==
																														"כשיר"
																												)
																												.includes(true)
																										) {
																											toast.error(
																												"במקרה שכל המערכות כשירות לא ניתן להזין עליהן סיבות אי זמניות"
																											);
																										} else {
																											toast.error(
																												"ל-צ' זה לא מקושרות מערכות"
																											);
																										}
																									}
																									if (value != "technology") {
																										setFinalSpecialKeytwo(
																											(currentSpec) =>
																												produce(
																													currentSpec,
																													(v) => {
																														delete v[index]
																															.systemType;
																													}
																												)
																										);
																									}
																								}
																							}
																						}}
																						value={p.errorType}
																						type="select"
																						placeholder="בחירה"
																					>
																						<option value={"undefined"}>
																							{"בחר"}
																						</option>
																						<option value={"Z"}> צ' </option>
																						<option value={"technology"}>
																							{" "}
																							מערכת{" "}
																						</option>
																					</Input>
																				</div>
																			</Col>
																			{p.errorType == "technology" ? (
																				<Col xs={12} md={2}>
																					<div>
																						<p
																							style={{
																								margin: "0px",
																								float: "right",
																							}}
																						>
																							<h6>בחר מערכת</h6>
																						</p>
																						<Input
																							onChange={(e) => {
																								const systemType =
																									e.target.value;
																								if (e.target.value != "בחר")
																									setFinalSpecialKeytwo(
																										(currentSpec) =>
																											produce(
																												currentSpec,
																												(v) => {
																													v[index].systemType =
																														systemType;
																												}
																											)
																									);
																							}}
																							value={p.systemType}
																							type="select"
																							placeholder="מערכת"
																						>
																							<option value={"בחר"}>
																								{"בחר"}
																							</option>
																							{technologies.map(
																								(technology, i) =>
																									technology.kshirot ==
																									"לא כשיר" ? (
																										<option
																											value={
																												technology.systemType
																											}
																										>
																											{technology.systemType}
																										</option>
																									) : null
																							)}
																						</Input>
																					</div>
																				</Col>
																			) : null}
																			<Col xs={12} md={4}>
																				<div>
																					<p
																						style={{
																							margin: "0px",
																							float: "right",
																						}}
																					>
																						<h6>תקלה מזדמנת</h6>
																					</p>
																					<Input
																						onChange={(e) => {
																							const takala_mizdamenet =
																								e.target.value;
																							if (e.target.value != "בחר")
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[
																													index
																												].takala_mizdamenet =
																													takala_mizdamenet;
																											}
																										)
																								);
																						}}
																						value={p.takala_mizdamenet}
																						type="select"
																						placeholder="תקלה מזדמנת"
																					>
																						<option value={"בחר"}>
																							{"בחר"}
																						</option>
																						<option value={"קלה"}>
																							{"קלה"}
																						</option>
																						<option value={"בינונית"}>
																							{"בינונית"}
																						</option>
																						<option value={"קשה"}>
																							{"קשה"}
																						</option>
																					</Input>
																				</div>
																			</Col>
																			<Col xs={12} md={4}>
																				<div>
																					<p
																						style={{
																							margin: "0px",
																							float: "right",
																						}}
																					>
																						<h6>תאריך תקלה מזמנת</h6>
																					</p>
																					<Input
																						onChange={(e) => {
																							const takala_mizdamenet_date =
																								e.target.value;
																							if (e.target.value != "בחר")
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[
																													index
																												].takala_mizdamenet_date =
																													takala_mizdamenet_date;
																											}
																										)
																								);
																						}}
																						value={p.takala_mizdamenet_date}
																						type="date"
																						placeholder="תאריך תקלה מזמנת"
																						min="1900-01-01"
																						max="2040-01-01"
																					/>
																				</div>
																			</Col>
																		</Row>
																		{/* הוספת ח"ח */}
																		<Row>
																			<div>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																						marginLeft: "5px",
																						marginRight: "15px",
																						fontWeight: "bold",
																						fontSize: "15px",
																					}}
																				>
																					<h5>האם עומד על ח"ח</h5>
																				</p>
																				{p.hh_stands ? (
																					<Input
																						style={{
																							width: "18px",
																							height: "18px",
																						}}
																						id="Is_hh_stand"
																						type="checkbox"
																						onChange={(e) => {
																							if (e.target.checked == true) {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[index].hh_stands = [
																													{
																														id: generate(),
																														type: "hh_stand",
																													},
																												];
																											}
																										)
																								);
																							} else {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												delete v[index]
																													.hh_stands;
																											}
																										)
																								);
																							}
																						}}
																						checked
																					/>
																				) : (
																					<Input
																						style={{
																							width: "18px",
																							height: "18px",
																						}}
																						id="Is_hh_stand"
																						type="checkbox"
																						onChange={(e) => {
																							if (e.target.checked == true) {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[index].hh_stands = [
																													{
																														id: generate(),
																														type: "hh_stand",
																													},
																												];
																											}
																										)
																								);
																							} else {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												delete v[index]
																													.hh_stands;
																											}
																										)
																								);
																							}
																						}}
																					/>
																				)}
																			</div>
																		</Row>
																		{p.hh_stands ? (
																			<>
																				<Row>
																					<Col>
																						<Button
																							style={{
																								width: "100px",
																								padding: "5px",
																								display: "flex",
																							}}
																							type="button"
																							onClick={() => {
																								setFinalSpecialKeytwo(
																									(currentSpec) =>
																										produce(
																											currentSpec,
																											(v) => {
																												v[index].hh_stands[
																													p.hh_stands.length
																												] = {
																													id: generate(),
																													type: "hh_stand",
																												};
																											}
																										)
																								);
																							}}
																						>
																							הוסף עומד על ח"ח
																						</Button>
																					</Col>
																				</Row>
																				{p.hh_stands.map((hh_stand, i) => {
																					return (
																						<>
																							<Row>
																								<Col xs={12} md={6}>
																									<div>
																										<p
																											style={{
																												margin: "0px",
																												float: "right",
																											}}
																										>
																											<h6>מק"ט חסר</h6>
																										</p>
																										<Input
																											onChange={(e) => {
																												const missing_makat_1 =
																													e.target.value;
																												if (
																													e.target.value !=
																													"בחר"
																												)
																													setFinalSpecialKeytwo(
																														(currentSpec) =>
																															produce(
																																currentSpec,
																																(v) => {
																																	v[
																																		index
																																	].hh_stands[
																																		i
																																	].missing_makat_1 =
																																		missing_makat_1;
																																}
																															)
																													);
																											}}
																											value={
																												p.hh_stands[i]
																													.missing_makat_1
																													? p.hh_stands[i]
																															.missing_makat_1
																													: ""
																											}
																											type="string"
																											placeholder={`מק"ט חסר`}
																										></Input>
																									</div>
																								</Col>
																								<Col xs={12} md={6}>
																									<div>
																										<p
																											style={{
																												margin: "0px",
																												float: "right",
																											}}
																										>
																											<h6>כמות</h6>
																										</p>
																										<Input
																											onChange={(e) => {
																												const missing_makat_2 =
																													e.target.value;
																												if (
																													missing_makat_2 ==
																														null ||
																													!isNaN(
																														missing_makat_2
																													)
																												)
																													setFinalSpecialKeytwo(
																														(currentSpec) =>
																															produce(
																																currentSpec,
																																(v) => {
																																	v[
																																		index
																																	].hh_stands[
																																		i
																																	].missing_makat_2 =
																																		missing_makat_2;
																																}
																															)
																													);
																											}}
																											value={
																												p.hh_stands[i]
																													.missing_makat_2
																													? p.hh_stands[i]
																															.missing_makat_2
																													: ""
																											}
																											type="string"
																											placeholder={`כמות`}
																										></Input>
																									</div>
																								</Col>
																							</Row>
																							<Button
																								style={{ display: "block" }}
																								type="button"
																								onClick={() => {
																									let newArr = JSON.parse(
																										JSON.stringify(
																											finalspecialkeytwo
																										)
																									);
																									newArr[
																										index
																									].hh_stands.splice(i, 1);
																									setFinalSpecialKeytwo(newArr);
																								}}
																							>
																								<img
																									src={deletepic}
																									height="20px"
																								></img>
																							</Button>
																						</>
																					);
																				})}
																			</>
																		) : null}
																		{/* הוספת ח"ח */}
																	</>
																) : null}

																<Button
																	type="button"
																	onClick={() => {
																		setFinalSpecialKeytwo((currentSpec) =>
																			currentSpec.filter((x) => x.id !== p.id)
																		);
																	}}
																>
																	<img src={deletepic} height="20px"></img>
																</Button>
															</div>
														);
													})
												)}
											</div>
											{/* tipuls */}

											<Row>
												<Col>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<h6>מהות התקלה</h6>
													</div>
													<Input
														placeholder="מהות התקלה"
														type="textarea"
														name="takala_info"
														value={cardata.takala_info}
														onChange={handleChange}
													/>
												</Col>
											</Row>

											<Row>
												<Col>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<h6>צפי תיקון</h6>
													</div>
													<Input
														placeholder="צפי תיקון"
														type="select"
														name="expected_repair"
														value={cardata.expected_repair}
														onChange={handleChange}
													>
														<option value={"בחר"}>{"בחר"}</option>
														<option value={"עד 6 שעות"}>{"עד 6 שעות"}</option>
														<option value={"עד 12 שעות"}>{"עד 12 שעות"}</option>
														<option value={"עד 24 שעות"}>{"עד 24 שעות"}</option>
														<option value={"עד 72 שעות"}>{"עד 72 שעות"}</option>
														<option value={"מעל 72 שעות"}>
															{"מעל 72 שעות"}
														</option>
													</Input>
												</Col>
											</Row>

											{/* <Row>
                    <Col xs={12} md={8}>
                    </Col>
                    <Col xs={12} md={4}>
                      <div>
                        <p style={{ margin: '0px', float: 'left' }}>כמות ימי אי זמינות: 5 ימים</p>
                      </div>
                    </Col>
                  </Row> */}
										</>
									) : null}

									<Row>
										<Col>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<h6>מיקום</h6>
											</div>
											<Input
												placeholder="מיקום"
												type="string"
												name="mikum"
												value={cardata.mikum}
												onChange={handleChange}
											/>
										</Col>
										<Col>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<h6>מועד כיול אחרון</h6>
											</div>
											<Input
												placeholder="מועד כיול אחרון"
												type="date"
												name="latest_recalibration_date"
												value={cardata.latest_recalibration_date}
												onChange={handleChange}
												min="1900-01-01"
												max="2040-01-01"
											/>
										</Col>
									</Row>

									{/* {(user.role == '0' || user.role == '1' || isgdodsadir == false) ? */}
									<div style={{ textAlign: "center", paddingTop: "20px" }}>
										<button className="btn" onClick={clickSubmit}>
											עדכן
										</button>
									</div>
									{/* : null} */}
								</Container>
							) : (
								<Container>
									<Row>
										<Col
											style={{
												justifyContent: "right",
												alignContent: "right",
												textAlign: "right",
											}}
										>
											<h6 style={{}}>צ'</h6>
											<Input
												placeholder="צ'"
												type="string"
												name="carnumber"
												value={cardata.carnumber}
												onChange={handleChange}
												disabled
											/>
										</Col>

										<Col
											style={{
												justifyContent: "right",
												alignContent: "right",
												textAlign: "right",
											}}
										>
											<h6 style={{}}>משפחה</h6>
											<Input
												placeholder="משפחה"
												type="string"
												name="family"
												value={cardata.family}
												onChange={handleChange}
												disabled
											/>
										</Col>
										<Col
											style={{
												justifyContent: "right",
												alignContent: "right",
												textAlign: "right",
											}}
										>
											<h6 style={{}}>סטאטוס הכלי</h6>
											<Input
												placeholder="סטאטוס הכלי"
												type="select"
												name="status"
												value={cardata.status}
												onChange={handleChange}
												disabled
											>
												<option value={"בחר"}>{"בחר"}</option>
												<option value={"פעיל"}>{"פעיל"}</option>
												<option value={"מושבת"}>{"מושבת"}</option>
												<option value={"מיועד להשבתה"}>{"מיועד להשבתה"}</option>
												{user.role == "0" ? (
													<option value={"עצור"}>{"עצור"}</option>
												) : null}
											</Input>
										</Col>
									</Row>

									<Row>
										<Col
											style={{
												justifyContent: "right",
												alignContent: "right",
												textAlign: "right",
											}}
										>
											<h6>מאגד על</h6>
											<Select
												data={magadals}
												handleChange2={handleChange2}
												name={"magadal"}
												val={cardata.magadal ? cardata.magadal : undefined}
												isDisabled={true}
											/>
										</Col>

										<Col
											style={{
												justifyContent: "right",
												alignContent: "right",
												textAlign: "right",
											}}
										>
											<h6>מאגד</h6>
											<Select
												data={magads}
												handleChange2={handleChange2}
												name={"magad"}
												val={cardata.magad ? cardata.magad : undefined}
												isDisabled={true}
											/>
										</Col>

										<Col
											style={{
												justifyContent: "right",
												alignContent: "right",
												textAlign: "right",
											}}
										>
											<h6>מקבץ</h6>
											<Select
												data={mkabazs}
												handleChange2={handleChange2}
												name={"mkabaz"}
												val={cardata.mkabaz ? cardata.mkabaz : undefined}
												isDisabled={true}
											/>
										</Col>

										<Col
											style={{
												justifyContent: "right",
												alignContent: "right",
												textAlign: "right",
											}}
										>
											<h6>מק"ט</h6>
											<Select
												data={makats}
												handleChange2={handleChange2}
												name={"makat"}
												val={cardata.makat ? cardata.makat : undefined}
												isDisabled={true}
											/>
										</Col>
									</Row>

									<Row style={{ paddingTop: "10px" }}>
										{props.unittype == "admin" ||
										props.unittype == "general" ||
										props.unittype == "notype" ? (
											<>
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>פיקוד</h6>
													<Select
														data={pikods}
														handleChange2={handleChange2}
														name={"pikod"}
														val={cardata.pikod ? cardata.pikod : undefined}
														isDisabled={true}
													/>
												</Col>
											</>
										) : null}

										{props.unittype == "admin" ||
										props.unittype == "general" ||
										props.unittype == "notype" ||
										props.unittype == "pikod" ? (
											<>
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>אוגדה</h6>
													<Select
														data={ogdas}
														handleChange2={handleChange2}
														name={"ogda"}
														val={cardata.ogda ? cardata.ogda : undefined}
														isDisabled={true}
													/>
												</Col>
											</>
										) : null}

										{props.unittype == "admin" ||
										props.unittype == "general" ||
										props.unittype == "notype" ||
										props.unittype == "pikod" ||
										props.unittype == "ogda" ? (
											<>
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>חטיבה</h6>
													<Select
														data={hativas}
														handleChange2={handleChange2}
														name={"hativa"}
														val={cardata.hativa ? cardata.hativa : undefined}
														isDisabled={true}
													/>
												</Col>
											</>
										) : null}

										{props.unittype == "admin" ||
										props.unittype == "general" ||
										props.unittype == "notype" ||
										props.unittype == "pikod" ||
										props.unittype == "ogda" ||
										props.unittype == "hativa" ? (
											<>
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>גדוד</h6>
													<Select
														data={gdods}
														handleChange2={handleChange2}
														name={"gdod"}
														val={cardata.gdod ? cardata.gdod : undefined}
														isDisabled={true}
													/>
												</Col>
											</>
										) : null}
									</Row>

									<Row>
										<Col>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<h6>פלוגה</h6>
											</div>
											<Input
												placeholder="פלוגה"
												type="string"
												name="pluga"
												value={cardata.pluga}
												onChange={handleChange}
												disabled
											/>
										</Col>
										<Col>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<h6>שבצ"ק</h6>
											</div>
											<Input
												placeholder={`שבצ"ק`}
												type="string"
												name="shabzak"
												value={cardata.shabzak}
												onChange={handleChange}
												disabled
											/>
										</Col>
										<Col>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<h6>מיקום בימ"ח</h6>
											</div>
											<Input
												placeholder={`מיקום בימ"ח`}
												type="string"
												name="mikum_bimh"
												value={cardata.mikum_bimh}
												onChange={handleChange}
												disabled
											/>
										</Col>
										<Col>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<h6>מעמד הכלי</h6>
											</div>
											<Input
												placeholder="מעמד הכלי"
												type="select"
												name="stand"
												value={cardata.stand}
												onChange={handleChange}
												disabled
											>
												<option value={"בחר"}>בחר</option>
												<option value={"סדיר"}>סדיר</option>
												<option value={"הכן"}>הכן</option>
												<option value={'הח"י'}>הח"י</option>
											</Input>
										</Col>
									</Row>

									<Row>
										<Col>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<h6>זמינות</h6>
											</div>
											<Input
												style={{ border: "2px solid" }}
												placeholder="זמינות"
												type="select"
												name="zminot"
												value={cardata.zminot}
												onChange={handleChange}
												disabled
											>
												<option value={"בחר"}>בחר</option>
												<option value={"זמין"}>זמין</option>
												<option value={"לא זמין"}>לא זמין</option>
											</Input>
										</Col>
										<Col>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<h6>כשירות למלחמה</h6>
											</div>
											<Input
												style={{ border: "2px solid" }}
												placeholder="כשירות למלחמה"
												type="select"
												name="kshirot"
												value={cardata.kshirot}
												onChange={handleChange}
												disabled
											>
												<option value={"בחר"}>בחר</option>
												<option value={"כשיר"}>כשיר</option>
												<option value={"לא כשיר"}>לא כשיר</option>
											</Input>
										</Col>
									</Row>

									{cardata.kshirot == "לא כשיר" ||
									cardata.zminot == "לא זמין" ? (
										<>
											{/* tipuls */}
											<div
												style={{
													textAlign: "right",
													paddingTop: "10px",
													fontWeight: "bold",
												}}
											>
												<h6>סיבות אי זמינות</h6>
											</div>

											<div>
												{finalspecialkeytwo.map((p, index) => {
													return (
														<div>
															{p.type == "tipul" ? (
																<>
																	<Row>
																		<Col xs={12} md={2}>
																			<div>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																					}}
																				>
																					<h6>סוג כלי</h6>
																				</p>
																				<Input
																					value={p.errorType}
																					type="select"
																					placeholder="בחירה"
																					disabled
																				>
																					<option value={"undefined"}>
																						{"בחר"}
																					</option>
																					<option value={"Z"}> צ' </option>
																					<option value={"technology"}>
																						{" "}
																						מערכת{" "}
																					</option>
																				</Input>
																			</div>
																		</Col>
																		{p.errorType == "technology" ? (
																			<Col xs={12} md={2}>
																				<div>
																					<p
																						style={{
																							margin: "0px",
																							float: "right",
																						}}
																					>
																						<h6>בחר מערכת</h6>
																					</p>
																					<Input
																						value={p.systemType}
																						type="select"
																						placeholder="מערכת"
																						disabled
																					>
																						<option value={"בחר"}>
																							{"בחר"}
																						</option>
																						{technologies.map((technology, i) =>
																							technology.kshirot ==
																							"לא כשיר" ? (
																								<option
																									value={technology.systemType}
																								>
																									{technology.systemType}
																								</option>
																							) : null
																						)}
																					</Input>
																				</div>
																			</Col>
																		) : null}
																		<Col xs={12} md={3}>
																			<div>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																					}}
																				>
																					<h6>סוג הטיפול</h6>
																				</p>
																				<Input
																					value={p.tipul}
																					type="select"
																					placeholder="סוג הטיפול"
																					disabled
																				>
																					<option value={"בחר"}>{"בחר"}</option>
																					{tipuls.map((tipul, i) =>
																						tipul ? (
																							<option value={tipul.name}>
																								{tipul.name}
																							</option>
																						) : null
																					)}
																				</Input>
																			</div>
																		</Col>
																		<Col xs={12} md={3}>
																			<div>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																					}}
																				>
																					<h6>תאריך כניסה לטיפול</h6>
																				</p>
																				<Input
																					value={p.tipul_entry_date}
																					type="date"
																					placeholder="תאריך כניסה לטיפול"
																					min="1900-01-01"
																					max="2040-01-01"
																					disabled
																				/>
																			</div>
																		</Col>
																		<Col xs={12} md={2}>
																			<div>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																					}}
																				>
																					<h6>מיקום הטיפול</h6>
																				</p>
																				<Input
																					value={p.mikum_tipul}
																					type="select"
																					placeholder="מיקום הטיפול"
																					disabled
																				>
																					<option value={"בחר"}>{"בחר"}</option>
																					<option value={"ביחידה"}>
																						{"ביחידה"}
																					</option>
																					<option value={"אגד ארצי"}>
																						{"אגד ארצי"}
																					</option>
																					<option
																						value={`מש"א`}
																					>{`מש"א`}</option>
																					<option value={"אחזקות חוץ"}>
																						{"אחזקות חוץ"}
																					</option>
																				</Input>
																			</div>
																		</Col>
																	</Row>
																	{p.hh_stands
																		? p.hh_stands.map((hh_stand, i) => {
																				return (
																					<>
																						<Row>
																							<Col xs={12} md={6}>
																								<div>
																									<p
																										style={{
																											margin: "0px",
																											float: "right",
																										}}
																									>
																										<h6>מק"ט חסר</h6>
																									</p>
																									<Input
																										value={
																											p.hh_stands[i]
																												.missing_makat_1
																												? p.hh_stands[i]
																														.missing_makat_1
																												: ""
																										}
																										type="string"
																										placeholder={`מק"ט חסר`}
																										disabled
																									></Input>
																								</div>
																							</Col>
																							<Col xs={12} md={6}>
																								<div>
																									<p
																										style={{
																											margin: "0px",
																											float: "right",
																										}}
																									>
																										<h6>כמות</h6>
																									</p>
																									<Input
																										value={
																											p.hh_stands[i]
																												.missing_makat_2
																												? p.hh_stands[i]
																														.missing_makat_2
																												: ""
																										}
																										type="string"
																										placeholder={`כמות`}
																										disabled
																									></Input>
																								</div>
																							</Col>
																						</Row>
																					</>
																				);
																		  })
																		: null}
																</>
															) : p.type == "harig_tipul" ? (
																<>
																	<Row>
																		<Col xs={12} md={2}>
																			<div>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																					}}
																				>
																					<h6>סוג כלי</h6>
																				</p>
																				<Input
																					value={p.errorType}
																					type="select"
																					placeholder="בחירה"
																					disabled
																				>
																					<option value={"undefined"}>
																						{"בחר"}
																					</option>
																					<option value={"Z"}> צ' </option>
																					<option value={"technology"}>
																						{" "}
																						מערכת{" "}
																					</option>
																				</Input>
																			</div>
																		</Col>
																		{p.errorType == "technology" ? (
																			<Col xs={12} md={2}>
																				<div>
																					<p
																						style={{
																							margin: "0px",
																							float: "right",
																						}}
																					>
																						<h6>בחר מערכת</h6>
																					</p>
																					<Input
																						value={p.systemType}
																						type="select"
																						placeholder="מערכת"
																						disabled
																					>
																						<option value={"בחר"}>
																							{"בחר"}
																						</option>
																						{technologies.map((technology, i) =>
																							technology.kshirot ==
																							"לא כשיר" ? (
																								<option
																									value={technology.systemType}
																								>
																									{technology.systemType}
																								</option>
																							) : null
																						)}
																					</Input>
																				</div>
																			</Col>
																		) : null}
																		<Col xs={12} md={4}>
																			<div>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																					}}
																				>
																					<h6>חריג טיפול</h6>
																				</p>
																				<Input
																					onChange={(e) => {
																						const harig_tipul = e.target.value;
																						if (e.target.value != "בחר")
																							setFinalSpecialKeytwo(
																								(currentSpec) =>
																									produce(currentSpec, (v) => {
																										v[index].harig_tipul =
																											harig_tipul;
																									})
																							);
																					}}
																					value={p.harig_tipul}
																					type="select"
																					placeholder="חריג טיפול"
																					disabled
																				>
																					<option value={"בחר"}>{"בחר"}</option>
																					{tipuls.map((tipul, i) =>
																						tipul ? (
																							<option value={tipul.name}>
																								{tipul.name}
																							</option>
																						) : null
																					)}
																				</Input>
																			</div>
																		</Col>
																		<Col xs={12} md={4}>
																			<div>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																					}}
																				>
																					<h6>תאריך חריגת טיפול</h6>
																				</p>
																				<Input
																					onChange={(e) => {
																						const harig_tipul_date =
																							e.target.value;
																						if (e.target.value != "בחר")
																							setFinalSpecialKeytwo(
																								(currentSpec) =>
																									produce(currentSpec, (v) => {
																										v[index].harig_tipul_date =
																											harig_tipul_date;
																									})
																							);
																					}}
																					value={p.harig_tipul_date}
																					type="date"
																					placeholder="תאריך חריגת טיפול"
																					min="1900-01-01"
																					max="2040-01-01"
																					disabled
																				/>
																			</div>
																		</Col>
																	</Row>
																	{p.hh_stands
																		? p.hh_stands.map((hh_stand, i) => {
																				return (
																					<>
																						<Row>
																							<Col xs={12} md={6}>
																								<div>
																									<p
																										style={{
																											margin: "0px",
																											float: "right",
																										}}
																									>
																										<h6>מק"ט חסר</h6>
																									</p>
																									<Input
																										value={
																											p.hh_stands[i]
																												.missing_makat_1
																												? p.hh_stands[i]
																														.missing_makat_1
																												: ""
																										}
																										type="string"
																										placeholder={`מק"ט חסר`}
																										disabled
																									></Input>
																								</div>
																							</Col>
																							<Col xs={12} md={6}>
																								<div>
																									<p
																										style={{
																											margin: "0px",
																											float: "right",
																										}}
																									>
																										<h6>כמות</h6>
																									</p>
																									<Input
																										value={
																											p.hh_stands[i]
																												.missing_makat_2
																												? p.hh_stands[i]
																														.missing_makat_2
																												: ""
																										}
																										type="string"
																										placeholder={`כמות`}
																										disabled
																									></Input>
																								</div>
																							</Col>
																						</Row>
																					</>
																				);
																		  })
																		: null}
																</>
															) : p.type == "takala_mizdamenet" ? (
																<>
																	<Row>
																		<Col xs={12} md={2}>
																			<div>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																					}}
																				>
																					<h6>סוג כלי</h6>
																				</p>
																				<Input
																					value={p.errorType}
																					type="select"
																					placeholder="בחירה"
																					disabled
																				>
																					<option value={"undefined"}>
																						{"בחר"}
																					</option>
																					<option value={"Z"}> צ' </option>
																					<option value={"technology"}>
																						{" "}
																						מערכת{" "}
																					</option>
																				</Input>
																			</div>
																		</Col>
																		{p.errorType == "technology" ? (
																			<Col xs={12} md={2}>
																				<div>
																					<p
																						style={{
																							margin: "0px",
																							float: "right",
																						}}
																					>
																						<h6>בחר מערכת</h6>
																					</p>
																					<Input
																						value={p.systemType}
																						type="select"
																						placeholder="מערכת"
																						disabled
																					>
																						<option value={"בחר"}>
																							{"בחר"}
																						</option>
																						{technologies.map((technology, i) =>
																							technology.kshirot ==
																							"לא כשיר" ? (
																								<option
																									value={technology.systemType}
																								>
																									{technology.systemType}
																								</option>
																							) : null
																						)}
																					</Input>
																				</div>
																			</Col>
																		) : null}
																		<Col xs={12} md={4}>
																			<div>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																					}}
																				>
																					<h6>תקלה מזדמנת</h6>
																				</p>
																				<Input
																					onChange={(e) => {
																						const takala_mizdamenet =
																							e.target.value;
																						if (e.target.value != "בחר")
																							setFinalSpecialKeytwo(
																								(currentSpec) =>
																									produce(currentSpec, (v) => {
																										v[index].takala_mizdamenet =
																											takala_mizdamenet;
																									})
																							);
																					}}
																					value={p.takala_mizdamenet}
																					type="select"
																					placeholder="תקלה מזדמנת"
																					disabled
																				>
																					<option value={"בחר"}>{"בחר"}</option>
																					<option value={"קלה"}>{"קלה"}</option>
																					<option value={"בינונית"}>
																						{"בינונית"}
																					</option>
																					<option value={"קשה"}>{"קשה"}</option>
																				</Input>
																			</div>
																		</Col>
																		<Col xs={12} md={4}>
																			<div>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																					}}
																				>
																					<h6>תאריך תקלה מזדמנת</h6>
																				</p>
																				<Input
																					onChange={(e) => {
																						const takala_mizdamenet_date =
																							e.target.value;
																						if (e.target.value != "בחר")
																							setFinalSpecialKeytwo(
																								(currentSpec) =>
																									produce(currentSpec, (v) => {
																										v[
																											index
																										].takala_mizdamenet_date =
																											takala_mizdamenet_date;
																									})
																							);
																					}}
																					value={p.takala_mizdamenet_date}
																					type="date"
																					placeholder="תאריך תקלה מזדמנת"
																					min="1900-01-01"
																					max="2040-01-01"
																					disabled
																				/>
																			</div>
																		</Col>
																	</Row>
																	{p.hh_stands
																		? p.hh_stands.map((hh_stand, i) => {
																				return (
																					<>
																						<Row>
																							<Col xs={12} md={6}>
																								<div>
																									<p
																										style={{
																											margin: "0px",
																											float: "right",
																										}}
																									>
																										<h6>מק"ט חסר</h6>
																									</p>
																									<Input
																										value={
																											p.hh_stands[i]
																												.missing_makat_1
																												? p.hh_stands[i]
																														.missing_makat_1
																												: ""
																										}
																										type="string"
																										placeholder={`מק"ט חסר`}
																										disabled
																									></Input>
																								</div>
																							</Col>
																							<Col xs={12} md={6}>
																								<div>
																									<p
																										style={{
																											margin: "0px",
																											float: "right",
																										}}
																									>
																										<h6>כמות</h6>
																									</p>
																									<Input
																										value={
																											p.hh_stands[i]
																												.missing_makat_2
																												? p.hh_stands[i]
																														.missing_makat_2
																												: ""
																										}
																										type="string"
																										placeholder={`כמות`}
																										disabled
																									></Input>
																								</div>
																							</Col>
																						</Row>
																					</>
																				);
																		  })
																		: null}
																</>
															) : null}
														</div>
													);
												})}
											</div>
											{/* tipuls */}

											<Row>
												<Col>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<h6>מהות התקלה</h6>
													</div>
													<Input
														placeholder="מהות התקלה"
														type="textarea"
														name="takala_info"
														value={cardata.takala_info}
														onChange={handleChange}
														disabled
													/>
												</Col>
											</Row>

											<Row>
												<Col>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<h6>צפי תיקון</h6>
													</div>
													<Input
														placeholder="צפי תיקון"
														type="select"
														name="expected_repair"
														value={cardata.expected_repair}
														onChange={handleChange}
														disabled
													>
														<option value={"בחר"}>{"בחר"}</option>
														<option value={"עד 6 שעות"}>{"עד 6 שעות"}</option>
														<option value={"עד 12 שעות"}>{"עד 12 שעות"}</option>
														<option value={"עד 24 שעות"}>{"עד 24 שעות"}</option>
														<option value={"עד 72 שעות"}>{"עד 72 שעות"}</option>
														<option value={"מעל 72 שעות"}>
															{"מעל 72 שעות"}
														</option>
													</Input>
												</Col>
											</Row>
										</>
									) : null}

									<Row>
										<Col>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<h6>מיקום</h6>
											</div>
											<Input
												placeholder="מיקום"
												type="string"
												name="mikum"
												value={cardata.mikum}
												onChange={handleChange}
												disabled
											/>
										</Col>
										<Col>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<h6>מועד כיול אחרון</h6>
											</div>
											<Input
												placeholder="מועד כיול אחרון"
												type="date"
												name="latest_recalibration_date"
												value={cardata.latest_recalibration_date}
												onChange={handleChange}
												min="1900-01-01"
												max="2040-01-01"
												disabled
											/>
										</Col>
									</Row>
								</Container>
							)}
						</CardBody>
					</Card>
				</ModalBody>
			</Modal>
		</>
	);
};
export default withRouter(CarDataFormModal);
