const pool = require('../db')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError,BadRequestError} = require('../errors/index')
require('dotenv').config()

const login = async(req,res)=>{
  const {username,password} = req.body
  const response = await pool.query("select myuser.owner_id,role.role_name from role inner join myuser on role.role_id = myuser.role_id where username = '"+username+"' and password = '"+password+"';")
  if(response.rowCount == 0){
    throw new UnauthenticatedError("Please provide valid username or password")
  }
  else{
    if(response.rows[0].role_name == 'USER'){
      token = jwt.sign({ userId:response.rows[0].owner_id },process.env.JWT_SECRET_USER,{ expiresIn: process.env.JWT_LIFETIME });
      res.status(200).json({res:"Success",data:{token,role:response.rows[0].role_name}})
    }
    else if(response.rows[0].role_name == 'ADMIN'){
      token = jwt.sign({ adminId:response.rows[0].owner_id },process.env.JWT_SECRET_ADMIN,{ expiresIn: process.env.JWT_LIFETIME });
      res.status(200).json({res:"Success",data:{token,role:response.rows[0].role_name}})
    }
    else if(response.rows[0].role_name == 'RTO'){
      token = jwt.sign({ rtoId:response.rows[0].owner_id },process.env.JWT_SECRET_RTO,{ expiresIn: process.env.JWT_LIFETIME });
      res.status(200).json({res:"Success",data:{token,role:response.rows[0].role_name}})
    }
  }
}

const testController = async(req,res)=>{
  const response = await pool.query("select myuser.owner_id,role.role_name from role inner join myuser on role.role_id = myuser.role_id where username = '90' and password = '1234567890';");
  if(response.rowCount == 0){
    console.log("Hello moto")
  }
  res.status(200).json({res:"Success",data:response.rows})
}

const getFailCounts = async(req,res)=>{
  const response = await pool.query("select vehicle.vehicle_type,count(vehicle.vehicle_type) from vehicle inner join pollutant_measurement on vehicle.vehicle_id = pollutant_measurement.vehicle_id where pollutant_measurement.co_value > (select avg(co_value) from pollutant_measurement) or pollutant_measurement.hcho_value > (select avg(hcho_value) from pollutant_measurement) or no_value > (select avg(no_value) from pollutant_measurement) or pm > (select avg(pm) from pollutant_measurement) group by vehicle.vehicle_type;")
  console.log(response.rows)
  let arr=[]
  let obj = {}
  for(let i=0;i<response.rows.length;++i){
    obj[response.rows[i].vehicle_type] = response.rows[i].count
    arr.push(obj)
    obj = {}
  }
  res.status(200).json({res:"Success",data:arr})
}

const getFailedDetails = async (req,res)=>{
  const {category} = req.params
  const response = await pool.query("select owner.name as name,vehicle.registration_number as vehicle_number,vehicle.company as vehicle_company,vehicle.fuel_type as fuel_type,pollutant_measurement.co_value as co,pollutant_measurement.no_value as no,pollutant_measurement.hcho_value as hcho,pollutant_measurement.pm as pm from vehicle inner join pollutant_measurement on vehicle.vehicle_id = pollutant_measurement.vehicle_id inner join owner on owner.owner_id = vehicle.owner_id where vehicle.vehicle_type = '"+category+"' and (pollutant_measurement.co_value > (select avg(co_value) from pollutant_measurement) or pollutant_measurement.hcho_value > (select avg(hcho_value) from pollutant_measurement) or no_value > (select avg(no_value) from pollutant_measurement) or pm > (select avg(pm) from pollutant_measurement) );");
  res.status(200).json({res:"Success",data:response.rows})
}

const getFailedDayWiseBarData = async (req,res)=>{
  const oldDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  const oldmonth = oldDate.getMonth()+1
  let od=''
  let arr=[]
  let obj={}
  for(let i=0;i<=6;++i){
    let day = oldDate.getDate()+i
    od += oldDate.getFullYear() + "-" + oldmonth + "-" +day
    console.log(od)
    const response = await pool.query("select vehicle.vehicle_type,count(vehicle.vehicle_type) from vehicle inner join pollutant_measurement on vehicle.vehicle_id = pollutant_measurement.vehicle_id where pollutant_measurement.measurement_datetime = '"+od+"' and ( pollutant_measurement.co_value > (select avg(co_value) from pollutant_measurement) or pollutant_measurement.hcho_value > (select avg(hcho_value) from pollutant_measurement) or no_value > (select avg(no_value) from pollutant_measurement) or pm > (select avg(pm) from pollutant_measurement)) group by vehicle.vehicle_type;")
    console.log(response.rows)
    obj['date']=od
    for(let j=0;j<response.rows.length;++j){
      obj[response.rows[j].vehicle_type] = response.rows[j].count
    }
    arr.push(obj)
    obj={}
    od=''
  }
  res.status(200).json({res:"Success",data:arr})
}

