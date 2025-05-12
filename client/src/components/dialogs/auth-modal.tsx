import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "login" | "signup";
  userType: "user" | "admin";
  onSwitchType: (userType: "user" | "admin") => void;
}

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

const signupSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  dob: z.string().refine((val) => {
    const date = new Date(val);
    const today = new Date();
    const minAge = new Date();
    minAge.setFullYear(today.getFullYear() - 13); // Require 13+ years old
    return date <= minAge;
  }, "You must be at least 13 years old"),
  address: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  pincode: z.string().min(5, "Pincode must be at least 5 characters"),
  secretCode: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  type,
  userType,
  onSwitchType,
}) => {
  const { login, register, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Login form setup
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Signup form setup
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      dob: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      secretCode: "",
      termsAccepted: false,
    },
  });

  // Handle login form submission
  const onLoginSubmit = async (values: LoginFormValues) => {
    setError(null);
    console.log("Auth modal: Attempting login with", { 
      email: values.email, 
      role: userType 
    });
    
    try {
      const result = await login({
        email: values.email,
        password: values.password,
        role: userType,
      });
      
      console.log("Auth modal: Login successful", { 
        userId: result?.id, 
        role: result?.role 
      });
      
      onClose();
      loginForm.reset();
    } catch (err: any) {
      console.error("Auth modal: Login error", err);
      setError(err.message || "Failed to login. Please try again.");
    }
  };

  // Handle signup form submission
  const onSignupSubmit = async (values: SignupFormValues) => {
    setError(null);
    console.log("Auth modal: Attempting signup with", { 
      email: values.email, 
      role: userType,
      city: values.city
    });
    
    try {
      const { confirmPassword, termsAccepted, ...registerData } = values;
      
      const result = await register({
        ...registerData,
        role: userType,
      });
      
      console.log("Auth modal: Registration successful", { 
        userId: result?.id, 
        role: result?.role 
      });
      
      onClose();
      signupForm.reset();
    } catch (err: any) {
      console.error("Auth modal: Registration error", err);
      setError(err.message || "Failed to register. Please try again.");
    }
  };

  // Handle modal close
  const handleClose = () => {
    setError(null);
    loginForm.reset();
    signupForm.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {type === "login" ? "Login" : "Sign Up"}
            {userType === "admin" && " as Admin"}
          </DialogTitle>
        </DialogHeader>

        {/* Error message */}
        {error && (
          <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        {/* Login Form */}
        {type === "login" && (
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={loginForm.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <a
                  href="#"
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <span>Don't have an account?</span>
                <button
                  type="button"
                  onClick={() => onSwitchType(userType)}
                  className="text-primary hover:text-primary-dark font-medium ml-1"
                >
                  Sign up
                </button>
              </div>

              {userType === "user" && (
                <div className="text-center text-sm text-gray-600 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => onSwitchType("admin")}
                    className="text-secondary hover:text-secondary-dark font-medium"
                  >
                    Login as Admin
                  </button>
                </div>
              )}

              {userType === "admin" && (
                <div className="text-center text-sm text-gray-600 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => onSwitchType("user")}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Login as User
                  </button>
                </div>
              )}
            </form>
          </Form>
        )}

        {/* Signup Form */}
        {type === "signup" && (
          <Form {...signupForm}>
            <form
              onSubmit={signupForm.handleSubmit(onSignupSubmit)}
              className="space-y-4 max-h-[65vh] overflow-y-auto pr-4"
            >
              <FormField
                control={signupForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={signupForm.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={signupForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={signupForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input placeholder="123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {userType === "admin" && (
                <FormField
                  control={signupForm.control}
                  name="secretCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Secret Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter secret code"
                          {...field}
                          required
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-1">
                        This code is provided by the system manager.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={signupForm.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-primary hover:text-primary-dark"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-primary hover:text-primary-dark"
                        >
                          Privacy Policy
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <span>Already have an account?</span>
                <button
                  type="button"
                  onClick={() => onSwitchType(userType)}
                  className="text-primary hover:text-primary-dark font-medium ml-1"
                >
                  Login
                </button>
              </div>

              {userType === "user" && (
                <div className="text-center text-sm text-gray-600 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      signupForm.reset();
                      onSwitchType("admin");
                    }}
                    className="text-secondary hover:text-secondary-dark font-medium"
                  >
                    Sign up as Admin
                  </button>
                </div>
              )}

              {userType === "admin" && (
                <div className="text-center text-sm text-gray-600 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      signupForm.reset();
                      onSwitchType("user");
                    }}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Sign up as User
                  </button>
                </div>
              )}
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
