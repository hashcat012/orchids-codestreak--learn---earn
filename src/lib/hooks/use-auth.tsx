"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User,
  signOut as firebaseSignOut
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  coins: number;
  lastClaimed: string | null;
  isAdmin: boolean;
    languageProgress: Record<string, string[]>;
    selectedLanguage: string | null;
  }
  
  const LANGUAGES_LIST = [
    "JavaScript", "Python", "HTML", "TypeScript", "Java", "C", "C++", "C#", 
    "CSS", "SQL", "React", "Go", "Rust", "PHP", "Bash", "Next.js"
  ];
  
  interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      let unsubProfile: (() => void) | null = null;
      
      const timeoutId = setTimeout(() => {
        if (loading) {
          setError("Connection timeout. Please check your internet or Firebase rules.");
          setLoading(false);
        }
      }, 8000);

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        setError(null);
        
        if (unsubProfile) {
          unsubProfile();
          unsubProfile = null;
        }

        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          
            unsubProfile = onSnapshot(userDocRef, async (docSnap) => {
              clearTimeout(timeoutId);
              try {
                  if (docSnap.exists()) {
                    const rawData = docSnap.data();
                    const isAdmin = rawData.email === "erenalmali@icloud.com" || !!rawData.isAdmin;
                    
                    // Migrate old unlockedLevels if exists
                      const legacyLevels = Array.isArray(rawData.unlockedLevels) ? rawData.unlockedLevels : ["start"];
                      const currentLang = rawData.selectedLanguage || "JavaScript";
                      const languageProgress = rawData.languageProgress || { [currentLang]: legacyLevels };

                      // Ensure all languages exist in progress
                      LANGUAGES_LIST.forEach(lang => {
                        if (!languageProgress[lang]) {
                          languageProgress[lang] = ["start"];
                        }
                      });

                        const data: UserProfile = {
                        uid: rawData.uid || user.uid,
                        email: rawData.email || user.email,
                        displayName: rawData.displayName || user.displayName,
                        coins: isAdmin ? 999999 : (typeof rawData.coins === 'number' ? rawData.coins : 0),
                        lastClaimed: rawData.lastClaimed || null,
                        isAdmin: isAdmin,
                        languageProgress: languageProgress,
                        selectedLanguage: rawData.selectedLanguage || null,
                      };

                    const today = new Date().toISOString().split('T')[0];
                    
                    if (data.lastClaimed !== today && !data.isAdmin) {
                      await updateDoc(userDocRef, {
                        coins: 5,
                        lastClaimed: today
                      });
                    }
                    setProfile(data);
                    setError(null);
                  } else {

                  const isAdmin = user.email === "erenalmali@icloud.com";
                  const initialProgress: Record<string, string[]> = {};
                  LANGUAGES_LIST.forEach(lang => {
                    initialProgress[lang] = ["start"];
                  });

                  const initialProfile: UserProfile = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    coins: isAdmin ? 999999 : 5,
                    lastClaimed: new Date().toISOString().split('T')[0],
                    isAdmin: isAdmin,
                    languageProgress: initialProgress,
                    selectedLanguage: null,
                  };
                await setDoc(userDocRef, initialProfile);
                setProfile(initialProfile);
                setError(null);
              }
            } catch (err: any) {
              console.error("Profile sync error:", err);
              if (err.code === "permission-denied") {
                setError("Firestore Permission Denied. Please check your Security Rules.");
              }
            } finally {
              setLoading(false);
            }
          }, (err: any) => {
            console.error("Firestore Snapshot error:", err);
            clearTimeout(timeoutId);
            if (err.code === "permission-denied") {
              setError("Firestore Permission Denied. Please check your Security Rules.");
            } else {
              setError(err.message);
            }
            setLoading(false);
          });
        } else {
          clearTimeout(timeoutId);
          setProfile(null);
          setLoading(false);
        }
      });

      return () => {
        unsubscribe();
        if (unsubProfile) unsubProfile();
        clearTimeout(timeoutId);
      };
    }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
