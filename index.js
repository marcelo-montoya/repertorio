const express = require('express');
const fs = require('fs')

const app = express()

app.listen(3000, console.log('Servidor encendido'));

app.use(express.json())

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/index.html")
});

app.get("/canciones", (req, res) => {
    const canciones = JSON.parse(fs.readFileSync("canciones.json", 'utf-8'));
    res.json(canciones)
})

app.post("/canciones", (req, res) => {
    const cancion = req.body;
    const canciones = JSON.parse(fs.readFileSync("canciones.json", 'utf-8'));
    canciones.push(cancion);
    fs.writeFileSync("canciones.json", JSON.stringify(canciones));
    res.status(201).send('Canción agregada exitosamente');
});

app.put("/canciones/:id", (req, res) => {
    const {id} = req.params;
    const cancion = req.body;
    const canciones = JSON.parse(fs.readFileSync("canciones.json", 'utf-8'));
    const index = canciones.findIndex( c => c.id == id );
    if ( index == -1 ) {
        res.status(404).send({
            status: 404,
            error: 'ID no encontrado'
        })
    } else {        
        canciones[index] = cancion;
        fs.writeFileSync("canciones.json", JSON.stringify(canciones));
        res.status(200).send('Canción editada exitosamente');
    }
    
});

app.delete("/canciones/:id", (req, res) => {
    const {id} = req.params;
    const canciones = JSON.parse(fs.readFileSync("canciones.json", "utf-8"));
    const index = canciones.findIndex(c => c.id == id);
    if (index == -1) {
        res.status(404).send({
            status: 404,
            error: 'ID no encontrado'
        })
    } else {
        canciones.splice(index, 1);
        fs.writeFileSync("canciones.json", JSON.stringify(canciones));
        res.status(200).send('Canción eliminada exitosamente');        
    }
});