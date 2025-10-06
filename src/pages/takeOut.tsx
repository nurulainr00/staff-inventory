import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { BrowserMultiFormatReader } from "@zxing/library";
import "./form.css"; // ✅ same styling used by Add Inventory

const TakeOut: React.FC = () => {
  const [itemData, setItemData] = useState<any>(null);
  const [takeQty, setTakeQty] = useState<number>(0);
  const [barcode, setBarcode] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // ✅ Scan barcode using webcam
  const handleStartScan = async () => {
    const codeReader = new BrowserMultiFormatReader();
    try {
      const devices = await codeReader.listVideoInputDevices();
      if (devices.length === 0) {
        setMessage("❌ No camera found");
        return;
      }

      await codeReader.decodeFromVideoDevice(
        devices[0].deviceId,
        "video",
        async (result, error) => {
          if (result) {
            codeReader.reset();
            setBarcode(result.getText());
            handleFetchItem(result.getText());
          }
        }
      );
    } catch (err) {
      console.error("Scan error:", err);
      setMessage("⚠️ Scan failed");
    }
  };

  // ✅ Upload barcode image instead of scanning
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = async () => {
        try {
          const codeReader = new BrowserMultiFormatReader();
          const result = await codeReader.decodeFromImage(img);
          setBarcode(result.getText());
          handleFetchItem(result.getText());
        } catch {
          setMessage("❌ No barcode detected in image");
        }
      };
    }
  };

  // ✅ Fetch Firestore item
  const handleFetchItem = async (barcode: string) => {
    try {
      const docRef = doc(db, "inventory", barcode.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setItemData({ id: docSnap.id, ...docSnap.data() });
        setTakeQty(0);
        setMessage("");
      } else {
        setItemData(null);
        setMessage("❌ Item not found in database");
      }
    } catch (error) {
      console.error("Error fetching item:", error);
      setMessage("⚠️ Error fetching item");
    }
  };

  // ✅ Reduce stock
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemData) return;

    if (takeQty <= 0) {
      setMessage("⚠️ Please enter a valid quantity");
      return;
    }
    if (takeQty > itemData.qty) {
      setMessage("⚠️ Not enough stock available");
      return;
    }

    try {
      const docRef = doc(db, "inventory", itemData.id);
      await updateDoc(docRef, { qty: itemData.qty - takeQty });
      setMessage("✅ Stock updated successfully!");
      setItemData(null);
      setBarcode("");
      setTakeQty(0);
    } catch (error) {
      console.error("Error updating stock:", error);
      setMessage("⚠️ Error updating stock");
    }
  };

  const handleClear = () => {
    setItemData(null);
    setBarcode("");
    setTakeQty(0);
    setMessage("");
  };

  return (
    <div className="form-container">
      {/* Logo + Title */}
        <img
          src="/assets/avant.jpg"
          alt="App Logo"
          style={{ width: 60, marginTop: 20 }}
        />
      <h2 className="form-title">Take Out Inventory</h2>

      <form onSubmit={handleConfirm}>
        <input
          type="text"
          placeholder="Scan/Enter Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />

        {itemData && (
          <>
            <input
              type="text"
              value={itemData.item || ""}
              disabled
              placeholder="Item Name"
            />

            <input
              type="text"
              value={`${itemData.qty}`}
              disabled
            />

            <input
              type="number"
              placeholder="Quantity to take out"
              value={takeQty}
              onChange={(e) => setTakeQty(Number(e.target.value))}
            />
          </>
        )}

        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            Take Out
          </button>
          <button type="button" className="btn-secondary" onClick={handleClear}>
            Clear Form
          </button>
        </div>
      </form>

      <div className="upload-section">
        <button onClick={handleStartScan} className="btn-scan">
          Start Scanning
        </button>
        <p>or Upload Barcode Image</p>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {message && <p className="message">{message}</p>}
      <video id="video" width="300" height="200" style={{ marginTop: "1rem" }} />
    </div>
  );
};

export default TakeOut;
