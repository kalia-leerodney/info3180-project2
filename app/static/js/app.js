/* Add your Application JavaScript */
// Instantiate our main Vue Instance
const app = Vue.createApp({
    data() {
        return {
            
        }
    }
});

app.component('app-header', {
    name: 'AppHeader',
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">United Auto Sales</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/register"> Register <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
          <router-link class="nav-link" to="/cars/new"> Add Car <span class="sr-only">(current)</span></router-link>
        </li>

        <li class="nav-item active">
          <router-link class="nav-link" to="/explore"> Explore <span class="sr-only">(current)</span></router-link>
        </li>
         
          <li v-if="!status_log" class="nav-item active">
            <router-link class="nav-link" to="/login">Login <span class="sr-only">(current)</span></router-link>
          </li>
          <li v-else class="nav-item active">
            <router-link class="nav-link" to="/logout">Logout <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `,

    computed: {
        status_log: function() {
            if (sessionStorage.getItem('token')) {
                return true;
            } else {
                return false;
            }
        }
    },

    methods: {
        profile: function(){ 
            //this.$router.push("/users/"+userid)
            location.reload();
        }
    },

    data: function(){
        return {
            c_user: 0
        }
    },

    created: function(){
        let self = this;
        fetch('/api/secure', {
            'headers': {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(function (response) {
                return response.json();
            }).then(function (response) {
                let result = response.data;
                //console.log("User ID retrieved");
                self.c_user = result.user.id;
                //return result.user.id;
            })
            .catch(function (error) {
                console.log(error);
            });
    }
});

app.component('app-footer', {
    name: 'AppFooter',
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
    data() {
        return {
            year: (new Date).getFullYear()
        }
    }
});

const Home = {
    name: 'Home',
    template: `
    <div class = 'home-page'>
        
        <div class = "middle">
            <h2> Buy and Sell Cars Online </h2>
            <p> United Auto Sales provides the fastest, easiest and most user friendly way to buy or sell cars online</p>

            <div class = 'btns'>
                <button id="reg_btn" @click="$router.push('register')" type="button" class="btn btn-success">Register</button>
                <button id="login_btn" @click="$router.push('login')" type="button" class="btn btn-primary">Login</button>
            </div>
        </div>
    
    </div>

    `,
    data() {
        return {}
    }
};


const NotFound = {
    name: 'NotFound',
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data() {
        return {}
    }
};

const LoginForm = {
    name: "login-form",
    // data(){
    //     return{
    //         isSuccessUpload:false,
    //         displayFlash:false,
    //         successmessage:"",
    //         errormessage:"",
            
    //     }
    // },

    template:`
    <div class = 'login-container'>
        <h2> Login to your account </h2>
    
        <form v-on:submit.prevent="loginUser" method="POST" enctype="multipart/form-data" id="loginForm">

        <div class="form-group">

            <label> Username </label><br>
            <input type="text" name="username"><br>

            <label> Password </label><br>
            <input type="password" name="password"><br>

        </div>
            <button class="btn btn-primary mb-2" > Login </button>
        </form>
    </div>
    
    `,data: function() {
        return {
            messages: '',
            token: ''
        }
     },
    methods: {
        loginUser(){
            let loginForm = document.getElementById('loginForm');
            let form_data = new FormData(loginForm);
            fetch("/api/auth/login", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                     },
                     credentials: 'same-origin'
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                console.log(jsonResponse);
                self.messages = jsonResponse;
                let tkn_jwt = jsonResponse.data.token;
                sessionStorage.setItem('token', tkn_jwt);
                console.info('Token stored in sessionStorage.');
                self.token = tkn_jwt;
                alert("Logged In!")
                router.push("/cars/new")
                /*location.reload()*/
                })
                .catch(function (error) {
                console.log(error);
                });

            }

    },  

};

const Logout = {
    name:"logout",
    template:`
        <div>Logging out...</div>
    
    `,

    methods: {
        logOut: function () {
            let self = this;
            fetch("/api/auth/logout", { method: 'GET', headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }})
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    let result = response.data;
                    alert(result.user.username + " logged out!")
                    sessionStorage.removeItem('token');
                    console.info('Token removed from sessionStorage.');
                    router.push("/")
                    location.reload()
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    },

    beforeMount(){
        this.logOut()
    }
};

    


const RegisterForm = {
    name: "register-form",
    // data(){
    //     return{
    //         isSuccessUpload:false,
    //         displayFlash:false,
    //         successmessage:"",
    //         errormessage:"",      
    //     }
    // },

    template:`
    <div>
    <h2> Register New User </h2>
   
    <form v-on:submit.prevent="registerUser" method="POST" enctype="multipart/form-data" id="registerForm">

    <div class="form-group">

        <label> Username </label><br>
        <input type="text" name="username"><br>

        <label> Password </label><br>
        <input type="text" name="password"><br>

        <label> Fullname </label><br>
        <input type="text" name="fullname"><br>
  
        <label> Email </label><br>
        <input type="text" name="email"><br>

        <label> Location </label><br>
        <input type="text" name="location"><br>


        <label> Biography </label><br>
        <textarea name="bio"> </textarea><br>

        <label> Upload Photo: </label><br>
        <input type="file" name="pic">

    </div>
        <button class="btn btn-primary mb-2" > Register </button>
    </form>
    </div>
    
    `,

    methods: {
        registerUser(){
            let registerForm = document.getElementById('registerForm');
            let form_data = new FormData(registerForm);
            fetch("/api/register", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                     },
                     credentials: 'same-origin'
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                //isSuccessUpload = true
                //this.successmessage = "File Uploaded Successfully"
                // display a success message
                console.log(jsonResponse);
                })
                .catch(function (error) {
                //this.errormessage = "Something went wrong"
                console.log(error);
                });

            }

    },  

};

const CarForm = {
    name: "car-form",
    // data(){
    //     return{
    //         isSuccessUpload:false,
    //         displayFlash:false,
    //         successmessage:"",
    //         errormessage:"",      
    //     }
    // },

    template:`
    <div>
    <h2> Add New Car </h2>
   
   
    <form v-on:submit.prevent="registerCar" method="POST" enctype="multipart/form-data" id="carForm">

    <div class="form-group">

        <label> Make </label><br>
        <input type="text" name="make"><br>

        <label> Model </label><br>
        <input type="text" name="model"><br>

        <label> Colour </label><br>
        <input type="text" name="colour"><br>
  
        <label> Year </label><br>
        <input type="text" name="year"><br>

        <label> Price </label><br>
        <input type="text" name="price"><br>


        <label> Car Type </label><br>
        <select name="cartype"> 
        <option value="SUV"> SUV </option>
        <option value="Sports Car"> Sports Car </option>
        <option value="Sedan"> Sedan </option>
        <option value="Coupe"> Coupe </option>
        </select><br>

       

        <label> Transmission </label><br>
        <select name="transmission"> 
        <option value=Automatic> Automatic </option>
        <option value=Manual> Manual </option>

        </select><br>


        <label> Description </label><br>
        <textarea name="description"> </textarea><br>

        <label> Upload Photo: </label><br>
        <input type="file" name="pic">

    </div>
        <button class="btn btn-primary mb-2" > Save </button>
    </form>
    </div>
    
    `,

    methods: {
        registerCar(){
            let carForm = document.getElementById('carForm');
            let form_data = new FormData(carForm);
            fetch("/api/cars", {
                method: 'POST',
                body: form_data,
                headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token') ,
                    'X-CSRFToken': token
                     },
                     credentials: 'same-origin'
                     
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                //isSuccessUpload = true
                //this.successmessage = "File Uploaded Successfully"
                // display a success message
                console.log(jsonResponse);
                })
                .catch(function (error) {
                //this.errormessage = "Something went wrong"
                console.log(error);
                });

            }

    },  

};

const Explore = {
    name: "explore",
    /*data(){
        return{
            isSuccessUpload:false,
            displayFlash:false,
            successmessage:"",
            errormessage:"",      
        }
    },*/

    template:`
    <div>
    <h2> Explore </h2>
    
   
    <form v-on:submit.prevent="exploreSearch" method="GET" enctype="multipart/form-data" id="searchForm">

    <div class="form-group">

        <label> Make </label><br>
        <input type="text" name="searchbymake" v-model="searchMake"><br>

        <label> Model </label><br>
        <input type="text" name="searchbymodel" v-model="searchModel"><br>

       
    </div>
        <button class="btn btn-primary mb-2" > Search </button>
    </form>
    </div>

    <ul>
    <li v-for="car in allcars">

    <img id="car_img" :src="'/static/uploads/' + car.photo" alt="car img"> 
    <p>  {{car.year}}  </p>
    <p>  {{car.price}}  </p>
    <p>  {{car.model}}  </p>
    <p>  {{car.make}}  </p>
    <button @click="carinfo(car.id)"> View More Details </button>
   

    </li>

    </ul>

    
    `,
    data: function() {
        return {
            allcars: [],
            userid: 0,
            searchMake: '',
            searchModel: ''
        }
     },

    methods: {
        exploreSearch(){
            let self = this;
            fetch('/api/search?searchbymake='+self.searchMake+ '&searchbymodel='+self.searchModel, {
                method: 'GET',
                headers:{ 'Authorization': 'Bearer ' + sessionStorage.getItem('token'),'X-CSRFToken': token } 
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                self.allcars=jsonResponse.searchedcars
                console.log(jsonResponse);
                })
                .catch(function (error) {
                //this.errormessage = "Something went wrong"
                console.log(error);
                });

            },

            pagestart: function(){
                let self = this;
                fetch("/api/cars", { method: 'GET', headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }})
                        .then(function (response) {
                            return response.json();
                            })
                            .then(function (jsonResponse) {
                                // display a success message
                                self.allcars=jsonResponse.allcars.slice(-3);
                                console.log(jsonResponse.allcars.slice(-3));
                                console.log(jsonResponse.test);
                                //console.log(jsonResponse.allcars);
                                
                            })
                            .catch(function (error) {
                                    console.log(error);
                                });
                    },
                    carinfo: function(car_id){ 
                        this.$router.push("/cars/"+car_id)
                       
                    },


    },
    created: function(){
        this.pagestart();
    }
};

const CarInfo = {
    name: "carinfo",
    props: ['car_id'],
    template: `

    <div>
    <h2>  {{year}} </h2>  <h2> {{make}} </h2> <br> 
    <p> {{model}} </p>  
    <p> {{description}} </p> <br>
    <p> {{colour}} </p> <br>
    <p> {{car_type}} </p> <br>
    <p> {{price}} </p> <br>
    <p> {{transmission}} </p>
    <img id="car_img" :src="'/static/uploads/' + photo" alt="car img"> 

    <button class="btn btn-primary mb-2" > Email Owner </button>
    <button class="btn btn-primary mb-2" > Favourites </button>

    </div>
    
    `,
    data: function() {
        return {
            
            year:"",
            price:0,
            model:"",
            description:"",
            colour:"",
            transmission:"",
            make:"",
            car_type:"",
            photo:""

            

        }
     },created: function(){
        let self = this;
        this.viewCarinfo(self.car_id);
    },

    methods: {
        viewCarinfo(car_id){
            let self = this;
            fetch('/api/cars/' + car_id, {
                method: 'GET',
                headers:{ 'Authorization': 'Bearer ' + sessionStorage.getItem('token'),'X-CSRFToken': token } 
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                self.year=jsonResponse.year;
                self.model=jsonResponse.model;
                self.make=jsonResponse.make;
                self.description=jsonResponse.description;
                self.colour=jsonResponse.colour;
                self.transmission=jsonResponse.transmission;
                self.photo=jsonResponse.photo;
                self.car_type=jsonResponse.car_type;
                self.price=jsonResponse.price;
                console.log(jsonResponse);
                
                
                })
                .catch(function (error) {
                //this.errormessage = "Something went wrong"
                console.log(error);
                });

            },

        },
        
    };
    






// Define Routes
const routes = [
    { path: "/", component: Home },
    { path: "/register" , component: RegisterForm},
    { path: "/login" , component: LoginForm},
    { path: "/cars/new" , component: CarForm},
    { path: "/explore" , component: Explore},
    { path: "/cars/:car_id" , component: CarInfo,props:true},
    { path: "/logout" , component: Logout},
   


    
    // Put other routes here

    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');