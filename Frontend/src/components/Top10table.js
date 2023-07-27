import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Vidhya Nagar', 159, 6.0, 24, 4.0),
    createData('Jitodia', 237, 9.0, 37, 4.3),
    createData('Bakrol', 262, 16.0, 24, 6.0),
    createData('Town Hall', 305, 3.7, 67, 4.3),
    createData('Amul Dairy', 356, 16.0, 49, 3.9),
];

export default function Top10Table() {
    return (
        <TableContainer component={Paper}>
            <h1 style={{ textAlign: 'center' }}>Top 10 Pollutant Areas</h1>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead >
                    <TableRow>
                        <TableCell>Area Name</TableCell>
                        <TableCell align="right">CO2</TableCell>
                        <TableCell align="right">NO2(g)</TableCell>
                        <TableCell align="right">HC(g)</TableCell>
                        <TableCell align="right">PM(g)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                            <TableCell align="right">{row.carbs}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}