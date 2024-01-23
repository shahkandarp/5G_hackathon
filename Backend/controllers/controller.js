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
  const response = await pool.query("select measurement_datetime as x,avg(co_value) as y from pollutant_measurement where measurement_datetime between '2023-07-20' and '2023-07-26' group by measurement_datetime order by measurement_datetime;");
  if(response.rowCount == 0){
    console.log("Hello moto")
  }
  console.log(response.rows)
  res.status(200).json({res:"Success",data:response.rows})
}

const getFailCounts = async(req,res)=>{
  const response = await pool.query("select vehicle.vehicle_type,count(vehicle.vehicle_type) from vehicle inner join pollutant_measurement on vehicle.vehicle_id = pollutant_measurement.vehicle_id where pollutant_measurement.co_value > (select avg(co_value) from pollutant_measurement) or pollutant_measurement.hcho_value > (select avg(hcho_value) from pollutant_measurement) or no_value > (select avg(no_value) from pollutant_measurement) or pm > (select avg(pm) from pollutant_measurement) group by vehicle.vehicle_type;")
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
    const response = await pool.query("select vehicle.vehicle_type,count(vehicle.vehicle_type) from vehicle inner join pollutant_measurement on vehicle.vehicle_id = pollutant_measurement.vehicle_id where pollutant_measurement.measurement_datetime = '"+od+"' and ( pollutant_measurement.co_value > (select avg(co_value) from pollutant_measurement) or pollutant_measurement.hcho_value > (select avg(hcho_value) from pollutant_measurement) or no_value > (select avg(no_value) from pollutant_measurement) or pm > (select avg(pm) from pollutant_measurement)) group by vehicle.vehicle_type;")
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
  arr = []
  obj['id'] = 'CO'
  obj['label'] = 'CO'
  obj['value'] = (parseFloat(response.rows[0]?.co_value)/sum)*100
  obj['color'] = 'green'
  arr.push(obj)
  obj={}
  obj['id'] = 'NO'
  obj['label'] = 'NO'
  obj['value'] = (parseFloat(response.rows[0]?.no_value)/sum)*100
  obj['color'] = 'green'
  arr.push(obj)
  obj={}
  obj['id'] = 'HCHO'
  obj['label'] = 'HCHO'
  obj['value'] = (parseFloat(response.rows[0]?.hcho_value)/sum)*100
  obj['color'] = 'green'
  arr.push(obj)
  obj={}
  obj['id'] = 'PM'
  obj['label'] = 'PM'
  obj['value'] = (parseFloat(response.rows[0]?.pm)/sum)*100
  obj['color'] = 'green'
  arr.push(obj)
  res.status(200).json({res:"Success",data:arr})
}

