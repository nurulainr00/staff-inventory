import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonIcon
} from "@ionic/react";
import { warningOutline } from "ionicons/icons";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import "./form.css";


const LOW_STOCK_THRESHOLD = 4; // 🔹 You can change this
const ITEMS_PER_PAGE = 5; // 🔹 Show 5 items per page

const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [inputId, setInputId] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "inventory"), (snapshot) => {
      setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // 🔹 Reduce stock by 1
  const reduceStock = async (id: string) => {
    try {
      const itemRef = doc(db, "inventory", id);
      const item = items.find((i) => i.id === id);
      if (item && item.qty > 0) {
        await updateDoc(itemRef, { qty: item.qty - 1 });
        console.log(`Reduced stock for ${id}`);
      } else {
        alert("Stock already 0!");
      }
    } catch (err) {
      console.error("Error reducing stock:", err);
    }
  };

  // 🔹 Manual reduce via input ID
  const handleManualReduce = () => {
    if (!inputId.trim()) return;
    reduceStock(inputId.trim());
    setInputId("");
  };

  // 🔹 Pagination logic
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <IonPage>
      <IonContent className="ion-padding ion-text-center">
        {/* Logo + Title */}
        <img
          src="/assets/avant.jpg"
          alt="App Logo"
          style={{ width: 100, marginTop: 20 }}
        />
        <h1 style={{ marginTop: 10, fontWeight: "bold" }}>
          Smart Inventory App
        </h1>

        <h2>Inventory List</h2>

        {/* Input box for manual ID entry 
        <IonItem style={{ marginTop: 30 }}>
          <IonInput
            placeholder="Enter Item ID"
            value={inputId}
            onIonChange={(e) => setInputId(e.detail.value!)}
          />
          <IonButton onClick={handleManualReduce}>Reduce</IonButton>
        </IonItem>*/}

        {/* Inventory list with pagination */}
        <IonList>
          {paginatedItems.map((item) => (
            <IonItem key={item.id}>
              <IonLabel>
                <h3>{item.item}</h3>
                <p>Qty: {item.qty}</p>
                <p>ID: {item.id}</p>
              </IonLabel>
                {/* 🔹 Show warning if below threshold */}
              {item.qty < LOW_STOCK_THRESHOLD && (
                <IonIcon
                  icon={warningOutline}
                  color="danger"
                  style={{ fontSize: "24px", marginLeft: "10px" }}
                />
              )}
            </IonItem>
          ))}
        </IonList>

        {/* Pagination controls */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <IonButton
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ⬅ Prev
          </IonButton>
          <p style={{ margin: "10px 20px", fontWeight: "bold" }}>
            Page {currentPage} of {totalPages}
          </p>
          <IonButton
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next ➡
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default InventoryPage;
