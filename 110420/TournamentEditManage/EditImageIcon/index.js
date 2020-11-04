import React, { useState, useEffect, useRef, useContext } from "react";
import { EditIcon } from 'components/utils/Icons';
import classes from "./styles.module.scss";

const EditImageIcon = () => {
    return (
        <div className={classes.editimage} >
            <EditIcon />
        </div>
    )
}

export default EditImageIcon

