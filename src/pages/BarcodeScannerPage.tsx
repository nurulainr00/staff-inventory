import React, { useState } from "react";
import { IonPage, IonContent, IonButton, IonText } from "@ionic/react";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";

const BarcodeScannerPage: React.FC = () => {
  const [scannedData, setScannedData] = useState("");

  const startScan = async () => {
    await BarcodeScanner.checkPermission({ force: true });

    document.body.style.background = "transparent"; // make background clear
    await BarcodeScanner.hideBackground();

    const result = await BarcodeScanner.startScan(); // start scanning
    if (result.hasContent) {
      setScannedData(result.content); // scanned text
    }

    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Scan Barcode</h2>
        <IonButton onClick={startScan}>Start Scanner</IonButton>
        {scannedData && (
          <IonText>
            <p>Scanned Result: {scannedData}</p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BarcodeScannerPage;
