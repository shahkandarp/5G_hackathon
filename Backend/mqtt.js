const pool = require('./db')
const mqtt = require('mqtt')
const protocol = 'mqtt'
const host = 'lora.nebulae.io'
const port = '2096'
const clientId = `LWN-5N00TCNECSCL/${Math.random().toString(16).slice(3)}`

const connectUrl = `${protocol}://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
})

const topic = 'application/87/device/+/uplink'

client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
})
const dbQuery = async (data)=>{
  const response = await pool.query("select vehicle_id from device where device_id='"+data.devEUI+"';")
  const str = data.publishedAt
  const arr = str.split('T');
  const date = arr[0];
  const time = arr[1].split('.')[0]
  const resp = await pool.query("insert into pollutant_measurement(vehicle_id,measurement_datetime,gateway_id,co_value,hcho_value,no_value,pm,measurement_time) values("+response.rows[0].vehicle_id+",'"+date+"','"+data.rxInfo[0].gatewayID+"',1.23,2.23,3.23,4.23,'"+time+"');")
}

client.on('message', (topic, payload) => {
  //console.log('Received Message:', topic, payload)
  const obj = JSON.parse(payload.toString())
  console.log(obj)
  dbQuery(obj)
})
