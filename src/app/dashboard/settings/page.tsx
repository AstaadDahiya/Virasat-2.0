
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
                    <h1 className="text-3xl font-bold font-headline">{t('settingsTitle')}</h1>
                    <p className="text-muted-foreground">{t('settingsSubtitle')}</p>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>{t('artisanProfile')}</CardTitle>
                    <CardDescription>{t('artisanProfileDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingsForm />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('accountSettings')}</CardTitle>
                    <CardDescription>{t('accountSettingsDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="space-y-2">
                        <Label htmlFor="email">{t('emailLabel')}</Label>
                        <Input id="email" type="email" value={user?.email || ''} disabled />
                   </div>
                   <div className="space-y-2">
                        <Label htmlFor="password">{t('passwordLabel')}</Label>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">{t('changePassword')}</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>{t('changePassword')}</DialogTitle>
                                    <DialogDescription>{t('changePasswordDescription')}</DialogDescription>
                                </DialogHeader>
                                <ChangePasswordForm />
                            </DialogContent>
                        </Dialog>
                   </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>{t('notifications')}</CardTitle>
                    <CardDescription>{t('notificationsDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <Label htmlFor="email-notifications" className="font-semibold">{t('notificationEmailLabel')}</Label>
                            <p className="text-sm text-muted-foreground">{t('notificationEmailDescription')}</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                   </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                        <div>
                            <Label htmlFor="push-notifications" className="font-semibold">{t('notificationPushLabel')}</Label>
                            <p className="text-sm text-muted-foreground">{t('notificationPushDescription')}</p>
                        </div>
                        <Switch id="push-notifications" disabled />
                   </div>
                </CardContent>
            </Card>
        </div>
    );
}
