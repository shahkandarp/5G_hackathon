import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import axios from 'axios';
import { useState } from "react";
import { useEffect } from "react";

const Line = () => {
  const [chartdata,setChartData] = useState([])
  useEffect(()=>{
    const fetchdata = async()=>{
      const response = await axios.get('http://127.0.0.1:3002/api/v1/views/getAverageEmmisionDayWiseLineChartData')
      console.log(response.data.data)
      setChartData(response.data.data)
    }
    fetchdata()
  },[])
  return (
    <Box m="20px">
      <Header title="Line Chart" subtitle="Simple Line Chart" />
      <Box height="75vh">
        <LineChart cdata={chartdata}/>
      </Box>
    </Box>
  );
};

export default Line;
