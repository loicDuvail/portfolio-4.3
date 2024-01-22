const path = require("path");
const pool = require("../../../modules/DB/DB-cnx");
const fs = require("fs");

const projects = JSON.parse(fs.readFileSync(path.resolve('./projects.json')).toString());

projects.forEach(project =>{
    const keys = Object.keys(project).filter(key => key !== 'id');
    const cols = `(${keys.join(',')})`;
    const values = ` VALUES (${keys.map(key => `"${project[key]}"`).join(',')})`;
    const query = 'INSERT INTO PROJECTS ' + cols + values;
    pool.query(query, (err, info)=>{
        if(err)console.error(err);
    })
})