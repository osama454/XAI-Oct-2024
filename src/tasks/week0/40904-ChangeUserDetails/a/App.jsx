import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/card";

export default function App() {
  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    currentPassword: "",
    newPassword: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (type) => {
    setDialogOpen(true);
  };

  const confirmAction = () => {
    console.log(`Confirmed action for ${activeTab} with data:`, formData);
    setDialogOpen(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 sm:mx-4">
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
          <CardDescription>Update your account information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="account" className="w-full">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <div className="space-y-4">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your Name" />
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" value={formData.username} onChange={handleInputChange} placeholder="username123" />
                <Button onClick={() => handleSave('account')}>Save Changes</Button>
              </div>
            </TabsContent>
            <TabsContent value="password">
              <div className="space-y-4">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} placeholder="Current Password" />
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} placeholder="New Password" />
                <Button onClick={() => handleSave('password')}>Change Password</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to update your {activeTab} details?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" onClick={confirmAction}>Confirm</Button>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}