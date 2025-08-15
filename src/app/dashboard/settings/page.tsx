
"use client";

import { SettingsForm } from "@/components/settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cog, Bell, KeyRound } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/auth-context";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChangePasswordForm } from "@/components/change-password-form";

export default function SettingsPage() {
    const { t } = useLanguage();
    const { user } = useAuth();
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg">
                    <Cog className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-headline">{t('dashboard.settings.title')}</h1>
                    <p className="text-muted-foreground">{t('dashboard.settings.subtitle')}</p>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>{t('dashboard.settings.artisanProfile')}</CardTitle>
                    <CardDescription>{t('dashboard.settings.profileDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingsForm />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your login and password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={user?.email || ''} disabled />
                   </div>
                   <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">Change Password</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Change Password</DialogTitle>
                                    <DialogDescription>Enter a new password for your account.</DialogDescription>
                                </DialogHeader>
                                <ChangePasswordForm />
                            </DialogContent>
                        </Dialog>
                   </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage how you receive notifications from us.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <Label htmlFor="email-notifications" className="font-semibold">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive emails about new sales, messages, and features.</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                   </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                        <div>
                            <Label htmlFor="push-notifications" className="font-semibold">Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive push notifications on your devices (Coming soon).</p>
                        </div>
                        <Switch id="push-notifications" disabled />
                   </div>
                </CardContent>
            </Card>
        </div>
    );
}
