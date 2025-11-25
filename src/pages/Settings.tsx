import { useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Farmer',
    email: 'john@farm.ma',
    phone: '+212 6XX XXX XXX',
    language: 'en',
    moistureThreshold: '30',
    tempThreshold: '35',
    emailAlerts: true,
    smsAlerts: false,
    criticalOnly: false,
  });

  const handleSave = () => {
    // TODO: Save to API/localStorage
    console.log('Settings saved:', formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {saved && (
            <Alert className="border-chart-1 bg-chart-1/10">
              <CheckCircle2 className="h-4 w-4 text-chart-1" />
              <AlertDescription className="text-chart-1">
                Settings saved successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={formData.language} 
                    onValueChange={(value) => handleChange('language', value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Alert Thresholds */}
            <Card>
              <CardHeader>
                <CardTitle>Alert Thresholds</CardTitle>
                <CardDescription>Customize when you receive alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="moisture">
                    Soil Moisture Alert Below (%)
                  </Label>
                  <Input 
                    id="moisture" 
                    type="number"
                    min="0"
                    max="100"
                    value={formData.moistureThreshold}
                    onChange={(e) => handleChange('moistureThreshold', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Alert when soil moisture drops below this level
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temp">
                    Temperature Alert Above (°C)
                  </Label>
                  <Input 
                    id="temp" 
                    type="number"
                    min="0"
                    max="50"
                    value={formData.tempThreshold}
                    onChange={(e) => handleChange('tempThreshold', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Alert when temperature exceeds this threshold
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-alerts">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts via email
                    </p>
                  </div>
                  <Switch 
                    id="email-alerts"
                    checked={formData.emailAlerts}
                    onCheckedChange={(checked) => handleChange('emailAlerts', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-alerts">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts via SMS (coming soon)
                    </p>
                  </div>
                  <Switch 
                    id="sms-alerts"
                    checked={formData.smsAlerts}
                    onCheckedChange={(checked) => handleChange('smsAlerts', checked)}
                    disabled
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="critical-only">Critical Alerts Only</Label>
                    <p className="text-sm text-muted-foreground">
                      Only receive notifications for critical issues
                    </p>
                  </div>
                  <Switch 
                    id="critical-only"
                    checked={formData.criticalOnly}
                    onCheckedChange={(checked) => handleChange('criticalOnly', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg">
              Save Changes
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}