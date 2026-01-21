"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export function CloseAdminConsole() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    // when i click this close icon button , it should open a dialog to confirm closing the admin console. after confirming, it should redirect to the /dashboard page
    return (
        <>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>

                <span className="sr-only">Close Admin Console</span>
                ✕
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Close Admin Console</DialogTitle>
                    </DialogHeader>
                    <div className="py-2">
                        <p className="text-sm text-muted-foreground">Are you sure you want to close the admin console? You will be redirected to the dashboard.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button variant="destructive"
                            onClick={() => {
                                setIsOpen(false);
                                window.location.href = "/dashboard";
                                // router.refresh();
                                // router.push("/dashboard");
                            }}>
                            Close Console
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

