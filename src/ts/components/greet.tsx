import { h, render } from 'preact';
// import React, {FC} from "react";
import "../styles/styles.css";


 const Greet = (props) =>{
// const Greet: FC = (props) =>{
    return(
        <div className="greeting">
        hi, {props.name}!
        </div>
    )
}

export default Greet;