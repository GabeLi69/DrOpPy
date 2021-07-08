//express setup
const express = require('express');
const app = express();

//setting up other modules
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");

//middlewares setup
app.use(express.json());
app.use(express.urlencoded());
app.use(fileUpload());
app.use(express.static(__dirname + '/public'));

//variables setup
var cache = {};
var filearr;

//promised version of readFile
const read = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(__dirname + path.sep + "storage" + path.sep + fileName,
            (err, fileBuffer) => {
                if (err) reject(err);
                else resolve(fileBuffer);
            })
    })
}

//promised version of writeFile
const write = (fileName, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(__dirname + path.sep + "storage" + path.sep + fileName, data,
            (err) => {
                if (err) reject(err);
                else {
                    console.log("uploaded");
                    resolve(fileName);
                }
            })
    })
}

//send our front page to users
app.get("/", (req, res) => {
    fs.createReadStream(__dirname + "/index.html").pipe(res);
})

//get filenames to make filelist
app.get("/storage/updates", (req, res) => {
    fs.readdir(__dirname + "/storage", (err, files) => {
        if (err) {
            console.log(err);
            res.end();
        } else {
            res.send(files);
        }
    })
})

//upload files
app.post("/upload", (req, res) => {
    var file = req.files.foo;
    var fileData = file.data;
    var fileName = file.name;
    console.log(file)

    if (file) {
        //write files to storage and also store it in cache
        cache[fileName] = write(fileName, fileData).then(read);
        res.redirect("/");
    } else {
        console.log('bye')
    }
})

//download files
app.get("/storage/:name", (req, res) => {
    if(cache[req.params.name]){ //download from cache if file exists in cache
        cache[req.params.name].then((data) => {
            res.send(data);
            console.log("download from cache")
        })
    } else{ //store file into cache from storage before sending it to client
        cache[req.params.name] = read(`${req.params.name}`);
        cache[req.params.name].then((data) => {
            res.send(data);
            console.log("download from cache <= storage")
        })
    }
})

//delete files
app.get("/storagedelete/:num", (req, res) => {
    console.log("delete")
    fs.unlinkSync(__dirname + "/storage/" + req.params.num);
    res.redirect("/");
});



//server setup
app.listen(8000)