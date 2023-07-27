import React from 'react'
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import { tokens } from "../../theme";
import Header from "../../components/Header";
export default function DashBoardVehicleBox({data}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div>
      <Header title={data.registration_number} subtitle="Vehicle Registration Number" />
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.data.co}
            subtitle="CO"
            progress="0.75"
            increase="+14%"
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.data.po}
            subtitle="PO"
            progress="0.50"
            increase="+21%"
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.data.hcho}
            subtitle="HCHO"
            progress="0.30"
            increase="+5%"
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={data.data.pm}
            subtitle="PM"
            progress="0.80"
            increase="+43%"
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h3"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Weekly Analysis
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} cdata={data.chart} />
          </Box>
        </Box>
      </Box>
    </div>
  )
}
