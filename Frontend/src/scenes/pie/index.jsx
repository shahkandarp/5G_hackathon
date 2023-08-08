import { Box } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";
import axios from 'axios';
import { useEffect,useState } from "react";

const Pie = () => {
  const [newData,setNewData] = useState([])
  useEffect(()=>{
    const fetchdata = async()=>{
      try{
        const response = await axios.get('http://127.0.0.1:3002/api/v1/views/dailyEmmitedGasPie')
      console.log(response.data.data)
      setNewData(response.data.data)
      }catch(err){
        console.log(err)
      }
    }
    fetchdata()
  },[])
  return (
    <Box m="20px">
      {/* <Header title="Pie Chart" subtitle="Simple Pie Chart" /> */}
      <Header title="Average gas emmitted by the vehicles today" />
      <Box height="75vh">
        <PieChart newData = {newData}/>
      </Box>
    </Box>
  );
};

export default Pie;
