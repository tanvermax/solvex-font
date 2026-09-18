import Logo from "@/assets/icons/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { useSendOtpMutation, useVerifyOtpMutation } from "@/redux/features/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dot } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useLocation, useNavigate } from "react-router"
import { toast } from "sonner";
import z from "zod";

export default function Veryfy() {
    const location = useLocation();
    const [email] = useState(location.state)
    const [timer, setTimer] = useState(120)
    const [confirm, setConfirm] = useState(false);
    const [sendOtp] = useSendOtpMutation();
    const [verifyOtp] = useVerifyOtpMutation();

    const FormSchema = z.object({
        pin: z.string().min(6, {
            message: "Your one-time password must be 6 characters.",
        }),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema) as any,
        defaultValues: {
            pin: "",
        },
    })
    // console.log(location.state)

    const navigate = useNavigate();
    useEffect(() => {
        if (!email) {
            navigate("/login")
        }

    }, [email, navigate])




    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const toastId = toast.loading("Verifying OTP...");

        const userInfo = {
            email,
            otp: data.pin
        }
        try {
            const res = await verifyOtp(userInfo).unwrap();
            console.log(res.success)
            if (res.success) {
                navigate("/")
                console.log("OTP Verifyed successfully")

                toast.success("OTP Verifyed successfully", { id: toastId });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSendOtp = async () => {

        try {
            const res = await sendOtp({ email: email }).unwrap();
            console.log(res.success)
            if (res.success) {
                toast.success("OTP sent successfully to your email");
                setConfirm(true);
                setTimer(120)
            }
        } catch (error) {
            console.log(error)
        }

    }
    useEffect(() => {

        const timerId = setInterval(() => {
            if (email && confirm) {
                setTimer((prev) => (prev > 0 ? prev - 1 : 0))

            }
        }, 1000);
        return () => clearInterval(timerId)
    }, [email, confirm]);


    return (
        <div className="grid place-content-center rounded-3xl h-screen">
            {
                confirm ? (<Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Verify you email address</CardTitle>
                       

                        <CardDescription>
                            Please enter the 6 digit code we sent to <br /> {email}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                id="ottform" onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
                                <FormField
                                    control={form.control}
                                    name="pin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>One-Time Password</FormLabel>
                                            <FormControl>
                                                <InputOTP maxLength={6} {...field}>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                    </InputOTPGroup>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={1} />
                                                    </InputOTPGroup>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={2} />
                                                    </InputOTPGroup>
                                                    <Dot />
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={3} />
                                                    </InputOTPGroup>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={4} />
                                                    </InputOTPGroup>
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormDescription >
                                                <Button onClick={handleSendOtp}
                                                    type="button"
                                                    variant="link"
                                                    className={cn("p-0 m-0 ", {
                                                        "cursor-pointer": timer === 0,
                                                        "text-gray-500 ": timer !== 0
                                                    })}
                                                    disabled={timer !== 0}
                                                >Resend OTP :{" "} </Button>
                                                {" "}{timer}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button form="ottform" type="submit">Submit OTP</Button>
                    </CardFooter>
                </Card>) : (<Card className="rounded-2xl p-5">
                    <CardHeader>
                        <Logo/>
                        <CardTitle className="text-xl">Verify you email address</CardTitle>
                        <CardDescription>
                            We will send  you an OTP at  <br /> {email}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button onClick={handleSendOtp} className="w-[300px]" type="submit">Confirm</Button>
                    </CardFooter>
                </Card>)
            }

        </div>
    )
}