const totalGasEmmitedPerDayPerUser = async (req,res)=>{
  const {userId} = req.user
  const currDate = new Date()
  const currmonth = currDate.getMonth()+1
  let cd=''
  cd+=currDate.getFullYear() + "-" + currmonth + "-" +currDate.getDate()
  const response = await pool.query("select vehicle_id,registration_number from vehicle where owner_id = "+userId+";")
  const arr = response.rows
  //console.log(cd)
  for(let i=0;i<response.rowCount;++i){
    const resp = await pool.query("select round(avg(co_value)) as co,round(avg(no_value)) as po,round(avg(hcho_value)) as hcho,round(avg(pm)) as pm from pollutant_measurement where vehicle_id = "+arr[i].vehicle_id+" and measurement_datetime = '"+cd+"';")
    arr[i]['data'] = resp.rows[0]
    let finalarr = [] 
    let obj = {}
    const oldDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    const oldmonth = oldDate.getMonth()+1
    let od=''
  od += oldDate.getFullYear() + "-" + oldmonth + "-" +oldDate.getDate()
  //console.log(od)
  //const currdate = new Date()
  //const currmonth = currdate.getMonth()+1
  let cd1 = ''
  cd1+=currDate.getFullYear() + "-" + currmonth + "-" +(currDate.getDate()+1)
  //console.log(cd1)
  const responsee = await pool.query("select measurement_datetime as x,avg(co_value) as y from pollutant_measurement where (measurement_datetime between '"+od+"' and '"+cd+"') and vehicle_id = "+response.rows[i].vehicle_id+" group by measurement_datetime order by measurement_datetime;")
  //console.log("select measurement_datetime as x,avg(co_value) as y from pollutant_measurement where (measurement_datetime between '"+od+"' and '"+cd1+"') and vehicle_id = "+response.rows[i].vehicle_id+" group by measurement_datetime order by measurement_datetime;")
  //console.log(responsee.rows)
  obj['id']='CO'
  obj['data'] = responsee.rows
  obj['color'] = 'red'
  finalarr.push(obj)
  obj={}
  const responseno = await pool.query("select measurement_datetime as x,avg(no_value) as y from pollutant_measurement where (measurement_datetime between '"+od+"' and '"+cd+"') and vehicle_id = "+response.rows[i].vehicle_id+" group by measurement_datetime order by measurement_datetime;")
  obj['id']='NO'
  obj['data'] = responseno.rows
  obj['color'] = 'yellow'
  finalarr.push(obj)
  obj={}
  const responsehcho = await pool.query("select measurement_datetime as x,avg(hcho_value) as y from pollutant_measurement where (measurement_datetime between '"+od+"' and '"+cd+"') and vehicle_id = "+response.rows[i].vehicle_id+" group by measurement_datetime order by measurement_datetime;")
  obj['id']='HCHO'
  obj['data'] = responsehcho.rows
  obj['color'] = 'blue'
  finalarr.push(obj)
  obj={}
  const responsepm = await pool.query("select measurement_datetime as x,avg(pm) as y from pollutant_measurement where (measurement_datetime between '"+od+"' and '"+cd+"') and vehicle_id = "+response.rows[i].vehicle_id+" group by measurement_datetime order by measurement_datetime;")
  obj['id']='PM'
  obj['data'] = responsepm.rows
  obj['color'] = 'green'
  finalarr.push(obj)
  arr[i]['chart'] = finalarr
  }
  res.status(200).json({res:'Success',data:arr})
}

const getAverageEmmisionDayWiseLineChartData = async (req,res)=>{

  let finalarr = [] 
  let obj = {}
  const oldDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  const oldmonth = oldDate.getMonth()+1
  let od=''
  od += oldDate.getFullYear() + "-" + oldmonth + "-" +oldDate.getDate()
  const currdate = new Date()
  const currmonth = currdate.getMonth()+1
  let cd=''
  cd += currdate.getFullYear() + "-" + currmonth + "-" +currdate.getDate()
  const response = await pool.query("select measurement_datetime as x,avg(co_value) as y from pollutant_measurement where measurement_datetime between '"+od+"' and '"+cd+"' group by measurement_datetime order by measurement_datetime;")
  //console.log("select measurement_datetime as x,avg(co_value) as y from pollutant_measurement where measurement_datetime between '"+od+"' and '"+cd+"' group by measurement_datetime order by measurement_datetime;")
  obj['id']='CO'
  obj['data'] = response.rows
  obj['color'] = 'red'
  
  finalarr.push(obj)
  obj={}
  const responseno = await pool.query("select measurement_datetime as x,avg(no_value) as y from pollutant_measurement where measurement_datetime between '"+od+"' and '"+cd+"' group by measurement_datetime order by measurement_datetime;")
  obj['id']='NO'
  obj['data'] = responseno.rows
  obj['color'] = 'yellow'
  finalarr.push(obj)
  obj={}
  const responsehcho = await pool.query("select measurement_datetime as x,avg(hcho_value) as y from pollutant_measurement where measurement_datetime between '"+od+"' and '"+cd+"' group by measurement_datetime order by measurement_datetime;")
  obj['id']='HCHO'
  obj['data'] = responsehcho.rows
  obj['color'] = 'blue'
  finalarr.push(obj)
  obj={}
  const responsepm = await pool.query("select measurement_datetime as x,avg(pm) as y from pollutant_measurement where measurement_datetime between '"+od+"' and '"+cd+"' group by measurement_datetime order by measurement_datetime;")
  obj['id']='PM'
  obj['data'] = responsepm.rows
  obj['color'] = 'green'
  finalarr.push(obj)

  res.status(200).json({res:"Success",data:finalarr})
}

