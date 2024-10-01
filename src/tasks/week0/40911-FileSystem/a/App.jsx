// App.jsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const App = () => {
  const [path, setPath] = useState(['root']);
  const [structure, setStructure] = useState({
    root: { type: 'folder', children: ['folder1', 'folder2'], content: null }
  });
  const [openFile, setOpenFile] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFileDialog, setIsFileDialog] = useState(true);
  const [newName, setNewName] = useState('');
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    if (openFile) {
      const content = structure[openFile]?.content || '';
      setFileContent(content);
    } else {
      setFileContent('');
    }
  }, [openFile, structure]);

  const handleCreate = (isFile) => {
    setDialogOpen(true);
    setIsFileDialog(isFile);
  };

  const handleSave = () => {
    if (openFile) {
      let updatedStructure = { ...structure };
      updatedStructure[openFile].content = fileContent;
      setStructure(updatedStructure);
    }
  };

  const handleSubmit = () => {
    const currentPath = path.join('/');
    let newItem = isFileDialog ? { type: 'file', content: '' } : { type: 'folder', children: [], content: null };
    let updatedStructure = { ...structure };
    if (!updatedStructure[currentPath]) {
      updatedStructure[currentPath] = { ...newItem, name: newName };
    } else {
      updatedStructure[currentPath].children.push(newName);
    }
    updatedStructure[`${currentPath}/${newName}`] = newItem;
    
    setStructure(updatedStructure);
    setDialogOpen(false);
    setNewName('');
    if (isFileDialog) {
      setOpenFile(`${currentPath}/${newName}`);
    } else {
      setPath([...path, newName]);
      setOpenFile(null); // Close any open file when navigating into a new folder
    }
  };

  const openItem = (item) => {
    if (structure[item].type === 'folder') {
      setPath([...path, item.split('/').pop()]);
      setOpenFile(null);
    } else {
      setOpenFile(item);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Breadcrumbs>
        {path.map((segment, index) => (
          <div key={segment} onClick={() => setPath(path.slice(0, index + 1))} className="cursor-pointer">
            {segment}
          </div>
        ))}
      </Breadcrumbs>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {path.reduce((acc, current) => {
            if (acc.children) {
              return acc.children.reduce((a, c) => structure[`${acc.name}/${c}`] ? { ...a, [c]: structure[`${acc.name}/${c}`] } : a, { name: acc.name, children: [] });
            }
            return acc;
          }, { name: 'root', children: structure['root']?.children || [] }).children.map(item => (
            <DropdownMenuItem key={item} onClick={() => openItem(`${path.join('/')}/${item}`)}>
              {structure[`${path.join('/')}/${item}`].type === 'folder' ? '📁' : '📄'} {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="mt-4 flex space-x-2">
        <Button onClick={() => handleCreate(true)}>Create File</Button>
        <Button onClick={() => handleCreate(false)}>Create Folder</Button>
      </div>

      {openFile && (
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>File: {openFile}</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea 
                value={fileContent} 
                onChange={(e) => setFileContent(e.target.value)}
                className="w-full h-40 p-2 border rounded"
              />
            </CardContent>
            <Button onClick={handleSave} className="mt-2">Save</Button>
          </Card>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={`Enter ${isFileDialog ? 'file' : 'folder'} name`} />
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;