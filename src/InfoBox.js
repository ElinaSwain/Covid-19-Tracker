import React from 'react';
import './InfoBox.css';
import {Card,CardContent, Typography} from '@material-ui/core';


function InfoBox({title,cases,isRed,active,total, ...props}) {
    return (
       
            <Card className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`} 
                onClick = {props.onClick}
            >
                <CardContent>
                    <Typography className="infoBox_title" color="textSecondary">
                        {title}
                    </Typography>
                    <h3 className={`infoBox__cases ${!isRed && 'infoBox__cases--green' }`}>{cases}</h3>
                    <Typography className="infoBox_total" color="textSecondary">
                        Total {total} 
                    </Typography>
                </CardContent>
            </Card>
            
      
    )
}

export default InfoBox;