const getAverageEmmisionDayWiseLineChartForUser = async(req,res)=>{
  const {userId} = req.user
  const responsee = await pool.query("select vehicle_id,registration_number from vehicle where owner_id = "+userId+";")
  let objj = {}
  let final_arr = []  
  
  for(let i=0;i<responsee.rowCount;++i){
    objj['registration_number'] = responsee.rows[i].registration_number
    let finalarr = [] 
    let obj = {}
    const oldDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    const oldmonth = oldDate.getMonth()+1
    let od=''
  od += oldDate.getFullYear() + "-" + oldmonth + "-" +oldDate.getDate()
  const currdate = new Date()
  const currmonth = currdate.getMonth()+1
  let cd=''
  cd += currdate.getFullYear() + "-" + currmonth + "-" +currdate.getDate()
  const response = await pool.query("select measurement_datetime as x,avg(co_value) as y from pollutant_measurement where (measurement_datetime between '"+od+"' and '"+cd+"') and vehicle_id = "+responsee.rows[i].vehicle_id+" group by measurement_datetime order by measurement_datetime;")
  //console.log("select measurement_datetime as x,avg(co_value) as y from pollutant_measurement where (measurement_datetime between '"+od+"' and '"+cd+"') and vehicle_id = "+responsee.rows[i].vehicle_id+" group by measurement_datetime order by measurement_datetime;")
  obj['id']='CO'
  obj['data'] = response.rows
  obj['color'] = 'red'
  finalarr.push(obj)
  obj={}
  const responseno = await pool.query("select measurement_datetime as x,avg(no_value) as y from pollutant_measurement where (measurement_datetime between '"+od+"' and '"+cd+"') and vehicle_id = "+responsee.rows[i].vehicle_id+" group by measurement_datetime order by measurement_datetime;")
  obj['id']='NO'
  obj['data'] = responseno.rows
  obj['color'] = 'yellow'
  finalarr.push(obj)
  obj={}
  const responsehcho = await pool.query("select measurement_datetime as x,avg(hcho_value) as y from pollutant_measurement where (measurement_datetime between '"+od+"' and '"+cd+"') and vehicle_id = "+responsee.rows[i].vehicle_id+" group by measurement_datetime order by measurement_datetime;")
  obj['id']='HCHO'
  obj['data'] = responsehcho.rows
  obj['color'] = 'blue'
  finalarr.push(obj)
  obj={}
  const responsepm = await pool.query("select measurement_datetime as x,avg(pm) as y from pollutant_measurement where (measurement_datetime between '"+od+"' and '"+cd+"') and vehicle_id = "+responsee.rows[i].vehicle_id+" group by measurement_datetime order by measurement_datetime;")
  obj['id']='PM'
  obj['data'] = responsepm.rows
  obj['color'] = 'green'
  finalarr.push(obj)
  objj['data'] = finalarr 
  final_arr.push(objj)
  objj = {}
  }
  res.status(200).json({res:"Success",data:final_arr})
}

const getAdminName = async(req,res)=>{
  const {adminId} = req.user
  const response = await pool.query("select * from owner where owner_id = "+adminId+";")
  res.status(200).json({res:"Success",data:response.rows[0]})
}

const getRTOName = async(req,res)=>{
  const {rtoId} = req.user
  const response = await pool.query("select * from owner where owner_id = "+rtoId+";")
  res.status(200).json({res:"Success",data:response.rows[0]})
}

const getUserName = async(req,res)=>{
  const {userId} = req.user
  const response = await pool.query("select * from owner where owner_id = "+userId+";")
  res.status(200).json({res:"Success",data:response.rows[0]})
}



module.exports = {testController,getFailCounts,getFailedDetails,getFailedDayWiseBarData,dailyEmmitedGasPie,login,totalGasEmmitedPerDayPerUser,getAverageEmmisionDayWiseLineChartData,getAverageEmmisionDayWiseLineChartForUser,getUserName,getRTOName,getAdminName}