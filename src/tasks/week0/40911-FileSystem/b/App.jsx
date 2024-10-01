import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui";

const fileIcon = '📄';
const folderIcon = '📁';

const FileExplorer = () => {
  const [path, setPath] = useState(['root']);
  const [content, setContent] = useState('');
  const [items, setItems] = useState({
    root: {
      'folder1': {},
      'folder2': {},
      'file1.txt': { content: '' },
      'file2.txt': { content: '' },
    }
  });
  const [openItem, setOpenItem] = useState(null);
  const [dialog, setDialog] = useState({ open: false, type: '' });

  const handleOpen = (itemName) => {
    if (items[path.join('/')][itemName].content !== undefined) {
      setOpenItem(itemName);
      setContent(items[path.join('/')][itemName].content);
    } else {
      setOpenItem(null);
      setPath(prev => [...prev, itemName]);
    }
  };

  const handleCreate = (type) => {
    setDialog({ open: true, type });
  };

  const handleSave = () => {
    setItems(prev => ({
      ...prev,
      [path.join('/')]: {
        ...prev[path.join('/')],
        [openItem]: { content }
      }
    }));
  };

  const handleDialogSubmit = (name) => {
    const newPath = path.join('/');
    const newItem = dialog.type === 'file' ? { content: '' } : {};
    setItems(prev => ({
      ...prev,
      [newPath]: {
        ...prev[newPath],
        [name]: newItem
      }
    }));
    setDialog({ open: false, type: '' });
    if (dialog.type === 'file') {
      handleOpen(name);
    } else {
      setPath([...path, name]);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Breadcrumb path={path} setPath={setPath} />
      <div className="flex justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.keys(items[path.join('/')]).map(item => (
              <DropdownMenuItem key={item} onClick={() => handleOpen(item)}>
                {items[path.join('/')][item].content !== undefined ? fileIcon : folderIcon} {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div>
          <Button onClick={() => handleCreate('file')}>Create File</Button>
          <Button onClick={() => handleCreate('folder')} className="ml-2">Create Folder</Button>
        </div>
      </div>
      
      {openItem && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{path.join('/')}/{openItem}</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                className="w-full h-40 p-2 border rounded"
              />
            </CardContent>
          </Card>
          <Button onClick={handleSave} className="mt-2">Save</Button>
        </>
      )}
      
      <Dialog open={dialog.open} onOpenChange={() => setDialog({...dialog, open: !dialog.open})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog.type === 'file' ? 'Create File' : 'Create Folder'}</DialogTitle>
          </DialogHeader>
          <Input 
            autoFocus 
            onKeyDown={(e) => e.key === 'Enter' && handleDialogSubmit(e.target.value)}
            placeholder={`Enter ${dialog.type} name`} 
          />
          <DialogFooter>
            <Button type="submit" onClick={() => handleDialogSubmit(document.activeElement.value)}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Breadcrumb = ({ path, setPath }) => (
  <div className="flex">
    {path.map((crumb, index) => (
      <React.Fragment key={crumb}>
        <Button variant="link" onClick={() => setPath(path.slice(0, index + 1))}>{crumb}</Button>
        {index < path.length - 1 && <span className="px-2">/</span>}
      </React.Fragment>
    ))}
  </div>
);

export default function App() {
  return <FileExplorer />;
}