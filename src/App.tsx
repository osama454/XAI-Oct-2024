import React, { useEffect, useState } from "react";
interface Project {
  folder: string;
  files: { [key: string]: string };
  folders: Project[];
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
        let response = await fetch(
          `http://localhost:3000/folders/${selectedFolder}`
        );
        const subfoldersData = await response.json();
        for (let i = 0; i < subfoldersData.length; i++) {
          response = await fetch(
            `http://localhost:3000/folders/${selectedFolder}/${subfoldersData[i].folder}`
          );
          let folders = await response.json();
          subfoldersData[i].folders = folders;
        }
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
  //${selectedFolder}/${folder}/${componentName}.tsx
  const handleComponentRender = async (path: string) => {
    try {
      if (path == "/") {
        setCurrentComponent(null);
        return;
      }
      let componentModule;
      let file = `./tasks/${path}/App.tsx`;

      componentModule = await import(file);

      if (componentModule) {
        setCurrentComponent(React.createElement(componentModule.default));
      }
    } catch (error) {
      console.error("Error loading component:", error);
    }
  };

  useEffect(() => {
    // Load the component on the initial load
    handleComponentRender(window.location.pathname);

    // Listen to browser back/forward navigation
    const onPopState = () => {
      handleComponentRender(window.location.pathname);
    };
    window.addEventListener("popstate", onPopState);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return currentComponent ? (
    currentComponent
  ) : (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 my-8">
        Projects
      </h1>

      <div className="filter flex justify-center mb-8">
        <label htmlFor="folderSelect" className="text-lg text-gray-600 mr-4">
          Select a week:
        </label>
        <select
          id="folderSelect"
          value={selectedFolder}
          onChange={handleFolderChange}
          className="p-3 bg-white border-2 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300"
        >
          {folders.map((folder) => (
            <option key={folder} value={folder}>
              {folder}
            </option>
          ))}
        </select>
      </div>

      <div id="projectsContainer" className="max-w-5xl mx-auto px-4">
        {projects.map((project) => (
          <div
            className="bg-white shadow-md rounded-lg p-6 mb-8 transform hover:-translate-y-2 hover:shadow-xl transition duration-300"
            key={project.folder}
          >
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
              {project.folder}
            </h2>
            <div className="project-buttons flex justify-center flex-wrap mt-4">
              {Object.keys(project.files).map((file) => {
                if (file.endsWith(".mp4")) {
                  return (
                    <a
                      key={file}
                      href={`http://localhost:3000${project.files[file]}`}
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md m-2 hover:bg-blue-700 transition duration-300"
                    >
                      Watch Video
                    </a>
                  );
                }
              })}
              {project.folders.map((folder) => {
                let file = folder.folder;
                const buttonLabel = file.replace(".tsx", "");
                return (
                  <button
                    key={file}
                    onClick={() =>
                      //
                      {
                        window.history.pushState(
                          {},
                          "",
                          `${selectedFolder}/${project.folder}/${buttonLabel}`
                        );
                        handleComponentRender(window.location.pathname);
                      }
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md m-2 hover:bg-blue-700 transition duration-300"
                  >
                    {buttonLabel !== "i"
                      ? `Load Response ${buttonLabel.toUpperCase()}`
                      : "Load Ideal Response"}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
