import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function App() {
  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState({
    name: '', username: '', currentPassword: '', newPassword: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (type) => {
    setDialogOpen(true);
    // Here you would typically send this data to a backend
    console.log(`Attempt to save ${type} changes with data:`, formData);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <div className="space-y-4">
                  <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
                  <Input label="Username" name="username" value={formData.username} onChange={handleChange} />
                  <Button onClick={() => handleSubmit('account')}>Save Changes</Button>
                </div>
              </TabsContent>
              <TabsContent value="password">
                <div className="space-y-4">
                  <Input label="Current Password" type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} />
                  <Input label="New Password" type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} />
                  <Button onClick={() => handleSubmit('password')}>Change Password</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to save these changes?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              console.log('Changes confirmed');
              setDialogOpen(false);
            }}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;