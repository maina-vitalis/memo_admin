"use client";

import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {LoginForm} from "@/features/auth/login/components/login-form";
import {useAuth} from "@/features/auth/hooks/use-auth";
import {getPostLoginPath} from "@/features/auth/types";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";

const PLATFORM_NAME = "NostalQic";

/**
 * The main login card displayed on the /login page.
 *
 * Orchestrates:
 * 1. The unified credential form
 * 2. Redirect when the user is already authenticated
 */
export function
LoginCard() {
    const router = useRouter();
    const {hydrated, role, isAuthenticated} = useAuth();

    // Redirect already-authenticated users to their respective dashboard
    useEffect(() => {
        if (!hydrated || !isAuthenticated || !role) return;
        router.replace(getPostLoginPath(role));
    }, [hydrated, isAuthenticated, role, router]);

    return (
        <Card
            className="w-full max-w-[440px] rounded-xl border-border/80 shadow-[0px_8px_24px_-4px_rgba(0,0,0,0.08),0px_2px_4px_-2px_rgba(0,0,0,0.04)]">
            <CardContent className="pt-8">
                {/* Header */}
                <div className="mb-6 flex flex-col items-center text-center">
                    <h1 className="mb-3 text-[32px] leading-10 font-semibold tracking-tight text-primary-container">
                        {PLATFORM_NAME}
                    </h1>
                    <h2 className="mb-1 text-xl leading-7 font-semibold text-foreground">
                        Sign in to your portal
                    </h2>
                    <p className="text-sm leading-5 text-muted-foreground">
                        Enter your credentials to continue
                    </p>
                </div>

                {/* Credential form */}
                <LoginForm/>
            </CardContent>

            <CardFooter className="flex-col gap-0 border-t pt-6 pb-8">
                <Separator className="mb-6"/>
                <p className="text-center text-sm leading-5 text-muted-foreground">
                    First time here?{" "}
                    <span className="font-medium text-foreground">
            Use the setup link from your invitation email
          </span>{" "}
                    to create your password.
                </p>
            </CardFooter>
        </Card>
    );
}

