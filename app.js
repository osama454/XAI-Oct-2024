import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { exec } from "child_process";

const app = express();
const port = 3000;

app.use(cors());

let __dirname = "";

exec("npm run dev");

app.get('/', (req, res) => {
    const originalUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const updatedUrl = originalUrl.replace(':3000', ':5173');
    res.redirect(updatedUrl);
  });
  

// Endpoint to list top-level folders
app.get("/list-folders", (req, res) => {
  const rootPath = path.join(__dirname, "src", "tasks");

  fs.readdir(rootPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan directory: " + err);
    }
    const folders = files
      .filter((file) => file.isDirectory())
      .map((folder) => folder.name)
      .filter((folder) => ![".git", "node_modules"].includes(folder));

    res.json(folders);
  });
});

// Endpoint to list subfolders and files inside the selected top-level folder
app.get("/folders/*", (req, res) => {
  const folder = req.params[0];
  const folderPath = path.join(__dirname, "src", "tasks", folder);

  fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan folder: " + err);
    }

    const subfolders = files
      .filter((file) => file.isDirectory())
      .map((subfolder) => {
        const subfolderPath = path.join(folderPath, subfolder.name);
        const fileNames = fs.readdirSync(subfolderPath);

        const projectFiles = {
          folder: subfolder.name,
          files: {},
        };

        // Add files if they exist
        ["A.tsx", "B.tsx", "I.tsx", "video.mp4"].forEach((file) => {
          if (fileNames.includes(file)) {
            projectFiles.files[file] = `/${folder}/${subfolder.name}/${file}`;
          }
        });

        return projectFiles;
      });

    res.json(subfolders);
  });
});

// Serve static files such as HTML and video files
app.use(express.static(path.join(__dirname, "src", "tasks")));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
