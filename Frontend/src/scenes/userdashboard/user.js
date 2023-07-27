import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Co2Icon from "@mui/icons-material/Co2";
import ToysIcon from "@mui/icons-material/Toys";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import DashBoardVehicleBox from "../dashboard/dashBoardVehicleBox";

const UserDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [newData, setNewData] = useState([]);
  useEffect(() => {
    async function fetchdata() {
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        const data = await axios.get(
          "http://127.0.0.1:3002/api/v1/views/totalGasEmmitedPerDayPerUser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(data.data.data);
        setNewData(data.data.data);
        
      //setChartData(response.data.data[0].data)
      } catch (err) {
        console.log(err);
      }
    }
    fetchdata();
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      {newData.map((data)=>(
        <DashBoardVehicleBox data={data} key={data.vehicle_id} />
      ))}
    </Box>
  );
};

export default UserDashboard;
