import { firestore } from "./firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

// Referencias a colecciones
const collectionRefA = collection(firestore, "autos");
const collectionRefC = collection(firestore, "choferes");
const collectionRefAlquileres = collection(firestore, "alquileres");
const collectionRefPagos = collection(firestore, "pagos");


// Métodos para autos
export const addAuto = async (auto) => {
    return await addDoc(collectionRefA, auto);
};

export const getAllAutos = async () => {
    const snapshot = await getDocs(collectionRefA);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateAutos = async (id, updatedAuto) => {
    const autoDoc = doc(firestore, 'autos', id);
    return await updateDoc(autoDoc, updatedAuto);
};

export const deleteAutos = async (id) => {
    const autoDoc = doc(firestore, 'autos', id);
    return await deleteDoc(autoDoc);
};
export const subscribeToAutos = (callback) => {
    return onSnapshot(collectionRefA, (snapshot) => {
        const autos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(autos);
    });
};



// Métodos para choferes
export const addChofer = async (chofer) => {
    return await addDoc(collectionRefC, chofer);
};

export const getAllChoferes = async () => {
    const snapshot = await getDocs(collectionRefC);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateChoferes = async (id, updatedChofer) => {
    const choferDoc = doc(firestore, 'choferes', id);
    return await updateDoc(choferDoc, updatedChofer);
};

export const deleteChoferes = async (id) => {
    const choferDoc = doc(firestore, 'choferes', id);
    return await deleteDoc(choferDoc);
};

export const subscribeToChoferes = (callback) => {
    return onSnapshot(collectionRefC, (snapshot) => {
        const choferes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(choferes);
    });
};




// Métodos para alquileres
export const addAlquiler = async (alquiler) => {
    return await addDoc(collectionRefAlquileres, alquiler);
};

export const getAllAlquileres = async () => {
    const snapshot = await getDocs(collectionRefAlquileres);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateAlquiler = async (id, updatedAlquiler) => {
    const alquilerDoc = doc(firestore, 'alquileres', id);
    return await updateDoc(alquilerDoc, updatedAlquiler);
};

export const deleteAlquiler = async (id) => {
    const alquilerDoc = doc(firestore, 'alquileres', id);
    return await deleteDoc(alquilerDoc);
};

export const subscribeToAlquileres = (callback) => {
    return onSnapshot(collectionRefAlquileres, (snapshot) => {
        const alquileres = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(alquileres);
    });
};


//Métodos para pagos
export const addPagos = async (pago) => {
    return await addDoc(collectionRefPagos, pago);
};

export const getAllPagos = async () => {
    const snapshot = await getDocs(collectionRefPagos);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updatePagos = async (id, updatedPago) => {
    const pagoDoc = doc(firestore, 'pagos', id);
    return await updateDoc(pagoDoc, updatedPago);
};

export const deletePagos = async (id) => {
    const pagoDoc = doc(firestore, 'pagos', id);
    return await deleteDoc(pagoDoc);
};

export const subscribeToPagos = (callback) => {
    return onSnapshot(collectionRefPagos, (snapshot) => {
        const pagos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(pagos);
    });
};
