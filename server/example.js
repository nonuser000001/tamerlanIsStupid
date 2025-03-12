const fs = require('fs');
const path = require('path');
const server = require('./server');


//const folderPath = path.join(__dirname, 'files');

//console.log(folderPath);

const createFile = (fileName, content) => {
    fs.writeFile(fileName,content, (err) =>{
        if (err){
            console.log(err);
            return;
        }
        console.log("File created successfully");
    })
};

//createFile('example txt', 'this is an example file')


const readFile = (fileName) => {
    fs.readFile(fileName, 'utf8', (err,data) => {
        if(err){
            console.log(err);
            return;
        }
        console.log(data);
    });
}

readFile('example txt')