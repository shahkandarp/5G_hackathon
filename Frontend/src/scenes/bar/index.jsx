import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import { useEffect } from "react";
import { useState } from "react";
import axios from 'axios';

const Bar = () => {
  const [newData,setNewData]=useState([])
  useEffect(()=>{
    const fetchdata = async()=>{
      const response = await axios.get('http://127.0.0.1:3002/api/v1/views/getFailedDayWiseBarData')
      console.log(response.data.data)
      setNewData(response.data.data)
    }
    fetchdata()
  },[])
  return (
    <Box m="20px">
      <Header title="Bar Chart" subtitle="Simple Bar Chart" />
      <Box height="75vh">
        <BarChart newData={newData}/>
      </Box>
    </Box>
  );
};

export default Bar;
