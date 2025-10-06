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
  IonIcon
} from "@ionic/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useHistory } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      history.push("/TabsLayout/inventory"); // redirect after login
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding ion-text-center">
        {/* Logo */}
        <img
          src="/assets/avant.jpg"
          alt="App Logo"
          style={{ width: 120, marginTop: 40 }}
        />

        {/* Project Title */}
        <h1 style={{ marginTop: 20, fontWeight: "bold", color: "#ece9e9ff" }}>
          Smart Inventory App
        </h1>

        {/* Login Form */}
        <div style={{ marginTop: 70 }}>
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
              type="email"
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
              type={showPassword ? "text" : "password"}
              required
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
            onClick={handleLogin}
            style={{ marginTop: 30 }}
          >
            Login
          </IonButton>
        </div>

        {/* Error Toast */}
        <IonToast
          isOpen={!!error}
          message={error}
          duration={2000}
          color="danger"
          onDidDismiss={() => setError("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
