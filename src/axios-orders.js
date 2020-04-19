import axios from "axios";

//here is logic for creating axios instacne and global configuration of it which can be used for AJAX calls inside Burger King app
const instance = axios.create({
  baseURL: "https://react-my-burger-7cb97.firebaseio.com/",
});

export default instance;
