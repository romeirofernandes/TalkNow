import React from "react";
import FormField from "./FormField";
import Password from "./Password";
import Loading from "./Loading";

const AuthForm = ({
  isSignIn,
  setIsSignIn,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  togglePasswordVisibility,
  handleSignIn,
  handleSignUp,
  loading,
  error,
  setIsHovering,
  navigate,
}) => {
  return (
    <div className="bg-black/60 backdrop-blur-md border border-gray-800 p-8 rounded-xl shadow-2xl">
      <div className="mb-6 text-center">
        <h2
          className="text-2xl font-bold mb-1 text-white tracking-tight"
          style={{
            fontFamily: "Bricolage Grotesque, system-ui, sans-serif",
          }}
        >
          {isSignIn ? "Welcome Back" : "Create Account"}
        </h2>
        <p
          className="text-gray-400 text-sm"
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 300,
            lineHeight: 1.5,
          }}
        >
          {isSignIn
            ? "Sign in to continue to TalkNow"
            : "Join the real-time communication platform"}
        </p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-200 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <form className="space-y-4">
        {!isSignIn && (
          <FormField
            id="username"
            label="Username"
            type="text"
            placeholder="YourUsername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPassword={showPassword}
          toggleVisibility={togglePasswordVisibility}
        />

        <button
          onClick={isSignIn ? handleSignIn : handleSignUp}
          disabled={loading}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="w-full bg-gradient-to-r from-indigo-500/90 to-violet-500/90 
            hover:from-indigo-600/90 hover:to-violet-600/90 text-white py-2.5 
            rounded-lg text-sm font-medium transition-all duration-300 
            transform hover:scale-[1.02] shadow-md mt-2 cursor-pointer"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          {loading ? (
            <Loading
              text={isSignIn ? "Signing in..." : "Creating account..."}
            />
          ) : (
            <span>{isSignIn ? "Sign In" : "Sign Up"}</span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsSignIn(!isSignIn)}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
        >
          {isSignIn
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
