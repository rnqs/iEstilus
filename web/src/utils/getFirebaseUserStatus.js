import firebaseAuth from "./firebaseAuth";

const getFirebaseUserStatus = () => {
  return new Promise((resolve, reject) => {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user.uid);
      } else {
        reject(Error("It broke"));
      }
    });
  });
};

export default getFirebaseUserStatus;
