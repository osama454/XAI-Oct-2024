import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Folder, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";

function App() {
  const [path, setPath] = useState(["Home"]);
  const [files, setFiles] = useState({
    Home: {
      folders: ["Folder1", "Folder2"],
      files: ["File1.txt", "File2.txt"],
      fileContents: {},
    },
    Folder1: { folders: [], files: ["File3.txt"], fileContents: {} },
    Folder2: { folders: [], files: [], fileContents: {} },
  });
  const [currentFile, setCurrentFile] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [newName, setNewName] = useState("");
  const [isCreateFileDialogOpen, setIsCreateFileDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] =
    useState(false);

  const currentPath = path[path.length - 1];

  const handleOpenFile = (file) => {
    setCurrentFile(file);
    setCurrentContent(files[currentPath].fileContents?.[file] || "");
  };

  const handleOpenFolder = (folder) => {
    setPath([...path, folder]);
    setCurrentFile("");
    setCurrentContent("");
  };

  const handleBreadcrumbClick = (index) => {
    setPath(path.slice(0, index + 1));
    setCurrentFile("");
    setCurrentContent("");
  };

  const handleCreateFile = () => {
    setFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles };
      updatedFiles[currentPath].files.push(newName);
      updatedFiles[currentPath].fileContents = {
        ...updatedFiles[currentPath].fileContents,
        [newName]: "",
      };
      return updatedFiles;
    });
    handleOpenFile(newName);
    setNewName("");
    setIsCreateFileDialogOpen(false);
  };

  const handleCreateFolder = () => {
    setFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles };
      updatedFiles[currentPath].folders.push(newName);
      updatedFiles[newName] = { folders: [], files: [], fileContents: {} };
      return updatedFiles;
    });
    handleOpenFolder(newName);
    setNewName("");
    setIsCreateFolderDialogOpen(false);
  };

  const handleSaveContent = () => {
    if (currentFile) {
      setFiles((prevFiles) => {
        const updatedFiles = { ...prevFiles };
        updatedFiles[currentPath].fileContents = {
          ...updatedFiles[currentPath].fileContents,
          [currentFile]: currentContent,
        };
        return updatedFiles;
      });
    }
  };

  return (
    <div className="p-4">
      <Breadcrumb>
        <BreadcrumbList>
          {path.map((folder, index) => (
            <React.Fragment key={folder}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="#"
                  onClick={() => handleBreadcrumbClick(index)}
                >
                  {folder}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < path.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="inline-block mt-4">
            <Button variant="outline">Open</Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {files[currentPath]?.folders.map((folder) => (
            <DropdownMenuItem
              key={folder}
              onClick={() => handleOpenFolder(folder)}
            >
              <Folder className="mr-2 h-4 w-4" />
              {folder}
            </DropdownMenuItem>
          ))}
          {files[currentPath]?.files.map((file) => (
            <DropdownMenuItem key={file} onClick={() => handleOpenFile(file)}>
              <FileText className="mr-2 h-4 w-4" />
              {file}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {currentFile && (
        <div className="mt-4">
          <Label className="block mb-2">{`Current Path: ${path.join(
            " / "
          )} / ${currentFile}`}</Label>
          <Textarea
            className="w-full"
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            placeholder="File content will appear here"
          />
          <Button className="mt-2" onClick={handleSaveContent}>
            Save
          </Button>
        </div>
      )}

      <Dialog
        open={isCreateFileDialogOpen}
        onOpenChange={setIsCreateFileDialogOpen}
      >
        <DialogTrigger asChild>
          <Button className="mt-4" variant="outline">
            Create File
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create File</DialogTitle>
            <DialogDescription>
              Enter the name of the new file.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="File name"
          />
          <DialogFooter>
            <Button onClick={handleCreateFile}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCreateFolderDialogOpen}
        onOpenChange={setIsCreateFolderDialogOpen}
      >
        <DialogTrigger asChild>
          <Button className="mt-4" variant="outline">
            Create Folder
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Folder</DialogTitle>
            <DialogDescription>
              Enter the name of the new folder.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Folder name"
          />
          <DialogFooter>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
