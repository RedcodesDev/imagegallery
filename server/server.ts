import express from "express";
import fs from "fs";
import {join, resolve} from "path";

const app = express();
const port = 3000;

const imageDir = "server/images";
let imageCodes = {}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/images', (req, res) => {
    const code = req.query.code as string;
    const path = imageCodes[code];
    if(!path) {
        res.sendStatus(403);
        return;
    }
    fs.readdir(path, (err, files) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        res.send(files.filter((f) => f.endsWith(".jpg") || f.endsWith(".png") || f.endsWith(".jpeg")));
    });
});

app.get('/image', (req, res) => {
    const code = req.query.code as string;
    const imageName = req.query.image;
    const path = imageCodes[code];
    if(!path) {
        res.sendStatus(403);
        return;
    }
    res.sendFile(resolve(join(path, imageName)));
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);

    console.log("Bilder werden geladen...");
    fs.readdir(imageDir, (err, files) => {
        files.forEach((file) => {
            if(fs.lstatSync(join(imageDir, file)).isDirectory()) {
                fs.readFile(join(imageDir, file, 'images.json'), (err, data) => {
                    const imagesData = JSON.parse(data.toString());
                    imageCodes[imagesData.code] = join(imageDir, file);
                    console.log(`Bilder aus "${file}" mit Code "${imagesData.code}" verknüpft`);
                });
            }
        });
    });
});
