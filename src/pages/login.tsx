import React, { useState } from "react";
import { eye, eyeOff } from "ionicons/icons";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonLabel,
  IonItem,
  IonToast,
  IonIcon,
  IonText
} from "@ionic/react";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc, doc, getDoc, query, where } from "firebase/firestore";
import { useHistory } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true); // toggle between login/signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // only for signup
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const history = useHistory();

  // ===== Handle Login =====
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // ✅ Check if staff is activated
      const docRef = doc(db, "staff", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError("User data not found in database.");
        return;
      }

      if (!docSnap.data()?.active) {
        setError("Your account is not activated yet. Please wait for admin approval.");
        return;
      }

      // Login success
      history.push("/TabsLayout/inventory"); 
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ===== Handle Signup =====
  const handleSignUp = async () => {
  try {
    if (!name) throw new Error("Please enter your name");

    // 1️⃣ Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // 2️⃣ Save staff data in Firestore with UID as document ID
    await setDoc(doc(db, "staff", uid), {
      uid: uid,      // Firebase UID
      name,               // Staff full name
      email,              // Staff email
      role: "Staff",      // Role for permission
      active: false,      // Admin must approve
      createdAt: new Date()
    });

    // 3️⃣ Reset form & show success
    setSuccessMsg("Registration submitted! Waiting for admin approval.");
    setEmail(""); setPassword(""); setName("");
    setIsLogin(true); // switch back to login
  } catch (err: any) {
    setError(err.message);
  }
};

  return (
    <IonPage>
      <IonContent className="ion-padding ion-text-center">
        <img
          src="/assets/avant.jpg"
          alt="App Logo"
          style={{ width: 120, marginTop: 40 }}
        />
        <h1 style={{ marginTop: 20, fontWeight: "bold" }}>
          Smart Inventory App
        </h1>

        <div style={{ marginTop: 50 }}>
          {!isLogin && (
            <IonItem>
              <IonLabel position="floating">Full Name</IonLabel>
              <IonInput
                value={name}
                onIonChange={(e) => setName(e.detail.value!)}
              />
            </IonItem>
          )}

          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              type={showPassword ? "text" : "password"}
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
            />
            <IonButton
              fill="clear"
              slot="end"
              onClick={() => setShowPassword(!showPassword)}
            >
              <IonIcon icon={showPassword ? eyeOff : eye} />
            </IonButton>
          </IonItem>

          <IonButton
            expand="block"
            style={{ marginTop: 30 }}
            onClick={isLogin ? handleLogin : handleSignUp}
          >
            {isLogin ? "Login" : "Sign Up"}
          </IonButton>

          <IonText
            color="medium"
            style={{ display: "block", marginTop: 15, cursor: "pointer" }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </IonText>
        </div>

        {/* Error Toast */}
        <IonToast
          isOpen={!!error}
          message={error}
          duration={2000}
          color="danger"
          onDidDismiss={() => setError("")}
        />

        {/* Success Toast */}
        <IonToast
          isOpen={!!successMsg}
          message={successMsg}
          duration={2000}
          color="success"
          onDidDismiss={() => setSuccessMsg("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default AuthPage;
