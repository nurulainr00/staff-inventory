import React from "react";
import {
  IonTabs, IonRouterOutlet, IonTabBar, IonTabButton,
  IonIcon, IonLabel
} from "@ionic/react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { list, remove, logOut } from "ionicons/icons";
import InventoryPage from "./inventory";
import TakeOutPage from "./takeOut";
import BarcodeScannerPage from "./BarcodeScannerPage";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";


const TabsLayout: React.FC = () => {
  const history = useHistory();

  const handleLogout = async () => {
    await signOut(auth);
    history.push("/login");
  };
  
  const handleScan = async () => {
    // await signOut(auth);
    history.push("/TabsLayout/takeout");
    location.reload();
  };

  return (
    <IonTabs>
      <IonRouterOutlet>
        {/* Nested under /TabsLayout */}
        <Route exact path="/TabsLayout/inventory" component={InventoryPage} />
        <Route exact path="/TabsLayout/takeOut" component={TakeOutPage} />
        <Route exact path="/TabsLayout/BarcodeScannerPage" component={BarcodeScannerPage} />


        {/* Default tab → go to inventory */}
        <Redirect exact from="/TabsLayout" to="/TabsLayout/inventory" />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="inventory" href="/TabsLayout/inventory">
          <IonIcon icon={list} />
          <IonLabel>Inventory</IonLabel>
        </IonTabButton>

        <IonTabButton tab="takeout" onClick={handleScan}>
          <IonIcon icon={remove} />
          <IonLabel>Scan</IonLabel>
        </IonTabButton>

        <IonTabButton tab="logout" onClick={handleLogout}>
          <IonIcon icon={logOut} />
          <IonLabel>Logout</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabsLayout;
