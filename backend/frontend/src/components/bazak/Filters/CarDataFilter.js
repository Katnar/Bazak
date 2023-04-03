import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import { withRouter, Redirect, Link } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from 'auth/index';
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
    Collapse
} from "reactstrap";
import axios from 'axios'
import { produce } from 'immer'
import Select from 'components/general/Select/AnimatedSelect'
import { toast } from "react-toastify";
import MultiSelect from 'components/general/Select/AnimatedMultiSelect'
import NormalAnimatedMultiSelect from 'components/general/Select/NormalAnimatedMultiSelect'
import CarDataFilterModal from "./filterModals/CarDataFilterModal";

const CarDataFilter = (props) => {
    const { user } = isAuthenticated()
    //
    const [userfilters, setUserfilters] = useState([])
    //
    const [zminots, setZminots] = useState([])

    const [kshirots, setKshirots] = useState([])

    const [stands, setStands] = useState([])

    const [tipuls, setTipuls] = useState([]);
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
    //
    const [iscardatafiltermodalopen, setIscardatafiltermodalopen] = useState(false);
    //
    const [filteridimport, setFilteridimport] = useState([]);
    const [editId, setEditId] = useState([])
    //
    const [collapseOpen, setcollapseOpen] = React.useState(false);
    const toggleCollapse = () => {
        setcollapseOpen(!collapseOpen);
    };

    //
    const Togglecardatafiltermodal = () => {
        setIscardatafiltermodalopen(!iscardatafiltermodalopen);
      };
    
      function ToggleForModal(evt) {
        setIscardatafiltermodalopen(!iscardatafiltermodalopen);
      }

      const EditFilter = async () => {
        let tempcardatafilterdata = {}
        tempcardatafilterdata.name = props.filter.name;
        tempcardatafilterdata.userpersonalnumber = props.filter.userpersonalnumber;
        tempcardatafilterdata.filterid = props.filter.filterid;
        
        if(props.filter.zminots){
          tempcardatafilterdata.zminots= props.filter.zminots;
        }
        else{
          tempcardatafilterdata.zminots= [];
        }
        if(props.filter.kshirots){
          tempcardatafilterdata.kshirots= props.filter.kshirots;
        }
        else{
          tempcardatafilterdata.kshirots= [];
        }
        if(props.filter.stands){
          tempcardatafilterdata.stands= props.filter.stands;
        }
        else{
          tempcardatafilterdata.stands= [];
        }
        if(props.filter.tipuls){
          tempcardatafilterdata.tipuls= props.filter.tipuls;
        }
        else{
          tempcardatafilterdata.tipuls= [];
        }

        if(props.filter.maamalfilter){
          tempcardatafilterdata.maamalfilter= props.filter.maamalfilter;
        }
        else{
          tempcardatafilterdata.maamalfilter= [];
        }

        if(props.filter.taarichtipulStart){
          tempcardatafilterdata.taarichtipulStart= props.filter.taarichtipulStart;
        }
        else{
          tempcardatafilterdata.taarichtipulStart= [];
        }
        
        if(props.filter.taarichtipulEnd){
          tempcardatafilterdata.taarichtipulEnd= props.filter.taarichtipulEnd;
        }
        else{
          tempcardatafilterdata.taarichtipulEnd= [];
        }

        if(props.filter.pikod && props.filter.pikod.length >0){
          tempcardatafilterdata.units = {pikod: props.filter.pikod};
          if(props.filter.ogda && props.filter.ogda.length >0){
            tempcardatafilterdata.units = {ogda: props.filter.ogda};
            if(props.filter.hativa && props.filter.hativa.length >0){
              tempcardatafilterdata.units = {hativa: props.filter.hativa};
              if(props.filter.gdod && props.filter.gdod.length >0){
                tempcardatafilterdata.units = {gdod: props.filter.gdod};
              }
            }
          }
        }else{
          tempcardatafilterdata.units = undefined;
        }

        if(props.filter.magadal && props.filter.magadal.length >0){
          tempcardatafilterdata.tenetree = {magadal: props.filter.magadal};
          if(props.filter.magad && props.filter.magad.length >0){
            tempcardatafilterdata.tenetree = {magad: props.filter.magad};
            if(props.filter.mkabaz && props.filter.mkabaz.length >0){
              tempcardatafilterdata.tenetree = {mkabaz: props.filter.mkabaz};
              if(props.filter.makat && props.filter.makat.length >0){
                tempcardatafilterdata.tenetree = {makat: props.filter.makat};
              }
            }
          }
        }else{
          tempcardatafilterdata.tenetree = undefined;
        }

        console.log(tempcardatafilterdata);

        let response = await axios.put(`http://localhost:8000/api/filters/cardatafilter/${props.filter.filterid}`, tempcardatafilterdata)
          .then(response => {
            toast.success(`סינון נשמר בהצלחה`);
          })
      }

      function handleChangeFilteridimport(evt) {
        const value = evt.target.value;
        setFilteridimport(value);
      }

      ////////////////////////////////
      //for the import filter function
      const ImportFilterfunc = async (editId) => {
        let tempfilteridimport;
        if(editId == undefined ){
            tempfilteridimport = filteridimport;
        }else{
            tempfilteridimport = editId;
            setEditId(editId);
        }
        if (tempfilteridimport != '') {
          let response = await axios.get(`http://localhost:8000/api/filters/cardatafilterbyfilterid/${tempfilteridimport}`)
          if (response.data.length > 0) {//סינון נמצא
            let tempfilter = { ...response.data[0] };
            if(editId == undefined){//for editting the filter
                delete tempfilter.name;
                delete tempfilter.userpersonalnumber;
                delete tempfilter.filterid;
            }
            if (user.role != '0' && user.role != '5') {
              var flag = true;
              for (var i = 0; i < tempfilter.units.length; i++) {
                 var targetUnitId = Object.values(tempfilter.units[i])[1]
                  for(let j=0;j<Object.values(tempfilter.units[i])[1].length;j++){
                    flag = await importHierarchyCheck(Object.keys(tempfilter.units[i])[1], targetUnitId[j], Object.keys(tempfilter.units[i])[1]);
                    if (!flag) {
                      Object.values(tempfilter.units[i])[1].splice(j, 1);
                      j = j - 1;
                    }
                  }
                if(Object.values(tempfilter.units[i])[1].length == 0){
                  tempfilter.units.splice(i, 1);
                  i = i -1;
                }
              }
            }

            if(tempfilter.units[0]){
            tempfilter[Object.keys(tempfilter.units[0])] = Object.values(tempfilter.units[0])[0];
            unitsFilterHierarchy(Object.keys(tempfilter.units[0])[0],Object.values(tempfilter.units[0])[0], tempfilter);
            }
            if(tempfilter.tenetree[0]){
            tempfilter[Object.keys(tempfilter.tenetree[0])] = Object.values(tempfilter.tenetree[0])[0];
            tenetreeFilterHierarchy(Object.keys(tempfilter.tenetree[0])[0],Object.values(tempfilter.tenetree[0])[0], tempfilter);
            }
            delete tempfilter.units;
            delete tempfilter.tenetree;
            console.log(tempfilter)
            props.setFilter(tempfilter);
            toast.success(`סינון נמצא`);
            
          }
          else {//סינון לא נמצא
            toast.error(`סינון לא נמצא`);
          }
        }
      }

      async function importHierarchyCheck(targetUnitType, targetUnitId, firstUnitType) {
        if (targetUnitId == unitIdByUserRole() && (unitTypeByUnitRole(firstUnitType) < user.role)) {
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
            return importHierarchyCheck(targetUnitType, targetUnitId, firstUnitType);
          } else {
            return false;
          }
        }
      }
    
      function unitIdByUserRole() {
        if (user.role === "1") {
          return user.gdodid;
        }
        if (user.role === "2") {
          return user.hativaid;
        }
        if (user.role === "3") {
          return user.ogdaid;
        }
        if (user.role === "4") {
          return user.pikodid;
        }
      }
      function unitTypeByUnitRole(targetUnitType) {
        if (targetUnitType == "gdod") {
          return "1";
        }
        if (targetUnitType == "hativa") {
          return "2";
        }
        if (targetUnitType == "ogda") {
          return "3";
        }
        if (targetUnitType == "pikod") {
          return "4";
        }
      }
      async function getTargetParentId(targetUnitId, targetUnitType) {
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
      }
      //for the import filter function
      ////////////////////////////////

      //////////////////////////////
      //for the unit heirarchy check
      async function unitsFilterHierarchy(CurrentUnitFilterType, CurrentUnitFilterId, tempfilter) {
        let tempCurrentUnitFilterId = [...CurrentUnitFilterId];
        let temp2 = [];
        if (CurrentUnitFilterType != 'pikod') {
            for(let i=0;i<tempCurrentUnitFilterId.length;i++){
                await getCurrentUnitParentId(CurrentUnitFilterType, tempCurrentUnitFilterId[i])
                .then(response =>{
                 let flag = false;
                    for(let j=0;j<temp2.length;j++){
                        if(temp2[j] == response){
                            flag = true;
                        }
                    }
                    if(flag == false){
                        temp2.push(response);
                    }
                }
                )
            }
            tempCurrentUnitFilterId = temp2;
            if (CurrentUnitFilterType == 'gdod') {
                CurrentUnitFilterType = 'hativa';
            }
            else {
                if (CurrentUnitFilterType == 'hativa') {
                    CurrentUnitFilterType = 'ogda';
                }
                else {
                    if (CurrentUnitFilterType == 'ogda') {
                        CurrentUnitFilterType = 'pikod';
                    }
                }
            }
            tempfilter[CurrentUnitFilterType] = tempCurrentUnitFilterId;
            return unitsFilterHierarchy(CurrentUnitFilterType, tempCurrentUnitFilterId, tempfilter);
        }
      }

      async function getCurrentUnitParentId(CurrentUnitFilterType, CurrentUnitFilterId) {
            let response = await axios.get(`http://localhost:8000/api/${CurrentUnitFilterType}/${CurrentUnitFilterId}`)
            if (CurrentUnitFilterType == 'gdod') {
                return response.data.hativa;
            }
            if (CurrentUnitFilterType == 'hativa') {
                return response.data.ogda;
            }
            if (CurrentUnitFilterType == 'ogda') {
                return response.data.pikod;
            }
      }
      //for the unit heirarchy check
      //////////////////////////////

      //////////////////////////////////
      //for the tenetree heirarchy check
      async function tenetreeFilterHierarchy(CurrentCarFilterType, CurrentCarFilterId, tempfilter) {
        let tempCurrentCarFilterId = [...CurrentCarFilterId];
            let temp2 = [];
        if (CurrentCarFilterType != 'magadal') {
          for(let i=0;i<tempCurrentCarFilterId.length;i++){
            await getCurrentTenetreeParentId(CurrentCarFilterType, tempCurrentCarFilterId[i])
            .then(response =>{
             let flag = false;
                for(let j=0;j<temp2.length;j++){
                    if(temp2[j] == response){
                        flag = true;
                    }
                }
                if(flag == false){
                    temp2.push(response);
                }
            }
            )
        }
        tempCurrentCarFilterId = temp2;
            if (CurrentCarFilterType == 'makat') {
                CurrentCarFilterType = 'mkabaz';
            }
            else {
                if (CurrentCarFilterType == 'mkabaz') {
                    CurrentCarFilterType = 'magad';
                }
                else {
                    if (CurrentCarFilterType == 'magad') {
                        CurrentCarFilterType = 'magadal';
                    }
                }
            }
            tempfilter[CurrentCarFilterType] = tempCurrentCarFilterId;
            return tenetreeFilterHierarchy(CurrentCarFilterType, tempCurrentCarFilterId, tempfilter);
        }
      } 
    
        async function getCurrentTenetreeParentId(CurrentCarFilterType, CurrentCarFilterId) {
                let response = await axios.get(`http://localhost:8000/api/${CurrentCarFilterType}/${CurrentCarFilterId}`)
                if (CurrentCarFilterType == 'makat') {
                    return response.data.mkabaz;
                }
                if (CurrentCarFilterType == 'mkabaz') {
                    return response.data.magad;
                }
                if (CurrentCarFilterType == 'magad') {
                    return response.data.magadal;
                }
        }
      //for the tenetree heirarchy check
      //////////////////////////////////
      
    const getKshirots = async () => {
        let tempkshirots = [];
        tempkshirots.push('כשיר');
        tempkshirots.push('לא כשיר');
        setKshirots(tempkshirots)
    }

    const getZminots = async () => {
        let tempzminots = [];
        tempzminots.push('זמין');
        tempzminots.push('לא זמין');
        setZminots(tempzminots)
    }

    const getStands = async () => {
        let tempstands = [];
        tempstands.push('סדיר');
        tempstands.push('הכן');
        tempstands.push('הח"י');
        setStands(tempstands)
    } 
    const getTipuls = async () => {
        let temptipuls = [];
        temptipuls.push(['טיפול','tipul']);
        temptipuls.push(['חריג טיפול', 'harig_tipul']);
        temptipuls.push(['תקלה מזדמנת','takala_mizdamenet']);
        setTipuls(temptipuls)
    }
    const getMagadals = async () => {
        let fullresposne = [];
    await axios.get(`http://localhost:8000/api/magadal`)
      .then(response => {
        for(let j = 0; j < response.data.length; j++){
          fullresposne[j] = { label: response.data[j].name, value: response.data[j]._id}
        }
        setMagadals(fullresposne)
      })
      .catch((error) => {
        console.log(error);
      })
    }

    const getMagads = async (magadalid) => {
        if (magadalid != undefined) {
            let tempmagadalsmagads = [];
            for(let i=0;i<magadalid.length;i++){
            await axios.get(`http://localhost:8000/api/magad/magadsbymagadal/${magadalid[i]}`)
              .then(response => {
                for (let j = 0; j < response.data.length; j++){
                  tempmagadalsmagads.push({label: response.data[j].name, value: response.data[j]._id});
                }
              })
              .catch((error) => {
                console.log(error);
              })
            }
            setMagads(tempmagadalsmagads);
          }
    }

    const getMkabazs = async (magadid) => {
        let tempmagadmkabazs = [];
        if (magadid != undefined) {
        for(let i=0;i<magadid.length;i++){
        await axios.get(`http://localhost:8000/api/mkabaz/mkabazsbymagad/${magadid[i]}`)
        .then(response => {
          for (let j = 0; j < response.data.length; j++){
            tempmagadmkabazs.push({ label: response.data[j].name, value: response.data[j]._id});
          }
        })
        .catch((error) => {
          console.log(error);
        })
        }
        setMkabazs(tempmagadmkabazs);
        }
    }

    const getMakats = async (mkabazid) => {
        let tempmkabazmakats = [];
        if (mkabazid != undefined) {
        for(let i=0;i<mkabazid.length;i++){
         await axios.get(`http://localhost:8000/api/makat/makatsbymkabaz/${mkabazid[i]}`)
        .then(response => {
          for (let j = 0; j < response.data.length; j++){
            tempmkabazmakats.push({ label: response.data[j].name, value: response.data[j]._id});
          }
         })
        .catch((error) => {
          console.log(error);
        })
        }
         setMakats(tempmkabazmakats);
        }
    }

    const loadPikods = async () => {
        let fullresposne = [];
        await axios.get("http://localhost:8000/api/pikod",)
            .then(response => {
                for(let j = 0; j < response.data.length; j++){
                    fullresposne[j] = { label: response.data[j].name, value: response.data[j]._id}
                }
                setPikods(fullresposne);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const loadOgdas = async (pikodid) => {
      console.log(pikodid)
        if(pikodid){
            let temppikodogdas = [];
            await axios.post("http://localhost:8000/api/ogda/ogdasbypikodid", { pikod: pikodid })
                .then(response => {
                    for(let j = 0; j < response.data.length; j++){
                        temppikodogdas[j] = { label: response.data[j].name, value: response.data[j]._id}
                    }
                    setOgdas(temppikodogdas);
                    console.log(temppikodogdas)
                })
                .catch((error) => {
                    console.log(error);
                })
            }
    }

    const loadHativas = async (ogdaid) => {
        let tempogdahativas = [];
        await axios.post("http://localhost:8000/api/hativa/hativasbyogdaid", { ogda: ogdaid })
            .then(response => {
                for(let j = 0; j < response.data.length; j++){
                    tempogdahativas[j] = { label: response.data[j].name, value: response.data[j]._id}
                }
                setHativas(tempogdahativas);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const loadGdods = async (hativaid) => {
        let temphativasgdods = [];
        await axios.post("http://localhost:8000/api/gdod/gdodsbyhativaid", { hativa: hativaid })
            .then(response => {
                for(let j = 0; j < response.data.length; j++){
                    temphativasgdods[j] = { label: response.data[j].name, value: response.data[j]._id}
                }
                setGdods(temphativasgdods);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const getFilters = async () => {
        await axios.get("http://localhost:8000/api/filters/cardatafilter")
            .then(response => {
                setUserfilters(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function init() {
        getKshirots();
        getZminots();
        getStands();
        getTipuls();
        getMagadals();
        loadPikods();
        getFilters();
    }

    useEffect(() => {
        setOgdas([]);
        loadOgdas(props.filter.pikod);
    }, [props.filter.pikod]);

    useEffect(() => {
        setHativas([]);
        loadHativas(props.filter.ogda);
    }, [props.filter.ogda]);

    useEffect(() => {
        setGdods([]);
        loadGdods(props.filter.hativa);
    }, [props.filter.hativa]);

    useEffect(() => {
        setMagads([]);
        getMagads(props.filter.magadal);
    }, [props.filter.magadal]);

    useEffect(() => {
        setMkabazs([]);
        getMkabazs(props.filter.magad);
    }, [props.filter.magad]);

    useEffect(() => {
        setMakats([]);
        getMakats(props.filter.mkabaz);
    }, [props.filter.mkabaz]);

    useEffect(() => { 
      loadPikods();
      loadOgdas(props.filter.pikod);//props.filter.pikod keeps being undefined for some reason
      loadHativas(props.filter.ogda);
      loadGdods(props.filter.hativa);
    }, [props.filter]);

    useEffect(() => {
        init();
    }, []);

    return (
        <>
        {/*modals */}
        <CarDataFilterModal isOpen={iscardatafiltermodalopen} Toggle={Togglecardatafiltermodal} ToggleForModal={ToggleForModal} filter={props.filter} init={init}/>

        <div style={{ width: '100%', margin: 'auto', textAlign: 'right' }}>
            <Button onClick={toggleCollapse} style={{}}>סינון</Button>
            <Collapse isOpen={collapseOpen}>
                <Card style={{ background: 'rgb(228,228,228,0.2)' }}>
                    <div>
                     <Row style={{ margin: '0px' }}>
                        <Col style={{ padding: '0px', marginBottom: '20px' }} xs={12} md={2}>
                        <div style={{ textAlign: 'right', paddingTop: '10px' }}><h5>ייבוא סינון: </h5></div>
                          <Input type="text" value={filteridimport} onChange={handleChangeFilteridimport} placeholder="ניתן להזין קוד סינון שקיבלת לייבוא!"/> 
                        </Col>
                        <Col xs={12} md={2} style={{ textAlign: 'right' }}>
                          <button className='btn-new-blue' onClick={()=>{ImportFilterfunc()}} style={{ margin: '0px', marginTop: '40px' }}>חפש סינון</button>
                        </Col>
                     </Row>
                    </div>
                    <Row style={{ margin: '0px' }}>
                        <Col xs={12} md={1} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>זמינות</h4>
                            {zminots ? zminots.map((zminot, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.filter.zminots && props.filter.zminots.indexOf(zminot) != -1 ?
                                                <button className="btn-empty" name={'zminot'} value={zminot} onClick={props.setfilterfunction}><h6 style={{ color: 'blue' }}>{zminot}</h6></button>
                                                : <button className="btn-empty" name={'zminot'} value={zminot} onClick={props.setfilterfunction}><h6 style={{ fontWeight: 'unset' }}>{zminot}</h6></button>}
                                        </Row>
                                    )
                                }
                            }) : null}
                        </Col>
                        <Col xs={12} md={1} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>כשירות</h4>
                            {kshirots ? kshirots.map((kshirot, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.filter.kshirots && props.filter.kshirots.indexOf(kshirot) != -1 ?
                                                <button className="btn-empty" name={'kshirot'} value={kshirot} onClick={props.setfilterfunction}><h6 style={{ color: 'blue', }}>{kshirot}</h6></button>
                                                : <button className="btn-empty" name={'kshirot'} value={kshirot} onClick={props.setfilterfunction}><h6 style={{ fontWeight: 'unset' }}>{kshirot}</h6></button>}
                                        </Row>
                                    )
                                }
                            }) : null}
                        </Col>
                        <Col xs={12} md={1} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>מעמד</h4>
                            {stands ? stands.map((stand, index) => {
                                {
                                    return (
                                        <Row>
                                            {props.filter.stands && props.filter.stands.indexOf(stand) != -1 ?
                                                <button className="btn-empty" name={'stand'} value={stand} onClick={props.setfilterfunction}><h6 style={{ color: 'blue', }}>{stand}</h6></button>
                                                : <button className="btn-empty" name={'stand'} value={stand} onClick={props.setfilterfunction}><h6 style={{ fontWeight: 'unset' }}>{stand}</h6></button>}
                                        </Row>
                                    )
                                }
                            }) : null}
                        </Col>
                        <Col xs={12} md={1} style={{ textAlign: 'right' }}>
                            <h4 style={{ fontWeight: 'bold' }}>סיבת אי זמינות</h4>
                            {tipuls ? tipuls.map((tipul, index) => {
                                {
                                    return (
                                        <>
                                        <Row>
                                            {props.filter.tipuls && props.filter.tipuls.indexOf(tipul[1]) != -1 ?
                                                <button className="btn-empty" name={'tipul'} value={tipul[1]} onClick={props.setfilterfunction}><h6 style={{ color: 'blue', }}>{tipul[0]}</h6></button>
                                                : <button className="btn-empty" name={'tipul'} value={tipul[1]} onClick={props.setfilterfunction}><h6 style={{ fontWeight: 'unset' }}>{tipul[0]}</h6></button>}
                                        </Row>
                                        {tipul[0] == 'חריג טיפול' ?
                                        props.filter.tipuls && props.filter.tipuls.indexOf('harig_tipul') != -1 ?
                                        <Row>
                                           {props.filter.maamalfilter && props.filter.maamalfilter.indexOf('is_maamal') != -1 ?
                                               <button className="btn-empty" name={'is_maamal'} value={'is_maamal'} onClick={props.setfilterfunction}><h6 style={{ color: 'blue', }}>{'האם ביצע טיפול מעמ"ל'}</h6></button>
                                               : 
                                               <button className="btn-empty" name={'is_maamal'} value={'is_maamal'} onClick={props.setfilterfunction}><h6 style={{ fontWeight: 'unset' }}>{'האם ביצע טיפול מעמ"ל'}</h6></button>}
                                        </Row>
                                        :null
                                        :null}
                                        </>
                                    )
                                }
                            }) : null}
                        </Col>
                        <Col xs={12} md={8} style={{ textAlign: 'right' }}>
                            <Row style={{ paddingTop: '10px', marginBottom: '15px' }}>
                                {((props.unittype == "admin") || (props.unittype == "general")) ?
                                    <>
                                        {(!(props.filter.ogda) || !(props.filter.ogda.length > 0)) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>פיקוד</h6>
                                                <NormalAnimatedMultiSelect data={pikods} val={props.filter.pikod} handleChange2={props.handleChange8} name={'pikod'} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>פיקוד</h6>
                                                <NormalAnimatedMultiSelect data={pikods} val={props.filter.pikod} handleChange2={props.handleChange8} name={'pikod'} isDisabled={true} />
                                            </Col>}
                                    </> : null}

                                {((props.unittype == "admin") || (props.unittype == "general") || (props.unittype == "pikod")) ?
                                    <>
                                        {((props.filter.pikod) && (props.filter.pikod.length > 0) && (!(props.filter.hativa) || !(props.filter.hativa.length > 0))) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>אוגדה</h6>
                                                <NormalAnimatedMultiSelect data={ogdas} val={props.filter.ogda} handleChange2={props.handleChange8} name={'ogda'} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>אוגדה</h6>
                                                <NormalAnimatedMultiSelect data={ogdas} val={props.filter.ogda} handleChange2={props.handleChange8} name={'ogda'} isDisabled={true} />
                                            </Col>}
                                    </> : null}

                                {((props.unittype == "admin") || (props.unittype == "general") || (props.unittype == "pikod") || (props.unittype == "ogda")) ?
                                    <>
                                        {((props.filter.ogda) && (props.filter.ogda.length > 0) && (!(props.filter.gdod) || !(props.filter.gdod.length > 0))) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>חטיבה</h6>
                                                <NormalAnimatedMultiSelect data={hativas} val={props.filter.hativa?props.filter.hativa:[]} handleChange2={props.handleChange8} name={'hativa'} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>חטיבה</h6>
                                                <NormalAnimatedMultiSelect data={hativas} val={props.filter.hativa?props.filter.hativa:[]} handleChange2={props.handleChange8} name={'hativa'} isDisabled={true} />
                                            </Col>}
                                    </> : null}

                                {((props.unittype == "admin") || (props.unittype == "general") || (props.unittype == "pikod") || (props.unittype == "ogda") || (props.unittype == "hativa")) ?
                                    <>
                                        {((props.filter.hativa) && (props.filter.hativa.length > 0)) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>גדוד</h6>
                                                <NormalAnimatedMultiSelect data={gdods} val={props.filter.gdod?props.filter.gdod:[]} handleChange2={props.handleChange8} name={'gdod'} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>גדוד</h6>
                                                <NormalAnimatedMultiSelect data={gdods} val={props.filter.gdod?props.filter.gdod:[]} handleChange2={props.handleChange8} name={'gdod'} isDisabled={true} />
                                            </Col>}
                                    </> : null}
                            </Row>
                            <Row style={{ marginBottom: '15px' }}>
                                {((props.cartype == "magadal")) ?
                                    <>
                                        {(!(props.filter.magad) || !(props.filter.magad.length > 0)) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>מאגד על</h6>
                                                <NormalAnimatedMultiSelect data={magadals} val={props.filter.magadal?props.filter.magadal:[]} handleChange2={props.handleChange8} name={'magadal'} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>מאגד על</h6>
                                                <NormalAnimatedMultiSelect data={magadals} val={props.filter.magadal?props.filter.magadal:[]} handleChange2={props.handleChange8} name={'magadal'} isDisabled={true} />
                                            </Col>}
                                    </> : null}

                                {((props.cartype == "magadal") || (props.cartype == "magad")) ?
                                    <>
                                        {((props.filter.magadal) && (props.filter.magadal.length > 0) && (!(props.filter.mkabaz) || !(props.filter.mkabaz.length > 0))) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>מאגד</h6>
                                                <NormalAnimatedMultiSelect data={magads} val={props.filter.magad?props.filter.magad:[]} handleChange2={props.handleChange8} name={'magad'} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>מאגד</h6>
                                                <NormalAnimatedMultiSelect data={magads} val={props.filter.magad?props.filter.magad:[]} handleChange2={props.handleChange8} name={'magad'} isDisabled={true} />
                                            </Col>}
                                    </> : null}

                                {((props.cartype == "magadal") || (props.cartype == "magad") || (props.cartype == "mkabaz")) ?
                                    <>
                                        {((props.filter.magad) && (props.filter.magad.length > 0) && (!(props.filter.makat) || !(props.filter.makat.length > 0))) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>מקבץ</h6>
                                                <NormalAnimatedMultiSelect data={mkabazs} val={props.filter.mkabaz?props.filter.mkabaz:[]} handleChange2={props.handleChange8} name={'mkabaz'} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>מקבץ</h6>
                                                <NormalAnimatedMultiSelect data={mkabazs} val={props.filter.mkabaz?props.filter.mkabaz:[]} handleChange2={props.handleChange8} name={'mkabaz'} isDisabled={true} />
                                            </Col>}
                                    </> : null}

                                {((props.cartype == "magadal") || (props.cartype == "magad") || (props.cartype == "mkabaz")) ?
                                    <>
                                        {((props.filter.mkabaz) && (props.filter.mkabaz.length > 0) && (props.filter.mkabaz.length > 0)) ?
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>מק"ט</h6>
                                                <NormalAnimatedMultiSelect data={makats} val={props.filter.makat?props.filter.makat:[]} handleChange2={props.handleChange8} name={'makat'} />
                                            </Col> :
                                            <Col style={{ justifyContent: 'right', alignContent: 'right', textAlign: 'right' }}>
                                                <h6>מק"ט</h6>
                                                <NormalAnimatedMultiSelect data={makats} val={props.filter.makat?props.filter.makat:[]} handleChange2={props.handleChange8} name={'makat'} isDisabled={true} />
                                            </Col>}
                                    </> : null}
                            </Row>
                        </Col>
                    </Row>

                    {props.filter.tipuls && props.filter.tipuls.indexOf('harig_tipul') != -1 ?
                    <div>
                        <Row style={{margin:'0px', marginBottom:'20px'}}>
                          <Col xs={12} md={1} style={{ textAlign: 'right' }}>
                          <h4 style={{ fontWeight: 'bold', width:'150px' }}>תאריך חריג טיפול</h4>
                            <div style={{display:'flex', alignItems:'center', width:'120px'}}>
                                <Input name={'taarichtipulEnd'} value={props.filter.taarichtipulEnd} onChange={props.handleChangeForTaarichTipul} type="date" min={props.filter.taarichtipulStart ? props.filter.taarichtipulStart :"1900-01-01"} max="2040-01-01" /> - <Input name={'taarichtipulStart'} value={props.filter.taarichtipulStart} onChange={props.handleChangeForTaarichTipul} type="date" min="1900-01-01" max={props.filter.taarichtipulEnd ? props.filter.taarichtipulEnd :"2040-01-01"} />
                            </div>
                          </Col>
                        </Row>
                    </div>
                    :null}

                    <div>
                        <Row>
                            {props.allColumns.map(column => (
                                <Col xs={12} md={2}>
                                    <div key={column.id}>
                                        <label>
                                            <input type="checkbox" {...column.getToggleHiddenProps()} />{' '}
                                            {column.Header}
                                        </label>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        <Row style={{ margin: '0px' }}>
                            <Col xs={12} md={2} style={{ textAlign: 'right' }}>
                              {props.filter.filterid ?
                              <button className='btn-new-blue' style={{ margin: '0px', marginTop: '20px' }} onClick={() => EditFilter()}>ערוך סינון</button>
                              :
                              <button className='btn-new-blue' style={{ margin: '0px', marginTop: '20px' }} onClick={() => Togglecardatafiltermodal(undefined)}>שמור סינון חדש</button>
                              }
                            </Col>
                        </Row>
                    </div>
                    {/* ליצור מקום לסינונים השמורים */}
                    
                    <div>
                        {userfilters != '' ? (
                        <h4 style={{ margin: '0px'}}>סינונים שמורים:</h4>
                         ):null}
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                        {userfilters.map((filter, i) =>
                            filter ? (
                            <CarDataFilterCard setFilteridimport={setFilteridimport} ImportFilterfunc={ImportFilterfunc} filter={filter} init={init}/>
                            ) : null
                        )}
                        </div>
                    </div>
                </Card >
            </Collapse>
        </div>
        </>
    );
}
export default withRouter(CarDataFilter);;