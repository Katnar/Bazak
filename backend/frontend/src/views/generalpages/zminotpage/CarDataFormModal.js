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
import Select from "components/general/Select/AnimatedSelect";
import deletepic from "assets/img/delete.png";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

const CarDataFormModal = (props) => {
  const { user } = isAuthenticated();
  //cardata
  const [cardata, setCarData] = useState({});
  const [finalspecialkeytwo, setFinalSpecialKeytwo] = useState([]);
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


  const loadcardata = async () => {
    await axios
      .get(`http://localhost:8000/api/cardata/${props.cardataid}`)
      .then((response) => {
        let tempcardata = response.data[0];
        if (tempcardata.latest_recalibration_date)
          tempcardata.latest_recalibration_date =
            tempcardata.latest_recalibration_date.slice(0, 10);
        setCarData(tempcardata);
        setFinalSpecialKeytwo(tempcardata.tipuls);
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
      if(evt.target.name == "expected_repair"){
        if(value == "מעל 72 שעות"){
          setCarData({ ...cardata, ["zminot"]: "לא זמין", ["kshirot"]: "לא כשיר", [evt.target.name]: value });
          toast.info("שים לב, צפי תיקון עודכן למעל 72 שעות, זמינות וכשירות הכלי עודכנו ללא זמין ולא כשיר");
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
        if(cardata.magadal == 'magadal04'){//change to the magadal of technologies in the database in army
          isTechnology = true;
        }
        if(isTechnology == false){
          for(var i=0;i<cardata.carnumber.length;i++){
            if(cardata.carnumber[i]=='-'){
                ErrorReason += ", מספר צ' לא יכול להכיל את התו -"
              flag = false;
            }
          }
        }else{
          if(makats.some(makat => cardata.carnumber.includes(makat._id.replace(/0/g, ''))) == false){
            for(var i=0;i<cardata.carnumber.length;i++){
              if(cardata.carnumber[i]=='-'){
                ErrorReason += ", מספר צ' לא יכול להכיל את התו -"
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

    if(cardata.expected_repair == 'מעל 72 שעות' && (cardata.zminot == "זמין" || cardata.kshirot == "כשיר")){
      ErrorReason += ",שים לב, צפי תיקון עודכן למעל 72 שעות, זמינות וכשירות הכלי עודכנו ללא זמין ולא כשיר";
      flag = false;
    }

    if (cardata.zminot == "לא זמין" || cardata.kshirot == "לא כשיר") {
      if (finalspecialkeytwo.length == 0) {
        ErrorReason += ",חובה להזין את סיבת אי-הזמינות/אי-הכשירות";
        flag = false;
      }

      for (let i = 0; i < finalspecialkeytwo.length; i++) {
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
        if(finalspecialkeytwo[i].hh_stands){
          for(let j=0; j < finalspecialkeytwo[i].hh_stands.length; j++){
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

    if (flag == true) {
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
        if(tempcardata.magadal == 'magadal04'){//change to the magadal of technologies in the database in army
          isTechnology = true;
        }
        if(isTechnology == true){
          newMakat = tempcardata.makat.replace(/0/g, '');
          tempcardata.carnumber = newMakat+"-"+tempcardata.carnumber;
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
        let gdod_result = await axios.get(`http://localhost:8000/api/gdod/${response.data[0].gdod}`);
        let hativa_result = await axios.get(`http://localhost:8000/api/hativa/${response.data[0].hativa}`);
        let ogda_result = await axios.get(`http://localhost:8000/api/ogda/${response.data[0].ogda}`);
        let pikod_result = await axios.get(`http://localhost:8000/api/pikod/${response.data[0].pikod}`);
        cardata_unitstr = pikod_result.data.name + "/" + ogda_result.data.name + "/" + hativa_result.data.name + "/" + gdod_result.data.name;
        toast.error(`צ' כבר שייך ליחידה - ${cardata_unitstr} לא ניתן לשנות יחידה`);
      }
    } else {
      //create cardata
      let tempcardata = { ...cardata };
      tempcardata.updatedBy = user.personalnumber;
      delete tempcardata._id;
      if (tempcardata.zminot == "זמין" && tempcardata.kshirot == "כשיר") {
        tempcardata.tipuls = [];
        delete tempcardata.takala_info;
        delete tempcardata.expected_repair;
      } else {
        tempcardata.tipuls = finalspecialkeytwo;
      }

      var isTechnology = false;
      var newMakat;
      if(tempcardata.magadal == 'magadal04'){//change to the magadal of technologies in the database in army
        isTechnology = true;
      }
      if(isTechnology == true){
        newMakat = tempcardata.makat.replace(/0/g, '');
        tempcardata.carnumber = newMakat+"-"+tempcardata.carnumber;
      }

      let result = await axios.post(
        `http://localhost:8000/api/cardata`,
        tempcardata
      );
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
      if (tempcardata.zminot == "זמין" && tempcardata.kshirot == "כשיר") {
        tempcardata.tipuls = [];
        tempcardata.takala_info = "";
        tempcardata.expected_repair = "";
      } else {
        tempcardata.tipuls = finalspecialkeytwo;
      }
        var isTechnology = false;
        var newMakat;
        if(tempcardata.magadal == 'magadal04'){//change im army
          isTechnology = true;
        }
        if(isTechnology == true){
          newMakat = tempcardata.makat.replace(/0/g, '');
          tempcardata.carnumber=tempcardata.carnumber.split('-');
          tempcardata.carnumber = newMakat+"-"+tempcardata.carnumber[1];
        }
      tempcardata.updatedBy = user.personalnumber;
      let result = await axios.put(
        `http://localhost:8000/api/cardata/${tempcardataid}`,
        tempcardata
      );
      //create archivecardata
      delete tempcardata._id;
      let result2 = axios.post(
        `http://localhost:8000/api/archivecardata`,
        tempcardata
      );
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
    if (props.isOpen == true){
      init();
    }
    else {
      setCarData({});
      setFinalSpecialKeytwo([]);
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
                {(!(cardata.magad) && (props.cardataid == undefined || cardata.magadal != 'magadal04')) ?//change to the magadal of technologies in the database in army
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מאגד על</h6>
                    <Select data={props.cardataid != undefined ? magadals.filter((magadal) => magadal.name != 'טכנולוגיות'): magadals} handleChange2={handleChange2} name={'magadal'} val={cardata.magadal ? cardata.magadal : undefined} />
                  </Col>
                  :
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מאגד על</h6>
                    <Select data={magadals} handleChange2={handleChange2} name={'magadal'} val={cardata.magadal ? cardata.magadal : undefined} isDisabled={true} />
                  </Col>}

                {((cardata.magadal) && !(cardata.mkabaz)) ?
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מאגד</h6>
                    <Select data={magads} handleChange2={handleChange2} name={'magad'} val={cardata.magad ? cardata.magad : undefined} />
                  </Col> :
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מאגד</h6>
                    <Select data={magads} handleChange2={handleChange2} name={'magad'} val={cardata.magad ? cardata.magad : undefined} isDisabled={true} />
                  </Col>}

                {((cardata.magad) && !(cardata.makat)) ?
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מקבץ</h6>
                    <Select data={mkabazs} handleChange2={handleChange2} name={'mkabaz'} val={cardata.mkabaz ? cardata.mkabaz : undefined} />
                  </Col> :
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מקבץ</h6>
                    <Select data={mkabazs} handleChange2={handleChange2} name={'mkabaz'} val={cardata.mkabaz ? cardata.mkabaz : undefined} isDisabled={true} />
                  </Col>}

                {((cardata.mkabaz)) ?
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מק"ט</h6>
                    <Select data={makats} handleChange2={handleChange2} name={'makat'} val={cardata.makat ? cardata.makat : undefined} />
                  </Col> :
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מק"ט</h6>
                    <Select data={makats} handleChange2={handleChange2} name={'makat'} val={cardata.makat ? cardata.makat : undefined} isDisabled={true} />
                  </Col>}

                {((cardata.makat)) ?
                  <Col style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    {makats.map((makat, index) => (makat._id == cardata.makat ? makat.description : null))}
                  </Col> :
                  <Col style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                  </Col>}
                </Row>

                <Row style={{ paddingTop: "10px" }}>
                  {props.unittype == "admin"|| props.unittype == "general" || props.unittype == "notype" ? (
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

                  {props.unittype == "admin"|| props.unittype == "general" ||
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

                  {props.unittype == "admin"|| props.unittype == "general" ||
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

                  {props.unittype == "admin"|| props.unittype == "general" ||
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

                <Row>
                  <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}><h6>זמינות</h6></div>
                  <Input style={{ border: '2px solid' }} placeholder="זמינות" type="select" name="zminot" value={cardata.zminot} onChange={handleChange}>
                    <option value={'בחר'}>בחר</option>
                    <option value={'זמין'}>זמין</option>
                    <option value={'לא זמין'}>לא זמין</option>
                  </Input>
                  </Col>
                  <Col>
                    <div style={{ textAlign: 'right', paddingTop: '10px' }}><h6>כשירות למלחמה</h6></div>
                    <Input style={{ border: '2px solid' }} placeholder="כשירות למלחמה" type="select" name="kshirot" value={cardata.kshirot} onChange={handleChange}>
                      <option value={'בחר'}>בחר</option>
                      <option value={'כשיר'}>כשיר</option>
                      <option value={'לא כשיר'}>לא כשיר</option>
                    </Input>
                  </Col>
                </Row>

                {cardata.kshirot == "לא כשיר" || cardata.zminot == "לא זמין" ? (
                  <>
                    {/* tipuls */}
                    <div style={{ textAlign: 'right', paddingTop: '10px', fontWeight: "bold" }}><h6>סיבות אי זמינות</h6></div>

                    <div>
                      {finalspecialkeytwo.length == 0 ? (
                        <Row>
                          <Col style={{ display: 'flex', justifyContent: 'center' }}>
                           <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "tipul" }]) }}>הוסף טיפול</Button>
                          </Col>
                          <Col style={{ display: 'flex', justifyContent: 'center' }}>
                           <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "harig_tipul" }]) }}>הוסף חריגת טיפול</Button>
                          </Col>
                          <Col style={{ display: 'flex', justifyContent: 'center' }}>
                           <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "takala_mizdamenet" }]) }}>הוסף תקלה מזדמנת</Button>
                          </Col>
                        </Row>
                      ) : (
                        finalspecialkeytwo.map((p, index) => {
                          return (
                            <div>
                              {index == 0 ? (
                                <Row>
                                 <Col style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "tipul" }]) }}>הוסף טיפול</Button>
                                 </Col>
                                 <Col style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "harig_tipul" }]) }}>הוסף חריגת טיפול</Button>
                                 </Col>
                                 <Col style={{ display: 'flex', justifyContent: 'center' }}>
                                  <Button style={{ width: '100px', padding: '5px' }} type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => [...currentSpec, { id: generate(), type: "takala_mizdamenet" }]) }}>הוסף תקלה מזדמנת</Button>
                                 </Col>
                                </Row>
                              ) : null}

                              {p.type == "tipul" ? (
                                <>
                                  <Row>
                                    <Col xs={12} md={4}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}><h6>סוג הטיפול</h6></p>
                                      <Input onChange={(e) => {
                                        const tipul = e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].tipul = tipul }))
                                        }}
                                          value={p.tipul} type="select" placeholder="סוג הטיפול">
                                          <option value={"בחר"}>{"בחר"}</option>
                                          {tipuls.map((tipul, i) => (
                                            tipul ?
                                               <option value={tipul.name}>{tipul.name}</option>
                                              : null))}
                                      </Input>
                                    </div>
                                    </Col>
                                    <Col xs={12} md={4}>
                                     <div>
                                      <p style={{ margin: '0px', float: 'right' }}><h6>תאריך כניסה לטיפול</h6></p>
                                      <Input onChange={(e) => {
                                        const tipul_entry_date = e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].tipul_entry_date = tipul_entry_date }))
                                      }}
                                        value={p.tipul_entry_date} type="date" placeholder="תאריך כניסה לטיפול" min="1900-01-01" max="2040-01-01" />
                                     </div>
                                    </Col> 
                                    <Col xs={12} md={4}>
                                     <div>
                                      <p style={{ margin: '0px', float: 'right' }}><h6>מיקום הטיפול</h6></p>
                                      <Input onChange={(e) => {
                                        const mikum_tipul = e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].mikum_tipul = mikum_tipul }))
                                      }}
                                        value={p.mikum_tipul} type="select" placeholder="מיקום הטיפול">
                                        <option value={"בחר"}>{"בחר"}</option>
                                        <option value={"ביחידה"}>{"ביחידה"}</option>
                                        <option value={"אגד ארצי"}>{"אגד ארצי"}</option>
                                        <option value={`מש"א`}>{`מש"א`}</option>
                                        <option value={"אחזקות חוץ"}>{"אחזקות חוץ"}</option>
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
                                          fontWeight:'bold',
                                          fontSize:'15px',
                                        }}
                                      >
                                       <h5>האם עומד על ח"ח</h5>
                                      </p>
                                      {p.hh_stands?
                                      <Input
                                        style={{width:"18px", height:"18px"}}
                                        id="Is_hh_stand"
                                        type="checkbox"
                                        onChange={(e) => {
                                          if (e.target.checked == true) {
                                            setFinalSpecialKeytwo(
                                              (currentSpec) =>
                                                produce(currentSpec, (v) => {
                                                  v[index].hh_stands = [
                                                    {
                                                      id: generate(),
                                                      type: "hh_stand",
                                                    },
                                                  ];
                                                })
                                            );
                                          } else {
                                            setFinalSpecialKeytwo(
                                              (currentSpec) =>
                                                produce(currentSpec, (v) => {
                                                  delete v[index].hh_stands;
                                                })
                                            );
                                          }
                                        }}checked/>
                                      :
                                      <Input
                                        style={{width:"18px", height:"18px"}}
                                        id="Is_hh_stand"
                                        type="checkbox"
                                        onChange={(e) => {
                                          if (e.target.checked == true) {
                                            setFinalSpecialKeytwo(
                                              (currentSpec) =>
                                                produce(currentSpec, (v) => {
                                                  v[index].hh_stands = [
                                                    {
                                                      id: generate(),
                                                      type: "hh_stand",
                                                    },
                                                  ];
                                                })
                                            );
                                          } else {
                                            setFinalSpecialKeytwo(
                                              (currentSpec) =>
                                                produce(currentSpec, (v) => {
                                                  delete v[index].hh_stands;
                                                })
                                            );
                                          }
                                        }}/>
                                      }
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
                                              display:'flex',
                                            }}
                                            type="button"
                                            onClick={() => {
                                              setFinalSpecialKeytwo(
                                                (currentSpec) =>
                                                  produce(currentSpec, (v) => {
                                                    v[index].hh_stands[
                                                      p.hh_stands.length
                                                    ] = {
                                                      id: generate(),
                                                      type: "hh_stand",
                                                    };
                                                  })
                                              );
                                            }}
                                          >
                                            הוסף עומד על ח"ח
                                          </Button>
                                        </Col>
                                      </Row>
                                      {p.hh_stands.map((hh_stand,i) => {
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
                                                        e.target.value != "בחר"
                                                      )
                                                        setFinalSpecialKeytwo(
                                                          (currentSpec) =>
                                                            produce(
                                                              currentSpec,
                                                              (v) => {
                                                                v[index].hh_stands[i].missing_makat_1 = missing_makat_1;
                                                              }
                                                            )
                                                        );
                                                    }}
                                                    value={p.hh_stands[i].missing_makat_1?p.hh_stands[i].missing_makat_1:""}
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
                                                        e.target.value != "בחר"
                                                      )
                                                        setFinalSpecialKeytwo(
                                                          (currentSpec) =>
                                                            produce(
                                                              currentSpec,
                                                              (v) => {
                                                                v[
                                                                  index
                                                                ].hh_stands[i].missing_makat_2 =
                                                                  missing_makat_2;
                                                              }
                                                            )
                                                        );
                                                    }}
                                                    value={p.hh_stands[i].missing_makat_2?p.hh_stands[i].missing_makat_2:""}
                                                    type="string"
                                                    placeholder={`כמות`}
                                                  ></Input>
                                                </div>
                                              </Col>
                                            </Row>
                                            <Button
                                            style={{display:'block'}}
                                              type="button"
                                              onClick={() => {
                                                let newArr = JSON.parse(JSON.stringify(finalspecialkeytwo))
                                                newArr[index].hh_stands.splice(i,1);
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
                                  <Col xs={12} md={4}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}><h6>חריג טיפול</h6></p>
                                      <Input onChange={(e) => {
                                        const harig_tipul = e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].harig_tipul = harig_tipul }))
                                      }}
                                        value={p.harig_tipul} type="select" placeholder="חריג טיפול">
                                        <option value={"בחר"}>{"בחר"}</option>
                                          {tipuls.map((tipul, i) => (
                                            tipul ?
                                               <option value={tipul.name}>{tipul.name}</option>
                                              : null))}
                                      </Input>
                                    </div>
                                  </Col>
                                  <Col xs={12} md={4}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}><h6>תאריך חריגת טיפול</h6></p>
                                      <Input onChange={(e) => {
                                        const harig_tipul_date = e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].harig_tipul_date = harig_tipul_date }))
                                      }}
                                        value={p.harig_tipul_date} type="date" placeholder="תאריך חריגת טיפול" min="1900-01-01" max="2040-01-01"/>
                                    </div>
                                  </Col>
                                </Row>
                                {/* הוספת ח"ח ומעמל */}
                                <Row>
                                    <div style={{paddingLeft:'10px'}}>
                                      <p
                                        style={{
                                          margin: "0px",
                                          float: "right",
                                          marginLeft: "5px",
                                          marginRight: "15px",
                                          fontWeight:'bold',
                                          fontSize:'15px',
                                        }}
                                      >
                                        <h5>האם עומד על ח"ח</h5>
                                      </p>
                                      {p.hh_stands?
                                      <Input
                                        style={{width:"18px", height:"18px"}}
                                        id="Is_hh_stand"
                                        type="checkbox"
                                        onChange={(e) => {
                                          if (e.target.checked == true) {
                                            setFinalSpecialKeytwo(
                                              (currentSpec) =>
                                                produce(currentSpec, (v) => {
                                                  v[index].hh_stands = [
                                                    {
                                                      id: generate(),
                                                      type: "hh_stand",
                                                    },
                                                  ];
                                                })
                                            );
                                          } else {
                                            setFinalSpecialKeytwo(
                                              (currentSpec) =>
                                                produce(currentSpec, (v) => {
                                                  delete v[index].hh_stands;
                                                })
                                            );
                                          }
                                        }}checked/>
                                      :
                                      <Input
                                        style={{width:"18px", height:"18px"}}
                                        id="Is_hh_stand"
                                        type="checkbox"
                                        onChange={(e) => {
                                          if (e.target.checked == true) {
                                            setFinalSpecialKeytwo(
                                              (currentSpec) =>
                                                produce(currentSpec, (v) => {
                                                  v[index].hh_stands = [
                                                    {
                                                      id: generate(),
                                                      type: "hh_stand",
                                                    },
                                                  ];
                                                })
                                            );
                                          } else {
                                            setFinalSpecialKeytwo(
                                              (currentSpec) =>
                                                produce(currentSpec, (v) => {
                                                  delete v[index].hh_stands;
                                                })
                                            );
                                          }
                                        }}/>
                                      }
                                      </div>
                                      <div>
                                      <p
                                        style={{
                                          margin: "0px",
                                          float: "right",
                                          marginLeft: "5px",
                                          marginRight: "15px",
                                          fontWeight:'bold',
                                          fontSize:'15px',
                                        }}
                                      >
                                        <h5>האם בוצע טיפול מעמ”ל</h5>
                                      </p>
                                      {p.is_maamal?
                                       <Input
                                       style={{width:"18px", height:"18px"}}
                                       id="Is_maamal"
                                       type="checkbox"
                                       onChange={(e) => {
                                         if (e.target.checked == true) {
                                           setFinalSpecialKeytwo(
                                             (currentSpec) =>
                                               produce(currentSpec, (v) => {
                                                 v[index].is_maamal = true;
                                               })
                                           );
                                         } else {
                                           setFinalSpecialKeytwo(
                                             (currentSpec) =>
                                               produce(currentSpec, (v) => {
                                                 delete v[index].is_maamal;
                                               })
                                           );
                                         }
                                       }} checked/>
                                      :
                                      <Input
                                        style={{width:"18px", height:"18px"}}
                                        id="Is_maamal"
                                        type="checkbox"
                                        onChange={(e) => {
                                          if (e.target.checked == true) {
                                            setFinalSpecialKeytwo(
                                              (currentSpec) =>
                                                produce(currentSpec, (v) => {
                                                  v[index].is_maamal = true;
                                                })
                                            );
                                          } else {
                                            setFinalSpecialKeytwo(
                                              (currentSpec) =>
                                                produce(currentSpec, (v) => {
                                                  delete v[index].is_maamal;
                                                })
                                            );
                                          }
                                        }}/>
                                      }
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
                                              display:'flex',
                                            }}
                                            type="button"
                                            onClick={() => {
                                              setFinalSpecialKeytwo(
                                                (currentSpec) =>
                                                  produce(currentSpec, (v) => {
                                                    v[index].hh_stands[
                                                      p.hh_stands.length
                                                    ] = {
                                                      id: generate(),
                                                      type: "hh_stand",
                                                    };
                                                  })
                                              );
                                            }}
                                          >
                                            הוסף עומד על ח"ח
                                          </Button>
                                        </Col>
                                      </Row>
                                      {p.hh_stands.map((hh_stand,i) => {
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
                                                        e.target.value != "בחר"
                                                      )
                                                        setFinalSpecialKeytwo(
                                                          (currentSpec) =>
                                                            produce(
                                                              currentSpec,
                                                              (v) => {
                                                                v[index].hh_stands[i].missing_makat_1 = missing_makat_1;
                                                              }
                                                            )
                                                        );
                                                    }}
                                                    value={p.hh_stands[i].missing_makat_1?p.hh_stands[i].missing_makat_1:""}
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
                                                        e.target.value != "בחר"
                                                      )
                                                        setFinalSpecialKeytwo(
                                                          (currentSpec) =>
                                                            produce(
                                                              currentSpec,
                                                              (v) => {
                                                                v[
                                                                  index
                                                                ].hh_stands[i].missing_makat_2 =
                                                                  missing_makat_2;
                                                              }
                                                            )
                                                        );
                                                    }}
                                                    value={p.hh_stands[i].missing_makat_2?p.hh_stands[i].missing_makat_2:""}
                                                    type="string"
                                                    placeholder={`כמות`}
                                                  ></Input>
                                                </div>
                                              </Col>
                                            </Row>
                                            <Button
                                            style={{display:'block'}}
                                              type="button"
                                              onClick={() => {
                                                let newArr = JSON.parse(JSON.stringify(finalspecialkeytwo))
                                                newArr[index].hh_stands.splice(i,1);
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
                                  <Col xs={12} md={4}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}><h6>תקלה מזדמנת</h6></p>
                                      <Input onChange={(e) => {
                                        const takala_mizdamenet = e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].takala_mizdamenet = takala_mizdamenet }))
                                      }}
                                        value={p.takala_mizdamenet} type="select" placeholder="תקלה מזדמנת">
                                        <option value={"בחר"}>{"בחר"}</option>
                                        <option value={'קלה'}>{'קלה'}</option>
                                        <option value={'בינונית'}>{'בינונית'}</option>
                                        <option value={'קשה'}>{'קשה'}</option>
                                      </Input>
                                    </div>
                                  </Col>
                                  <Col xs={12} md={4}>
                                    <div>
                                      <p style={{ margin: '0px', float: 'right' }}><h6>תאריך תקלה מזמנת</h6></p>
                                      <Input onChange={(e) => {
                                        const takala_mizdamenet_date = e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].takala_mizdamenet_date = takala_mizdamenet_date }))
                                      }}
                                        value={p.takala_mizdamenet_date} type="date" placeholder="תאריך תקלה מזמנת" min="1900-01-01" max="2040-01-01"/>
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
                                          fontWeight:'bold',
                                          fontSize:'15px',
                                        }}
                                      >
                                        <h5>האם עומד על ח"ח</h5>
                                      </p>
                                      {p.hh_stands?
                                      <Input
                                        style={{width:"18px", height:"18px"}}
                                        id="Is_hh_stand"
                                        type="checkbox"
                                        onChange={(e) => {
                                          if (e.target.checked == true) {
                                            setFinalSpecialKeytwo(
                                              (currentSpec) =>
                                                produce(currentSpec, (v) => {
                                                  v[index].hh_stands = [
                                                    {
                                                      id: generate(),
                                                      type: "hh_stand",
                                                    },
                                                  ];
                                                })
                                            );
                                          } else {
                                            setFinalSpecialKeytwo(
                                              (currentSpec) =>
                                                produce(currentSpec, (v) => {
                                                  delete v[index].hh_stands;
                                                })
                                            );
                                          }
                                        }}checked/>
                                      :
                                      <Input
                                        style={{width:"18px", height:"18px"}}
                                        id="Is_hh_stand"
                                        type="checkbox"
                                        onChange={(e) => {
                                          if (e.target.checked == true) {
                                            setFinalSpecialKeytwo(
                                              (currentSpec) =>
                                                produce(currentSpec, (v) => {
                                                  v[index].hh_stands = [
                                                    {
                                                      id: generate(),
                                                      type: "hh_stand",
                                                    },
                                                  ];
                                                })
                                            );
                                          } else {
                                            setFinalSpecialKeytwo(
                                              (currentSpec) =>
                                                produce(currentSpec, (v) => {
                                                  delete v[index].hh_stands;
                                                })
                                            );
                                          }
                                        }}/>
                                      }
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
                                              display:'flex',
                                            }}
                                            type="button"
                                            onClick={() => {
                                              setFinalSpecialKeytwo(
                                                (currentSpec) =>
                                                  produce(currentSpec, (v) => {
                                                    v[index].hh_stands[
                                                      p.hh_stands.length
                                                    ] = {
                                                      id: generate(),
                                                      type: "hh_stand",
                                                    };
                                                  })
                                              );
                                            }}
                                          >
                                            הוסף עומד על ח"ח
                                          </Button>
                                        </Col>
                                      </Row>
                                      {p.hh_stands.map((hh_stand,i) => {
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
                                                        e.target.value != "בחר"
                                                      )
                                                        setFinalSpecialKeytwo(
                                                          (currentSpec) =>
                                                            produce(
                                                              currentSpec,
                                                              (v) => {
                                                                v[index].hh_stands[i].missing_makat_1 = missing_makat_1;
                                                              }
                                                            )
                                                        );
                                                    }}
                                                    value={p.hh_stands[i].missing_makat_1?p.hh_stands[i].missing_makat_1:""}
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
                                                        e.target.value != "בחר"
                                                      )
                                                        setFinalSpecialKeytwo(
                                                          (currentSpec) =>
                                                            produce(
                                                              currentSpec,
                                                              (v) => {
                                                                v[
                                                                  index
                                                                ].hh_stands[i].missing_makat_2 =
                                                                  missing_makat_2;
                                                              }
                                                            )
                                                        );
                                                    }}
                                                    value={p.hh_stands[i].missing_makat_2?p.hh_stands[i].missing_makat_2:""}
                                                    type="string"
                                                    placeholder={`כמות`}
                                                  ></Input>
                                                </div>
                                              </Col>
                                            </Row>
                                            <Button
                                            style={{display:'block'}}
                                              type="button"
                                              onClick={() => {
                                                let newArr = JSON.parse(JSON.stringify(finalspecialkeytwo))
                                                newArr[index].hh_stands.splice(i,1);
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
                              ):null}

                              <Button type="button" onClick={() => { setFinalSpecialKeytwo(currentSpec => currentSpec.filter(x => x.id !== p.id)) }}><img src={deletepic} height='20px'></img></Button>
                            </div>
                          );
                        })
                      )}
                    </div>
                    {/* tipuls */}

                    <Row>
                      <Col>
                        <div style={{ textAlign: 'right', paddingTop: '10px' }}><h6>מהות התקלה</h6></div>
                        <Input placeholder="מהות התקלה" type="textarea" name="takala_info" value={cardata.takala_info} onChange={handleChange} />
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <div style={{ textAlign: 'right', paddingTop: '10px' }}><h6>צפי תיקון</h6></div>
                        <Input placeholder="צפי תיקון" type="select" name="expected_repair" value={cardata.expected_repair} onChange={handleChange}>
                          <option value={"בחר"}>{"בחר"}</option>
                          <option value={"עד 6 שעות"}>{"עד 6 שעות"}</option>
                          <option value={"עד 12 שעות"}>{"עד 12 שעות"}</option>
                          <option value={"עד 24 שעות"}>{"עד 24 שעות"}</option>
                          <option value={"עד 72 שעות"}>{"עד 72 שעות"}</option>
                          <option value={"מעל 72 שעות"}>{"מעל 72 שעות"}</option>
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
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}><h6>מיקום</h6></div>
                  <Input placeholder="מיקום" type="string" name="mikum" value={cardata.mikum} onChange={handleChange} />
                </Col>
                <Col>
                  <div style={{ textAlign: 'right', paddingTop: '10px' }}><h6>מועד כיול אחרון</h6></div>
                  <Input placeholder="מועד כיול אחרון" type="date" name="latest_recalibration_date" value={cardata.latest_recalibration_date} onChange={handleChange} min="1900-01-01" max="2040-01-01"/>
                </Col>
              </Row>

              {/* {(user.role == '0' || user.role == '1' || isgdodsadir == false) ? */}
                <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                  <button className="btn" onClick={clickSubmit}>עדכן</button>
                </div>
              {/* : null} */}
              </Container>
            ) : (
              <Container>
                <Row>
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6 style={{}}>צ'</h6>
                    <Input placeholder="צ'" type="string" name="carnumber" value={cardata.carnumber} onChange={handleChange} disabled />
                  </Col>

                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6 style={{}}>משפחה</h6>
                    <Input placeholder="משפחה" type="string" name="family" value={cardata.family} onChange={handleChange} disabled/>
                  </Col>
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6 style={{}}>סטאטוס הכלי</h6>
                    <Input placeholder="סטאטוס הכלי" type="select" name="status" value={cardata.status} onChange={handleChange} disabled>
                      <option value={"בחר"}>{"בחר"}</option>
                      <option value={"פעיל"}>{"פעיל"}</option>
                      <option value={"מושבת"}>{"מושבת"}</option>
                      <option value={"מיועד להשבתה"}>{"מיועד להשבתה"}</option>
                      {user.role == '0' ? <option value={"עצור"}>{"עצור"}</option> : null}
                    </Input>
                  </Col>
                </Row>

                <Row>
                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מאגד על</h6>
                    <Select data={magadals} handleChange2={handleChange2} name={'magadal'} val={cardata.magadal ? cardata.magadal : undefined} isDisabled={true} />
                  </Col>

                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מאגד</h6>
                    <Select data={magads} handleChange2={handleChange2} name={'magad'} val={cardata.magad ? cardata.magad : undefined} isDisabled={true} />
                  </Col>

                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מקבץ</h6>
                    <Select data={mkabazs} handleChange2={handleChange2} name={'mkabaz'} val={cardata.mkabaz ? cardata.mkabaz : undefined} isDisabled={true} />
                  </Col>

                  <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                    <h6>מק"ט</h6>
                    <Select data={makats} handleChange2={handleChange2} name={'makat'} val={cardata.makat ? cardata.makat : undefined} isDisabled={true} />
                  </Col>
                </Row>

                <Row style={{ paddingTop: "10px" }}>
                  {props.unittype == "admin"|| props.unittype == "general" || props.unittype == "notype" ? (
                    <>
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>פיקוד</h6>
                        <Select data={pikods} handleChange2={handleChange2} name={'pikod'} val={cardata.pikod ? cardata.pikod : undefined} isDisabled={true} />
                      </Col>
                    </>
                  ) : null}

                  {props.unittype == "admin"|| props.unittype == "general" || props.unittype == "notype" || props.unittype == "pikod" ? (
                    <>
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>אוגדה</h6>
                        <Select data={ogdas} handleChange2={handleChange2} name={'ogda'} val={cardata.ogda ? cardata.ogda : undefined} isDisabled={true} />
                      </Col>
                    </>
                  ) : null}

                  {props.unittype == "admin"|| props.unittype == "general" || props.unittype == "notype" || props.unittype == "pikod" || props.unittype == "ogda" ? (
                    <>
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>חטיבה</h6>
                        <Select data={hativas} handleChange2={handleChange2} name={'hativa'} val={cardata.hativa ? cardata.hativa : undefined} isDisabled={true} />
                      </Col>
                    </>
                  ) : null}

                  {props.unittype == "admin"|| props.unittype == "general" || props.unittype == "notype" || props.unittype == "pikod" || props.unittype == "ogda" || props.unittype == "hativa" ? (
                    <>
                      <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                        <h6>גדוד</h6>
                        <Select data={gdods} handleChange2={handleChange2} name={'gdod'} val={cardata.gdod ? cardata.gdod : undefined} isDisabled={true} />
                      </Col>
                    </>
                  ) : null}
                </Row>

                <Row>
                  <Col>
                    <div style={{ textAlign: 'right', paddingTop: '10px' }}><h6>פלוגה</h6></div>
                    <Input placeholder="פלוגה" type="string" name="pluga" value={cardata.pluga} onChange={handleChange} disabled/>
                  </Col>
                  <Col>
                    <div style={{ textAlign: 'right', paddingTop: '10px' }}><h6>שבצ"ק</h6></div>
                    <Input placeholder={`שבצ"ק`} type="string" name="shabzak" value={cardata.shabzak} onChange={handleChange} disabled/>
                  </Col>
                  <Col>
                    <div style={{ textAlign: 'right', paddingTop: '10px' }}><h6>מיקום בימ"ח</h6></div>
                    <Input placeholder={`מיקום בימ"ח`} type="string" name="mikum_bimh" value={cardata.mikum_bimh} onChange={handleChange} disabled/>
                  </Col>
                  <Col>
                    <div style={{ textAlign: 'right', paddingTop: '10px' }}><h6>מעמד הכלי</h6></div>
                    <Input placeholder="מעמד הכלי" type="select" name="stand" value={cardata.stand} onChange={handleChange} disabled>
                      <option value={'בחר'}>בחר</option>
                      <option value={'סדיר'}>סדיר</option>
                      <option value={'הכן'}>הכן</option>
                      <option value={'הח"י'}>הח"י</option>
                    </Input>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <div style={{ textAlign: 'right', paddingTop: '10px' }}><h6>זמינות</h6></div>
                    <Input style={{ border: '2px solid' }} placeholder="זמינות" type="select" name="zminot" value={cardata.zminot} onChange={handleChange} disabled>
                      <option value={'בחר'}>בחר</option>
                      <option value={'זמין'}>זמין</option>
                      <option value={'לא זמין'}>לא זמין</option>
                    </Input>
                  </Col>
                  <Col>
                    <div style={{ textAlign: 'right', paddingTop: '10px' }}><h6>כשירות למלחמה</h6></div>
                    <Input style={{ border: '2px solid' }} placeholder="כשירות למלחמה" type="select" name="kshirot" value={cardata.kshirot} onChange={handleChange} disabled>
                      <option value={'בחר'}>בחר</option>
                      <option value={'כשיר'}>כשיר</option>
                      <option value={'לא כשיר'}>לא כשיר</option>
                    </Input>
                  </Col>
                </Row>

                {cardata.kshirot == "לא כשיר" || cardata.zminot == "לא זמין" ? (
                  <>
                    {/* tipuls */}
                    <div style={{ textAlign: 'right', paddingTop: '10px', fontWeight: "bold" }}><h6>סיבות אי זמינות</h6></div>

                    <div>
                      {finalspecialkeytwo.map((p, index) => {
                        return (
                          <div>
                            {p.type == "tipul" ? (
                              <>
                              <Row>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}>סוג הטיפול</p>
                                    <Input value={p.tipul} type="select" placeholder="סוג הטיפול" disabled>
                                       <option value={"בחר"}>{"בחר"}</option>
                                          {tipuls.map((tipul, i) => (
                                            tipul ?
                                               <option value={tipul.name}>{tipul.name}</option>
                                              : null))}
                                    </Input>
                                  </div>
                                </Col>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}><h6>תאריך כניסה לטיפול</h6></p>
                                    <Input value={p.tipul_entry_date} type="date" placeholder="תאריך כניסה לטיפול" min="1900-01-01" max="2040-01-01" disabled/>
                                  </div>
                                </Col>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}><h6>מיקום הטיפול</h6></p>
                                    <Input value={p.mikum_tipul} type="select" placeholder="מיקום הטיפול" disabled>
                                      <option value={"בחר"}>{"בחר"}</option>
                                      <option value={"ביחידה"}>{"ביחידה"}</option>
                                      <option value={"אגד ארצי"}>{"אגד ארצי"}</option>
                                      <option value={`מש"א`}>{`מש"א`}</option>
                                      <option value={"אחזקות חוץ"}>{"אחזקות חוץ"}</option>
                                    </Input>
                                  </div>
                                </Col>
                              </Row>
                              {p.hh_stands ?
                              p.hh_stands.map((hh_stand,i) => {
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
                                            value={p.hh_stands[i].missing_makat_1?p.hh_stands[i].missing_makat_1:""}
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
                                            value={p.hh_stands[i].missing_makat_2?p.hh_stands[i].missing_makat_2:""}
                                            type="string"
                                            placeholder={`כמות`}
                                            disabled
                                          ></Input>
                                        </div>
                                      </Col>
                                    </Row>
                                  </>
                                );
                              }):null}</>
                            ) : p.type == "harig_tipul" ? (
                              <>
                              <Row>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p style={{ margin: '0px', float: 'right' }}><h6>חריג טיפול</h6></p>
                                    <Input onChange={(e) => {
                                        const harig_tipul = e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].harig_tipul = harig_tipul }))
                                      }}
                                       value={p.harig_tipul} type="select" placeholder="חריג טיפול" disabled>
                                       <option value={"בחר"}>{"בחר"}</option>
                                          {tipuls.map((tipul, i) => (
                                            tipul ?
                                               <option value={tipul.name}>{tipul.name}</option>
                                              : null))}
                                    </Input>
                                  </div>
                                </Col>
                                <Col xs={12} md={4}>
                                  <div>
                                      <p style={{ margin: '0px', float: 'right' }}><h6>תאריך חריגת טיפול</h6></p>
                                      <Input onChange={(e) => {
                                        const harig_tipul_date = e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo(currentSpec => produce(currentSpec, v => { v[index].harig_tipul_date = harig_tipul_date }))
                                      }}
                                        value={p.harig_tipul_date} type="date" placeholder="תאריך חריגת טיפול" min="1900-01-01" max="2040-01-01" disabled/>
                                  </div>
                                </Col>
                              </Row>
                              {p.hh_stands?
                              p.hh_stands.map((hh_stand,i) => {
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
                                            value={p.hh_stands[i].missing_makat_1?p.hh_stands[i].missing_makat_1:""}
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
                                            value={p.hh_stands[i].missing_makat_2?p.hh_stands[i].missing_makat_2:""}
                                            type="string"
                                            placeholder={`כמות`}
                                            disabled
                                          ></Input>
                                        </div>
                                      </Col>
                                    </Row>
                                  </>
                                );
                              }):null}</>
                            ) : p.type == "takala_mizdamenet" ? (
                              <>
                              <Row>
                                <Col xs={12} md={4}>
                                  <div>
                                    <p
                                      style={{ margin: "0px", float: "right" }}
                                    >
                                      <h6>תקלה מזדמנת</h6>
                                    </p>
                                    <Input
                                      onChange={(e) => {
                                        const takala_mizdamenet =
                                          e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo((currentSpec) =>
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
                                      style={{ margin: "0px", float: "right" }}
                                    >
                                      <h6>תאריך תקלה מזדמנת</h6>
                                    </p>
                                    <Input
                                      onChange={(e) => {
                                        const takala_mizdamenet_date =
                                          e.target.value;
                                        if (e.target.value != "בחר")
                                          setFinalSpecialKeytwo((currentSpec) =>
                                            produce(currentSpec, (v) => {
                                              v[index].takala_mizdamenet_date =
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
                              {p.hh_stands ?
                              p.hh_stands.map((hh_stand,i) => {
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
                                            value={p.hh_stands[i].missing_makat_1?p.hh_stands[i].missing_makat_1:""}
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
                                            value={p.hh_stands[i].missing_makat_2?p.hh_stands[i].missing_makat_2:""}
                                            type="string"
                                            placeholder={`כמות`}
                                            disabled
                                          ></Input>
                                        </div>
                                      </Col>
                                    </Row>
                                  </>
                                );
                              }):null}</>
                              ) : null}
                          </div>
                        );
                      })}
                    </div>
                    {/* tipuls */}

                    <Row>
                      <Col>
                        <div style={{ textAlign: "right", paddingTop: "10px" }}>
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
                        <div style={{ textAlign: "right", paddingTop: "10px" }}>
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
                          <option value={"מעל 72 שעות"}>{"מעל 72 שעות"}</option>
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
  );
};
export default withRouter(CarDataFormModal);
