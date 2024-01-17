const constants = {
    baseUrl : 'https://secret-app-backend-0bqg.onrender.com',
    config: {
        headers:{
            "Content-Type":"application/json",
        },
    },
    tokenHeader: {
        headers:{
            "Content-Type":"application/json",
            Authorization: localStorage.getItem("jwt"),
        },
    }
};
export default constants;