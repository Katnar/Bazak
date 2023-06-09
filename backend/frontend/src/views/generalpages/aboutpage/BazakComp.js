import React, { useState, useEffect, useRef } from 'react';

import { Link, withRouter, Redirect } from "react-router-dom";

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
// import logobazakshort from "assets/img/logobazakshort.png";

import bazakodot from "assets/img/bazakodot.png";
import bazakodot_white from "assets/img/bazakodot_white.png";
import manual from "../../../assets/manual/manualExample.pdf";

function BazakComp({ match, theme }) {

  return (
    <div style={{textAlign:'center' }}>
      {/* <Row>
        <Col xs={12} md={4}>

        </Col>
        <Col xs={12} md={4} style={{ textAlign: 'center' }}>
          <img src={logobazakshort} height='200px' style={{ marginBottom: '10px' }}></img>
          <h1 style={{ fontWeight: 'bold', fontSize: '50px' }}>מערכת בז"כ</h1>
        </Col>
        <Col xs={12} md={4}>

        </Col>
      </Row>

      <Container>
        <div style={{ textAlign: 'center' }}>
          <h3>מערכת הבז"כ היא מערכת שמסייעת בניהול של נושא הזמינות והכשירות בצה"ל. המערכת מאפשרת קבלת החלטות ביצועיות שוטפות, ובכך משפרת את הפעילות והיעילות בצה"ל.
             המערכת משרתת את תחומי התכנון, קבלת ההחלטות, ניהול הפרויקט והתוצר, איתור חריגים והפיקוח על תהליכים מובנים אשר ניתן לבצע בצורה ממוחשבת.</h3>
        </div>
      </Container> */}
        {theme == 'white-content' ? <img src={bazakodot} style={{height:'1200px'}}></img>
              : <img src={bazakodot_white} style={{height:'1200px'}}></img>}
      <div style={{marginTop:'-100px'}}>
        <h1 style={{fontWeight: 'bold'}}>מדריך למשתמש:</h1>
        <a href={manual} download='manual.pdf'>
        <Button style={{fontSize: '24px'}}>הורדה</Button>
        </a>
      </div>
    </div>
  );
}

export default withRouter(BazakComp);