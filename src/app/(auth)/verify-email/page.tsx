//src/app/(auth)/verify-email/page.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Home, Mail, Search } from "lucide-react";
import Link from "next/link";

const Verify = () => {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen w-full p-4">
        <Card className="w-[450px] border-t-4 border-t-blue-500 shadow-lg">
          <CardHeader className="flex flex-col items-center pt-8">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Mail className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-center">
              Verify your email
            </h1>
            <p className="text-gray-500 text-center mt-2">
              We&apos;ve sent a verification link to your email address.
            </p>
            {/* <p className="font-medium text-blue-600 mt-1">email</p> */}
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert className="bg-amber-50 border-amber-200">
              <Search className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800 font-medium">
                Can&apos;t find the email?
              </AlertTitle>
              <AlertDescription className="text-amber-700">
                Please check your spam or junk folders. Email providers
                sometimes misidentify our messages as spam.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="font-medium">Next steps:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Click the verification link in your email</li>
                <li>You&apos;ll be redirected back to complete setup</li>
                <li>Start using VriddhiBook accounting services</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Link
              href="/"
              className={buttonVariants({
                className: "w-full",
                variant: "outline",
              })}
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Homepage
            </Link>

            <p className="text-center text-sm text-gray-500 pt-2">
              Need help? Contact{" "}
              <Link href="/support" className="text-blue-600 hover:underline">
                support
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Verify;
