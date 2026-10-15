import { auth, db } from "./firebase.js";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const container = document.getElementById("orders");

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "/login";
    return;
  }

  const q = query(
    collection(db, "orders"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, snapshot => {
    container.innerHTML = "";

    if (snapshot.empty) {
      container.innerHTML = "<p>Belum ada pesanan.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const order = doc.data();
      const card = document.createElement("div");
      card.className = "order-card";
      card.innerHTML = `
        <h3>${order.product}</h3>
        <p>Harga: <strong>Rp${Number(order.price).toLocaleString("id-ID")}</strong></p>
        <p>Pembayaran: <span class="status ${order.paymentStatus}">${order.paymentStatus}</span></p>
        <p>Status: <span class="status ${order.orderStatus}">${order.orderStatus}</span></p>
      `;
      container.appendChild(card);
    });
  }, err => {
    container.innerHTML = `<p>Error: ${err.message}</p>`;
  });
});
