import React, { useEffect, useState } from "react";
import "./App.css";

interface Project {
  folder: string;
  files: { [key: string]: string };
}

const Projects: React.FC = () => {
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentComponent, setCurrentComponent] =
    useState<React.ReactNode | null>(null);

  // Fetch top-level folders
  useEffect(() => {
    const loadFolders = async () => {
      try {
        const response = await fetch("http://localhost:3000/list-folders");
        const foldersData = await response.json();
        setFolders(foldersData);
        if (foldersData.length > 0) {
          setSelectedFolder(foldersData[foldersData.length - 1]); // Set default folder to last one
        }
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    loadFolders();
  }, []);

  // Load projects when a folder is selected
  useEffect(() => {
    if (!selectedFolder) return;

    const loadProjects = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/folders/${selectedFolder}`
        );
        const subfoldersData = await response.json();
        setProjects(subfoldersData);
      } catch (error) {
        console.error("Error loading projects:", error);
      }
    };

    loadProjects();
  }, [selectedFolder]);

  // Handle folder selection change
  const handleFolderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFolder(event.target.value);
  };

  // Render selected component
  const handleComponentRender = async (
    componentName: string,
    folder: string
  ) => {
    try {
      let componentModule;
      componentModule = await import(
        `./tasks/${selectedFolder}/${folder}/${componentName}.tsx`
      );

      if (componentModule) {
        setCurrentComponent(React.createElement(componentModule.default));
      }
    } catch (error) {
      console.error("Error loading component:", error);
    }
  };

  return (
    <div>
      <h1>Projects</h1>

      <div className="filter">
        <label htmlFor="folderSelect">Select a week:</label>
        <select
          id="folderSelect"
          value={selectedFolder}
          onChange={handleFolderChange}
        >
          {folders.map((folder) => (
            <option key={folder} value={folder}>
              {folder}
            </option>
          ))}
        </select>
      </div>

      <div id="projectsContainer">
        {projects.map((project) => (
          <div className="project" key={project.folder}>
            <h2>{project.folder}</h2>
            <div className="project-buttons">
              {Object.keys(project.files).map((file) => {
                if (file === "video.mp4") {
                  return (
                    <a
                      key={file}
                      href={`http://localhost:3000${project.files[file]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Watch Video
                    </a>
                  );
                } else {
                  const buttonLabel = file.replace(".tsx", "");
                  return (
                    <button
                      key={file}
                      onClick={() =>
                        handleComponentRender(buttonLabel, project.folder)
                      }
                    >
                      {buttonLabel} Response
                    </button>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Render current component if selected */}
      <div id="componentContainer">
        {currentComponent && (
          <div className="rendered-component">{currentComponent}</div>
        )}
      </div>
    </div>
  );
};

export default Projects;
