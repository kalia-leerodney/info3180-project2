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
                console.log("User ID retrieved");
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
    <div class="container">
        <div class = "left">
            <h2> Buy and Sell Cars Online </h2>
            <p> United Sales XYZ </p>
            <button id="home_btn1" @click="$router.push('register')" type="button" class="btn btn-success">Register</button>
            <button id="home_btn2" @click="$router.push('login')" type="button" class="btn btn-primary">Login</button>
        </div>
        <div class = "image">
            <img src="/static/car.jpeg" alt="car img">
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
    data(){
        return{
            isSuccessUpload:false,
            displayFlash:false,
            successmessage:"",
            errormessage:"",
            
        }
    },

    template:`
    <div>
    <h2> Login to your account </h2>
    <div  v-if="isSuccessUpload"> </div>
   
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

const RegisterForm = {
    name: "register-form",
    data(){
        return{
            isSuccessUpload:false,
            displayFlash:false,
            successmessage:"",
            errormessage:"",      
        }
    },

    template:`
    <div>
    <h2> Register New User </h2>
    <div  v-if="isSuccessUpload"> </div>
   
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
    data(){
        return{
            isSuccessUpload:false,
            displayFlash:false,
            successmessage:"",
            errormessage:"",      
        }
    },

    template:`
    <div>
    <h2> Add New Car </h2>
    <div  v-if="isSuccessUpload"> </div>
   
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

// Define Routes
const routes = [
    { path: "/", component: Home },
    { path: "/register" , component: RegisterForm},
    { path: "/login" , component: LoginForm},
    { path: "/cars/new" , component: CarForm},


    
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