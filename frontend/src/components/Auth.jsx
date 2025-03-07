import { useState, useEffect, useRef } from "react";
import supabase from "../config/supabase";
import { useNavigate } from "react-router-dom";
import BackgroundEffects from "./BackgroundEffects";
import AuthForm from "./AuthForm";
import Success from "./Success";
import Footer from "./Footer";

function Auth() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignIn, setIsSignIn] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserProfile(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserProfile(userId) {
    let { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userId)
      .single();

    if (data) {
      setUsername(data.username);
    }
    if (error) {
      console.error("Error fetching user profile:", error.message);
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password || !username) {
      setError("Username, email, and password are required");
      setLoading(false);
      return;
    }

    let { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;
    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: user.id, username }]);

      if (profileError) {
        setError(profileError.message);
      }
    }

    setLoading(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    fetchUserProfile(data.user.id);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUsername("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center"
    >
      <BackgroundEffects
        mousePosition={mousePosition}
        isHovering={isHovering}
      />

      <div className="max-w-lg mx-auto z-10 px-4 w-full">
        {!session ? (
          <AuthForm
            isSignIn={isSignIn}
            setIsSignIn={setIsSignIn}
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            handleSignIn={handleSignIn}
            handleSignUp={handleSignUp}
            loading={loading}
            error={error}
            setIsHovering={setIsHovering}
            navigate={navigate}
          />
        ) : (
          <Success
            username={username}
            handleSignOut={handleSignOut}
            navigate={navigate}
            setIsHovering={setIsHovering}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Auth;
