// Create /src/services/authService.ts
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import type { LoginCredentials, SignupCredentials, UserProfile } from "../types/user";

class AuthService {
  private googleProvider: GoogleAuthProvider;

  constructor() {
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  }

  // Email/Password Login
  async loginWithEmail(credentials: LoginCredentials): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      
      await this.updateUserLastLogin(userCredential.user.uid);
      return this.mapFirebaseUserToProfile(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Email/Password Signup
  async signupWithEmail(credentials: SignupCredentials): Promise<UserProfile> {
    try {
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (credentials.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: credentials.displayName
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Create user document in Firestore
      await this.createUserDocument(userCredential.user, credentials.displayName);

      return this.mapFirebaseUserToProfile(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Google Authentication
  async loginWithGoogle(): Promise<UserProfile> {
    try {
      const userCredential = await signInWithPopup(auth, this.googleProvider);
      
      // Check if user document exists, create if not
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists()) {
        await this.createUserDocument(
          userCredential.user, 
          userCredential.user.displayName || "User"
        );
      } else {
        await this.updateUserLastLogin(userCredential.user.uid);
      }

      return this.mapFirebaseUserToProfile(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Password Reset
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Resend Email Verification
  async resendVerificationEmail(): Promise<void> {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      } else {
        throw new Error("No user is currently logged in");
      }
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Create user document in Firestore
  private async createUserDocument(user: User, displayName: string): Promise<void> {
    const userRef = doc(db, "users", user.uid);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      role: "user" // Default role
    };

    await setDoc(userRef, userData);
  }

  // Update user last login
  private async updateUserLastLogin(uid: string): Promise<void> {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      lastLoginAt: new Date().toISOString()
    }, { merge: true });
  }

  // Map Firebase User to UserProfile
  private mapFirebaseUserToProfile(user: User): UserProfile {
    return {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      createdAt: "", // Will be fetched from Firestore if needed
      lastLoginAt: new Date().toISOString()
    };
  }

  // Handle authentication errors
  private handleAuthError(error: any): Error {
    let message = "An unexpected error occurred";

    switch (error.code) {
      case "auth/user-not-found":
        message = "No account found with this email address";
        break;
      case "auth/wrong-password":
        message = "Incorrect password";
        break;
      case "auth/email-already-in-use":
        message = "An account with this email already exists";
        break;
      case "auth/weak-password":
        message = "Password is too weak. Please choose a stronger password";
        break;
      case "auth/invalid-email":
        message = "Invalid email address";
        break;
      case "auth/user-disabled":
        message = "This account has been disabled";
        break;
      case "auth/too-many-requests":
        message = "Too many failed attempts. Please try again later";
        break;
      case "auth/popup-closed-by-user":
        message = "Sign-in popup was closed before completion";
        break;
      case "auth/cancelled-popup-request":
        message = "Sign-in was cancelled";
        break;
      default:
        message = error.message || message;
    }

    return new Error(message);
  }
}

export const authService = new AuthService();