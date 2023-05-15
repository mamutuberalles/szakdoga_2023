import React, { useState, useEffect } from "react";
import { LineChart } from "@ui5/webcomponents-react-charts";
import axios from "axios";
import { Button } from "@ui5/webcomponents-react";
import { Title } from '@ui5/webcomponents-react';
import { useNavigate } from "react-router-dom";
import { Card, CardHeader } from '@ui5/webcomponents-react';
import { array, element } from "prop-types";

export function MyChart(args) {

    const navigate = useNavigate()

    const [dataset, setDataset] = useState([]);
    const [dataFetched, setDataFetched] = useState(0);
    const [measures,setMeasures] = useState([])

    const unhide = async () => {
        try {
            args.args.hidden = "false"
            const res = await axios.patch('http://localhost:4004/chart/CustomCharts/' + args.args.id, args.args, {
                headers: {
                    "Authorization": "Basic admin",
                    "Content-Type": "application/json;IEEE754Compatible=true"
                }
            })
            console.log(res)
            navigate('/charts')
        } catch (error) {
            args.args.hidden = "true"
            console.log("[INFO] Can't use this feature right now.")
        }
    }

    const hide = async () => {

        try {
            args.args.hidden = "true"
            const res = await axios.patch('http://localhost:4004/chart/CustomCharts/' + args.args.id, args.args, {
                headers: {
                    "Authorization": "Basic admin",
                    "Content-Type": "application/json;IEEE754Compatible=true"
                }
            })
            console.log(res)
            navigate('/hiddencharts')
        } catch (error) {
            args.args.hidden = "false"
            console.log("[INFO] Can't use this feature right now.")
        }
    }

    const bookmark = async () => {

        try {
            args.args.bookmarked = "true"
            const res = await axios.patch('http://localhost:4004/chart/CustomCharts/' + args.args.id, args.args, {
                headers: {
                    "Authorization": "Basic admin",
                    "Content-Type": "application/json;IEEE754Compatible=true"
                }
            })
            //console.log(res)
            navigate('/bookmarkedcharts')
        } catch (error) {
            args.args.bookmarked = "false"
            console.log("[INFO] Can't use this feature right now.")
        }


    }

    const unbookmark = async () => {
        try {
            args.args.bookmarked = "false"
            const res = await axios.patch('http://localhost:4004/chart/CustomCharts/' + args.args.id, args.args, {
                headers: {
                    "Authorization": "Basic admin",
                    "Content-Type": "application/json;IEEE754Compatible=true"
                }
            })
            console.log(res)
            navigate('/charts')
        } catch (error) {
            args.args.bookmarked = "true"
            console.log("[INFO] Can't use this feature right now.")
        }
    }

    const fetchData = async () => {
        let res = null;
        if (args.args.chart_type == "simple") {
            let queryString = null;
            //console.log(args.args)

            if (args.args.forecast == "None") {
                queryString = "http://localhost:4004/catalog/Crypto?$filter=ticker eq '" + args.args.ticker + "' and type eq '" + "real" + "'";
            }
            else {
                queryString = "http://localhost:4004/catalog/Crypto?$filter=ticker eq '" + args.args.ticker + "' and ( type eq 'real' or type eq '" + args.args.forecast + "' )";
            }

            if (args.args.start_date) {
                queryString += " and date ge " + args.args.start_date;
            }
            if (args.args.end_date) {
                queryString += " and date le " + args.args.end_date;
            }
            queryString += "&$orderby=date asc"
            res = await axios.get(queryString)
        }
        else {
            res = await axios.get('http://localhost:4004/catalog/Crypto' + "?$filter=date ge " + args.args.start_date + " and date le " + args.args.end_date + " and ticker eq '" + args.args.ticker + "' and type eq 'real'&$orderby=date asc")
            args.args.field = "close"
        }
/*         setDataset(res.data.value);
        setDataFetched(dataFetched + 1); */

        let arrayFull = res.data.value
        let columnNames = ['id','date','open','high','low','close','adj_close','volume','ticker','type']
        let zeroIndexes = []
        columnNames.forEach(column => {
            if(column != 'date' && column != args.args.field)
            {
                arrayFull.forEach(record => delete record[column])
            }
        });
        

        for (let index = 0; index < arrayFull.length; index++) {
            if(arrayFull[index][args.args.field] == 0)
            {
                zeroIndexes.push(index)
            }
        }
        console.log(zeroIndexes)
        let array_2 = []
        let last_place = 0
        zeroIndexes.forEach(index => {
            array_2.push(arrayFull.slice(last_place,index))
            last_place = index+1
        });
        array_2.push(arrayFull.slice(last_place,arrayFull.length))

        for (let index = 0; index < array_2.length; index++) {
            array_2[index].forEach(element => element[args.args.field+index] = element[args.args.field])
        }

        let array3 = []

        for (let index = 0; index < array_2.length; index++) {
            array_2[index].forEach(element => array3.push(element))
        }

        let measures_temp = []

        for (let index = 0; index < array_2.length; index++) {
            measures_temp.push(
                {
                    accessor: args.args.field+index,
                    label: args.args.label+index
                }
            )
        }



        console.log(array3)
        setDataset(array3);
        setDataFetched(dataFetched + 1);
        setMeasures(measures_temp);
    }

    const removeEl = (array, remIdx) => {
        return array.map(function(arr) {
                return arr.filter(function(el,idx){return idx !== remIdx});  
               });
       };

    useEffect(() => {
        if (dataFetched < 1) {
            fetchData();
        }
    }, [args.args])

    return (
        <>
            <Card header={<CardHeader titleText={args.args.title} />}>
                <LineChart measures={measures} dimensions={[{ accessor: "date", intervl:0 }]} dataset={dataset} />
                {args.args.hidden == "true"
                    ? <Button onClick={unhide}> Unhide Chart </Button>
                    : <> </>
                }
                {args.args.hidden == "false"
                    ? <Button onClick={hide}> Hide Chart </Button>
                    : <> </>
                }
                {args.args.bookmarked == "true"
                    ? <Button onClick={unbookmark}> Remove Bookmark </Button>
                    : <> </>
                }
                {args.args.bookmarked == "false"
                    ? <Button onClick={bookmark}> Bookmark </Button>
                    : <> </>
                }
            </Card>
        </>

    );
}