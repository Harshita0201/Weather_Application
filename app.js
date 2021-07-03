require("dotenv").config();
const express=require("express");

//https module is used to make a request to a external server.
const https=require("https"); //native node module, need'nt to be installed

const bodyParser=require("body-parser");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));




app.get("/",function(req,res){

  res.sendFile(__dirname+"/index.html");
});



app.post("/",function(req,res){


  const query=req.body.cityName; //get it from the post request send by client's server
  
  const apikey=process.env.API_KEY;
  
  const units="metric";
  const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apikey+"&units="+units;

   https.get(url,function(response){ //request to external server @url address
     console.log(response.statusCode);

     response.on("data",function(data){ //to tap into data we receive
       const weatherData= JSON.parse(data); // JSON parse will convert the hexa decimal data that we receive from response.on to readable data;
       const temp=weatherData.main.temp;
       const description=weatherData.weather[0].description;
       const icon=weatherData.weather[0].icon;
       const imageURL="http://openweathermap.org/img/wn/"+icon+"@2x.png";
       res.write("<p>The weather is currently "+description+".</p>")
       res.write("<h1>The temperature in "+query+" is "+temp+" degrees Celcius.</h1>");
       res.write("<img src="+imageURL+">");
       res.send(); // we can have only 1 res.send() but multiple res.write().
     })
   });
})


app.listen(3000,function(){
  console.log("Server is running on port 3000.")
});
