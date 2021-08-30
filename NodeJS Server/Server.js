const express = require('express'),
      app = express(),
      router = express.Router();
const config = require('./config.json');
const Users = require('./users');      
const port = 3000; 

app.use(express.json()); 


app.get('/',(req,res)=>{
    res.send("Test");
})

router.post("/post",async(req,res)=>{
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    switch(req.body.a)
    {
        case "redeem":
            var response = await Users.Redeem_License(req.body.username,req.body.password,req.body.license,req.body.hwid,ip);
            res.send(response);
            break
        case "login":
            var response = await Users.Login(req.body.username,req.body.password,req.body.hwid);
            res.send(response);
            break
        case "register":
            res.send("registering");
            break
        default:
            res.send("unknown");
            break
    }
});

router.post("/admin",async(req,res)=>{
    if(config.auth === req.headers.authorization)
    {
        switch(req.body.a)
        {
            case "generate":
                var response = ""
                for(var i = 0; i < req.body.quantity;i++)
                {
                    var query = await Users.Generate_License(req.body.length,req.body.rank);
                    response+= query+'\n';
                }
                res.send(response);
                break
            case "show":
                Users.Show_All_Entries();
                res.sendStatus(200);
                break
            default:
                res.send("unknown");
                break
        }
    }else{
        res.send("Access Denied");
    }
});


app.use('/',router);
app.listen(port, ()=>{console.log(`Listening on port ${port}`)});