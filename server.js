const express = require("express");
const cors = require("cors");
const body_parser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const { v4: uuidV4 } = require("uuid");

app.use(cors());
app.use(body_parser.urlencoded({extended:true}));
app.use(express.json());
app.set("view engine","ejs");
app.use(express.static("public"));


app.get("/",(req,res,next)=>{
	res.redirect("/"+uuidV4());
});

app.get("/:room",(req,res,next)=>{
	res.render("room",{roomId:req.params.room});
});

io.on("connection",(socket)=>{
	console.log("connected to server socket.");

	socket.on("join-room",(roomId,userId)=>	{
		socket.join(roomId);
		socket.to(roomId).emit("user-connected",userId);
	});

	socket.on("disconnect", (roomId,userId)=>{
		console.log("user disconnected successfully");
		socket.to(roomId).emit("user-disconncted",userId);
	});
});

http.listen(3000,()=>{
	console.log("server started on 3000");
})