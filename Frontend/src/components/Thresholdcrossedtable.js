import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useParams } from 'react-router-dom'
import axios from 'axios';

function createData(ownername, calories, fat, carbs,fueltype, protein,SO2,HC,PM) {
    return { ownername, calories, fat, carbs,fueltype, protein,SO2,HC,PM };
}

const rows = [
    createData('Mahesh Singh', 'GJ9AB1234', "Anand", 'Honda','Petrol', 4.0,5.2,8,8),
    createData('Rajvi Solanki', 'GJ9AB4321', "Anand", 'Hyundai','Petrol', 4.3,7,2,2),
    createData('Dhyana Soni', 'GJ9AB5678', "Ahmedabad", 'Tata','Diesel', 6.0,6,3,4),
    createData('Balvindar Jatt', 'GJ9AB8523', "Anand", 'Jeep','Petrol', 4.3,3,7,7),
    createData('Samarth Patel', 'GJ9AB5843', "Himmatnagar", 'Tata','Petrol', 3.9,9,2,8),
];

export default function Thresholdcrossedtable() {
    let params = useParams();
    const [data,setData] = React.useState([])
    React.useEffect(()=>{
        const fetchdata = async()=>{
            try{
                const response = await axios.get(`http://127.0.0.1:3002/api/v1/views/getFailedDetails/${params.type}`)
                console.log(response.data.data)
                setData(response.data.data)
            }catch(err){
                console.log(err)
            }
        }
        fetchdata()
    },[])
    
    return (
        <TableContainer component={Paper}>
            <h1 style={{ textAlign: 'center' }}>Threshold crossed {params.type}</h1>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead >
                    <TableRow>
                        <TableCell>Owner Name</TableCell>
                        <TableCell align="right">Vehicle Number</TableCell>
                        <TableCell align="right">Vehicle Company</TableCell>
                        <TableCell align="right">Fuel Type</TableCell>
                        <TableCell align="right">CO</TableCell>
                        <TableCell align="right">NO</TableCell>
                        <TableCell align="right">HCH0</TableCell>
                        <TableCell align="right">PM</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.vehicle_number}</TableCell>
                            <TableCell align="right">{row.vehicle_company}</TableCell>
                            <TableCell align="right">{row.fuel_type}</TableCell>
                            <TableCell align="right">{row.co}</TableCell>
                            <TableCell align="right">{row.no}</TableCell>
                            <TableCell align="right">{row.hcho}</TableCell>
                            <TableCell align="right">{row.pm}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}