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
  const resp = await pool.query("insert into pollutant_measurement(vehicle_id,measurement_datetime,gateway_id,co_value,hcho_value,no_value,pm,measurement_time) values("+response.rows[0].vehicle_id+",'"+date+"','"+data.rxInfo[0].gatewayID+"',"+obj(data.data)+",2.23,3.23,4.23,'"+time+"');")
  console.log(obj(data.data))
}


const obj = {
  'A':0,
  'B':1,
  'C':2,
  'D':3,
  'E':4,
  'F':5,
  'G':6,
  'H':7,    
  'I':8,
  'J':9,
  'K':10,    
  'L':11,
  'M':12,
  'N':13,    
  'O':14,
  'P':15,
  'Q':16,    
  'R':17,
  'S':18,
  'T':19,    
  'U':20,
  'V':21,
  'W':22,    
  'X':23,
  'Y':24,
  'Z':25,
  'a':26,
  'b':27,
  'c':28,
  'd':29,
  'e':30,
  'f':31,
  'g':32,
  'h':33,    
  'i':34,
  'j':35,
  'k':36,    
  'l':37,
  'm':38,
  'n':39,    
  'o':40,
  'p':41,
  'q':42,    
  'r':43,
  's':44,
  't':45,    
  'u':46,
  'v':47,
  'w':48,    
  'x':49,
  'y':50,
  'z':51,
  '0':52,
  '1':53,
  '2':54,
  '3':55,
  '4':56,
  '5':57,
  '6':58,
  '7':59,
  '8':60,
  '9':61,
  '+':62,
  '/':63,
  
}


const convert = (data)=>{
  let ans=0,index=0
  for(let i=data.length-1;i>=0;--i){
      ans+=obj[data[i]]*Math.pow(64,index);
      index = index+1;
  }
  return ans;
}


client.on('message', (topic, payload) => {
  //console.log('Received Message:', topic, payload)
  const obj = JSON.parse(payload.toString())
  console.log(obj)
  dbQuery(obj)
})