const dailyEmmitedGasPie = async (req,res)=>{
  const currDate = new Date()
  const currmonth = currDate.getMonth()+1
  let cd=''
  cd+=currDate.getFullYear() + "-" + currmonth + "-" +currDate.getDate()
  const response = await pool.query(" select sum(co_value) as co_value,sum(no_value) as no_value,sum(hcho_value) as hcho_value,sum(pm) as pm from pollutant_measurement where measurement_datetime = '"+cd+"';")
  let obj = {},sum=0
  sum+=parseFloat(response.rows[0]?.co_value) + parseFloat(response.rows[0]?.no_value) + parseFloat(response.rows[0]?.hcho_value) + parseFloat(response.rows[0]?.pm)
  obj['CO'] = (parseFloat(response.rows[0]?.co_value)/sum)*100
  obj['NO'] = (parseFloat(response.rows[0]?.no_value)/sum)*100
  obj['HCHO'] = (parseFloat(response.rows[0]?.hcho_value)/sum)*100
  obj['PM'] = (parseFloat(response.rows[0]?.pm)/sum)*100
  res.status(200).json({res:"Success",data:obj})
}

const totalGasEmmitedPerDayPerUser = async (req,res)=>{
  const {userId} = req.user
  const currDate = new Date()
  const currmonth = currDate.getMonth()+1
  let cd=''
  cd+=currDate.getFullYear() + "-" + currmonth + "-" +currDate.getDate()
  const response = await pool.query("select vehicle_id,registration_number from vehicle where owner_id = "+userId+";")
  const arr = response.rows
  for(let i=0;i<response.rowCount;++i){
    const resp = await pool.query("select sum(co_value) as co,sum(no_value) as po,sum(hcho_value) as hcho,sum(pm) as pm from pollutant_measurement where vehicle_id = "+arr[i].vehicle_id+" and measurement_datetime = '"+cd+"';")
    arr[i]['data'] = resp.rows[0]
  }
  res.status(200).json({res:'Success',data:arr})
}

const getAverageEmmisionDayWiseLineChartData = async (req,res)=>{
  const oldDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  const oldmonth = oldDate.getMonth()+1
  let od=''
  let arr=[]
  for(let i=0;i<=6;++i){
    let day = oldDate.getDate()+i
    od += oldDate.getFullYear() + "-" + oldmonth + "-" +day
    console.log(od)
    const response = await pool.query(" select avg(no_value) as no,avg(co_value) as co,avg(hcho_value) as hcho,avg(pm) as pm from pollutant_measurement where measurement_datetime = '"+od+"';")
    response.rows[0]['date'] = od
    arr.push(response.rows[0])
    od=''
  }
  res.status(200).json({res:"Success",data:arr})
}

const getAverageEmmisionDayWiseLineChartForUser = async(req,res)=>{
  const {userId} = req.user
  const responsee = await pool.query("select vehicle_id,registration_number from vehicle where owner_id = "+userId+";")
  let objj = {}
  let final_arr = []  
  for(let j=0;j<responsee.rowCount;++j){
    objj['registration_number'] = responsee.rows[j].registration_number
    const oldDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    const oldmonth = oldDate.getMonth()+1
    let od=''
    let arr=[]
    for(let i=0;i<=6;++i){
      let day = oldDate.getDate()+i
      od += oldDate.getFullYear() + "-" + oldmonth + "-" +day
      const response = await pool.query(" select avg(no_value) as no,avg(co_value) as co,avg(hcho_value) as hcho,avg(pm) as pm from pollutant_measurement where measurement_datetime = '"+od+"' and vehicle_id = "+responsee.rows[j].vehicle_id+";")
      response.rows[0]['date'] = od
      arr.push(response.rows[0])
      od=''
    }
    objj['data'] = arr
    final_arr.push(objj)
    objj={}
  }
  res.status(200).json({res:"Success",data:final_arr})
}
module.exports = {testController,getFailCounts,getFailedDetails,getFailedDayWiseBarData,dailyEmmitedGasPie,login,totalGasEmmitedPerDayPerUser,getAverageEmmisionDayWiseLineChartData,getAverageEmmisionDayWiseLineChartForUser}