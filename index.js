const consul = require('consul')();
const express = require('express');

const SERVICE_NAME='microservicio101';
const SERVICE_ID='m'+process.argv[2];
const SCHEME='http';
const HOST='127.0.0.1';
const PORT=process.argv[2]*1;

/* Inicializamos server */
const app = express();

app.get('/health', (req, res) => {
  res.end( "Ok." );
});

app.get('/', (req, res) => {
  let s = "<h1>Instancia '"+SERVICE_ID+"' del servicio '"+SERVICE_NAME+"'</h1>";
  s += "<h2>Listado de servicios</h2>";

  consul.agent.service.list( (err, result) => {
    if (err) throw err;

    res.end( s+JSON.stringify( result ) );

  });
});

app.listen(PORT, () => {
  console.log('Sistema armado en el puerto '+SCHEME+'://'+HOST+':'+PORT+'!');
});

/* Registro del servicio */
var check = {
  id: SERVICE_ID,
  name: SERVICE_NAME,
  address: HOST,
  port: PORT,
  check: {
    http: SCHEME+'://'+HOST+':'+PORT+'/health',
    ttl: '5s',
    interval: '5s',
    timeout: '5s',
    deregistercriticalserviceafter: '1m'
  }
};

consul.agent.service.register(check, (err) =>  {
  if (err) throw err;
});